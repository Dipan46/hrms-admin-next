import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

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

    // Security check: Ensure Client Admin only deletes their own
    if (session.user.role === "CLIENT_ADMIN") {
        const target = await prisma.user.findUnique({ where: { id } });
        if (target?.clientId !== session.user.clientId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
    }

    await prisma.user.delete({ where: { id } });
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

    // Security check
    if (session.user.role === "CLIENT_ADMIN") {
        const target = await prisma.user.findUnique({ where: { id } });
        if (target?.clientId !== session.user.clientId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
    }

    // Build update data
    const updateData: any = {
        name: body.name,
        email: body.email,
        employeeProfile: {
            update: {
                branchId: body.branchId || null,
                shiftId: body.shiftId || null
            }
        }
    };

    // Only update password if provided (not empty)
    if (body.password && body.password.trim() !== "") {
        updateData.password = await bcrypt.hash(body.password, 10);
    }

    const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        include: {
            employeeProfile: {
                include: {
                    branch: true,
                    shift: true
                }
            }
        }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
