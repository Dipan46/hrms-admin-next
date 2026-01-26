import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.employeeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { leaveTypeId, startDate, endDate, reason } = body;

        if (!leaveTypeId || !startDate || !endDate) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const request = await prisma.leaveRequest.create({
            data: {
                employeeId: session.user.employeeId,
                leaveTypeId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                reason,
                status: "PENDING"
            }
        });

        return NextResponse.json(request);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Filters
    // Filters
    const where: any = {};
    
    if (session.user.role === "EMPLOYEE") {
        if (!session.user.employeeId) return NextResponse.json([]);
        where.employeeId = session.user.employeeId;
    } else if (session.user.role === "CLIENT_ADMIN") {
         where.employee = {
             user: { clientId: session.user.clientId }
         };
    } else if (session.user.role === "SUPER_ADMIN") {
        // No filter, sees everything
    } else {
        // Manager or other roles not yet fully supported for this view
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const requests = await prisma.leaveRequest.findMany({
        where,
        include: {
            leaveType: true,
            employee: {
                include: { user: { select: { name: true } } }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(requests);
}
