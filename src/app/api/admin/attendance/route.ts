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

    // Flatten data for easier frontend consumption
    const formattedLogs = logs.map(log => ({
        id: log.id,
        employeeName: log.employee.user.name,
        branchName: log.employee.branch?.name,
        date: log.date,
        inTime: log.inTime,
        outTime: log.outTime,
        status: log.status,
        locationType: log.locationType
    }));

    return NextResponse.json(formattedLogs);
}
