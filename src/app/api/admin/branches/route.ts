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

    const branches = await prisma.branch.findMany({
        where: whereClause,
        include: { client: true }
    });
    return NextResponse.json(branches);
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["SUPER_ADMIN", "CLIENT_ADMIN"].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, latitude, longitude, radius, clientId } = body;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        // Determine effective clientId
        const effectiveClientId = session.user.role === "CLIENT_ADMIN" ? session.user.clientId : clientId;

        if (!effectiveClientId) {
             return NextResponse.json({ error: "Client ID required" }, { status: 400 });
        }

        const branch = await prisma.branch.create({
            data: {
                name,
                clientId: effectiveClientId,
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
                radius: radius ? parseInt(radius) : 100
            }
        });

        return NextResponse.json(branch);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
