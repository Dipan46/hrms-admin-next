import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "CLIENT_ADMIN"].includes(session.user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query params (optional for now, can add date/clientId filtering)
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date"); // YYYY-MM-DD
    
    const whereClause: any = {};
    
    if (date) {
        whereClause.date = new Date(date);
    }
    
    if (session.user.role === "CLIENT_ADMIN") {
        whereClause.employee = {
            user: {
                clientId: session.user.clientId
            }
        };
    }

    const logs = await prisma.attendanceLog.findMany({
        where: whereClause,
        include: {
            employee: {
                include: {
                    user: { select: { name: true, email: true } },
                    branch: { select: { name: true } },
                    shift: { select: { name: true, startTime: true, endTime: true } }
                }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 100 // Limit for performance
    });

    // Helper function to check if employee is late
    const calculatePunctuality = (inTime: Date | null, shift: any): { isLate: boolean; punctuality: string; lateByMinutes: number } => {
        if (!inTime || !shift?.startTime) {
            return { isLate: false, punctuality: 'UNKNOWN', lateByMinutes: 0 };
        }

        // Parse shift start time (format: "09:00")
        const [shiftHours, shiftMinutes] = shift.startTime.split(':').map(Number);
        const gracePeriod = shift.gracePeriod || 15; // Default 15 minutes grace

        // Create shift start datetime for the same day as inTime
        const shiftStart = new Date(inTime);
        shiftStart.setHours(shiftHours, shiftMinutes, 0, 0);

        // Add grace period
        const graceEnd = new Date(shiftStart.getTime() + gracePeriod * 60 * 1000);

        // Calculate difference in minutes
        const diffMinutes = Math.floor((inTime.getTime() - shiftStart.getTime()) / (1000 * 60));

        if (inTime <= shiftStart) {
            return { isLate: false, punctuality: 'EARLY', lateByMinutes: 0 };
        } else if (inTime <= graceEnd) {
            return { isLate: false, punctuality: 'ON_TIME', lateByMinutes: 0 };
        } else {
            return { isLate: true, punctuality: 'LATE', lateByMinutes: diffMinutes - gracePeriod };
        }
    };

    // Flatten data for easier frontend consumption
    const formattedLogs = logs.map(log => {
        const punctualityInfo = calculatePunctuality(log.inTime, log.employee.shift);
        return {
            id: log.id,
            employeeName: log.employee.user.name,
            branchName: log.employee.branch?.name,
            shiftName: log.employee.shift?.name,
            shiftStart: log.employee.shift?.startTime,
            date: log.date,
            inTime: log.inTime,
            outTime: log.outTime,
            status: log.status,
            locationType: log.locationType,
            isLate: punctualityInfo.isLate,
            punctuality: punctualityInfo.punctuality,
            lateByMinutes: punctualityInfo.lateByMinutes
        };
    });

    return NextResponse.json(formattedLogs);
}
