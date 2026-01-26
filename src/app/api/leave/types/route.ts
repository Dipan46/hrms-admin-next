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
        where: { clientId: session.user.clientId }
    });

    return NextResponse.json(types);
}
