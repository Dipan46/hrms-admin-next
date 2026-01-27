import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.clientId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const types = await prisma.leaveType.findMany({
        where: { clientId: session.user.clientId },
        orderBy: { name: 'asc' }
    });

    return NextResponse.json(types);
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["SUPER_ADMIN", "CLIENT_ADMIN"].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const leaveType = await prisma.leaveType.create({
            data: {
                name,
                clientId: session.user.clientId! // We know clientId exists for these roles
            }
        });

        return NextResponse.json(leaveType);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
