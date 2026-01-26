import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "CLIENT_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const whereClause: any = { role: "EMPLOYEE" };

    if (session.user.role === "CLIENT_ADMIN") {
        whereClause.clientId = session.user.clientId;
    }

    const employees = await prisma.user.findMany({
      where: whereClause,
      include: {
        client: true,
        employeeProfile: {
          include: {
            branch: true,
            shift: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
    try {
      const session = await getServerSession(authOptions);
      if (!session || !["SUPER_ADMIN", "CLIENT_ADMIN"].includes(session.user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const body = await req.json();
      const { name, email, password, clientId, branchId, shiftId } = body;

      if (!name || !email || !password || !clientId) {
          return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
          return NextResponse.json({ error: "Email already exists" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: "EMPLOYEE",
            clientId,
            employeeProfile: {
                create: {
                    branchId: branchId || undefined,
                    shiftId: shiftId || undefined
                }
            }
        }
      });
  
      return NextResponse.json(user);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
