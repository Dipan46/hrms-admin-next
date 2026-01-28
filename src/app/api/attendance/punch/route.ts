import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AttendanceService } from "@/lib/services/attendanceService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.employeeId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { latitude, longitude, locationType, image } = body;

    if (!latitude || !longitude || !locationType) {
      return NextResponse.json({ error: "Missing location data" }, { status: 400 });
    }

    // Fetch Employee Profile with Branch info
    const employee = await prisma.employeeProfile.findUnique({
      where: { id: session.user.employeeId },
      include: { branch: true },
    });

    if (!employee || !employee.branch) {
      return NextResponse.json({ error: "Employee or Branch not found" }, { status: 404 });
    }

    // Validate Geofence if Office
    if (locationType === "OFFICE") {
        const { latitude: branchLat, longitude: branchLon, radius } = employee.branch;
        
        if (branchLat && branchLon) {
             const userLat = parseFloat(latitude);
             const userLon = parseFloat(longitude);
             const targetLat = parseFloat(branchLat.toString());
             const targetLon = parseFloat(branchLon.toString());
             const allowedRadius = radius ? parseInt(radius.toString()) : 100;

             const isInside = AttendanceService.validateGeofence(
                userLat,
                userLon,
                targetLat,
                targetLon,
                allowedRadius
             );

             if (!isInside) {
                 const distance = AttendanceService.calculateDistance(
                     userLat, userLon, targetLat, targetLon
                 );
                 console.log(`Geofence Fail: Distance ${distance}m > ${allowedRadius}m`);

                 return NextResponse.json({ 
                     error: `You are outside office premises. Distance: ${Math.round(distance)}m (Allowed: ${allowedRadius}m)` 
                 }, { status: 400 });
             }
        }
    }

    // Check for existing punch today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingLog = await prisma.attendanceLog.findFirst({
        where: {
            employeeId: employee.id,
            date: today
        },
        orderBy: { createdAt: 'desc' }
    });

    let message = "Punch In Successful";
    
    // Simple logic: If no log or last log has outTime, create new. Else update outTime.
    // For MVP, we will just create a new record if it is the first punch, or update if user wants to punch out.
    // However, the requirement says "Punch In" and "Punch Out" are explicit actions. 
    // Let's assume the UI sends an "action" field or we infer it. 
    // For now, let's implement a toggle logic or explicit body param.
    
    const action = body.action; // "IN" or "OUT"

    if (action === "IN") {
         if (existingLog && !existingLog.outTime) {
             return NextResponse.json({ error: "You are already punched in" }, { status: 400 });
         }
         
         await prisma.attendanceLog.create({
             data: {
                 employeeId: employee.id,
                 date: today,
                 inTime: new Date(),
                 locationType,
                 latitude,
                 longitude,
                 status: "PRESENT"
             }
         });
    } else if (action === "OUT") {
        if (!existingLog || existingLog.outTime) {
            return NextResponse.json({ error: "You are not punched in" }, { status: 400 });
        }

        await prisma.attendanceLog.update({
            where: { id: existingLog.id },
            data: {
                outTime: new Date()
            }
        });
        message = "Punch Out Successful";
    }

    return NextResponse.json({ success: true, message });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.employeeId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const log = await prisma.attendanceLog.findFirst({
        where: {
            employeeId: session.user.employeeId,
            date: today
        },
        orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ 
        punchedIn: !!(log && !log.outTime),
        lastLog: log 
    });
}
