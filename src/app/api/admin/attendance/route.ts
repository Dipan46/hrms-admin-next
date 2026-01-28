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
    // Compares punch-in hour:minute with shift start hour:minute
    const calculatePunctuality = (inTime: Date | string | null, shift: any): { isLate: boolean; punctuality: string; lateByMinutes: number } => {
        // If no inTime or no shift, return UNKNOWN
        if (!inTime) {
            console.log('Punctuality: No inTime provided');
            return { isLate: false, punctuality: 'UNKNOWN', lateByMinutes: 0 };
        }
        
        if (!shift || !shift.startTime) {
            console.log('Punctuality: No shift or shift.startTime provided');
            return { isLate: false, punctuality: 'UNKNOWN', lateByMinutes: 0 };
        }

        // Parse punch time
        const punchDate = new Date(inTime);
        const punchHour = punchDate.getHours();
        const punchMinute = punchDate.getMinutes();
        const punchTotalMinutes = punchHour * 60 + punchMinute;

        // Parse shift start time (format: "09:00" or "10:00")
        const shiftTimeParts = shift.startTime.split(':');
        const shiftHour = parseInt(shiftTimeParts[0], 10);
        const shiftMinute = parseInt(shiftTimeParts[1], 10);
        const shiftTotalMinutes = shiftHour * 60 + shiftMinute;

        // Grace period in minutes (default 15)
        const gracePeriod = shift.gracePeriod || 15;
        const graceEndMinutes = shiftTotalMinutes + gracePeriod;

        // Calculate how many minutes after shift start
        const diffMinutes = punchTotalMinutes - shiftTotalMinutes;

        console.log(`Punctuality Debug: Employee punch at ${punchHour}:${punchMinute} (${punchTotalMinutes} min), Shift starts at ${shiftHour}:${shiftMinute} (${shiftTotalMinutes} min), Grace ends at ${graceEndMinutes} min, Diff=${diffMinutes} min`);

        if (punchTotalMinutes <= shiftTotalMinutes) {
            // Punched before or exactly at shift start
            return { isLate: false, punctuality: 'EARLY', lateByMinutes: 0 };
        } else if (punchTotalMinutes <= graceEndMinutes) {
            // Punched within grace period
            return { isLate: false, punctuality: 'ON_TIME', lateByMinutes: 0 };
        } else {
            // Late - punched after grace period
            return { isLate: true, punctuality: 'LATE', lateByMinutes: diffMinutes };
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
