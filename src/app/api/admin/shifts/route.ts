import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "CLIENT_ADMIN"].includes(session.user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const whereClause: any = {};
    if (session.user.role === "CLIENT_ADMIN") {
        whereClause.clientId = session.user.clientId;
    }

    const shifts = await prisma.shift.findMany({
         where: whereClause,
         include: { client: true }
    });
    return NextResponse.json(shifts);
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["SUPER_ADMIN", "CLIENT_ADMIN"].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, startTime, endTime, clientId } = body;

        if (!name || !startTime || !endTime || !clientId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const shift = await prisma.shift.create({
            data: {
                name,
                startTime,
                endTime,
                clientId
            }
        });

        return NextResponse.json(shift);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
