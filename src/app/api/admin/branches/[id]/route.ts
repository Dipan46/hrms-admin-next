import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const session = await getServerSession(authOptions);
      if (!session || !["SUPER_ADMIN", "CLIENT_ADMIN"].includes(session.user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const { id } = params;

      if (session.user.role === "CLIENT_ADMIN") {
        const target = await prisma.branch.findUnique({ where: { id } });
        if (target?.clientId !== session.user.clientId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
      }
  
      await prisma.branch.delete({ where: { id } });
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const session = await getServerSession(authOptions);
      if (!session || !["SUPER_ADMIN", "CLIENT_ADMIN"].includes(session.user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const { id } = params;
      const body = await req.json();

      if (session.user.role === "CLIENT_ADMIN") {
        const target = await prisma.branch.findUnique({ where: { id } });
        if (target?.clientId !== session.user.clientId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
      }
  
      const updated = await prisma.branch.update({
          where: { id },
          data: {
              name: body.name,
              latitude: body.latitude ? parseFloat(body.latitude) : null,
              longitude: body.longitude ? parseFloat(body.longitude) : null,
              radius: body.radius ? parseInt(body.radius) : 100
          }
      });

      return NextResponse.json(updated);
    } catch (error) {
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
