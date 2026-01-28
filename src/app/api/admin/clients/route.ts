import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "CLIENT_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const whereClause: any = {};
    if (session.user.role === "CLIENT_ADMIN") {
        whereClause.id = session.user.clientId;
    }

    const clients = await prisma.client.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { 
            branches: true, 
            users: { where: { role: "EMPLOYEE" } } 
          }
        }
      }
    });

    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
    try {
      const session = await getServerSession(authOptions);
      if (!session || session.user.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const body = await req.json();
      const { name, code, address, settings } = body;

      if (!name || !code) {
          return NextResponse.json({ error: "Name and Code are required" }, { status: 400 });
      }
  
      const existing = await prisma.client.findUnique({ where: { code } });
      if (existing) {
          return NextResponse.json({ error: "Client code must be unique" }, { status: 400 });
      }

      const client = await prisma.client.create({
        data: {
            name,
            code,
            address,
            settings: settings ? JSON.stringify(settings) : JSON.stringify({ allowMobilePunch: true, geoFenceRadius: 100 })
        }
      });
  
      return NextResponse.json(client);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "SUPER_ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await prisma.client.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
