
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { companyName, companyCode, adminName, email, password } = await req.json();

    if (!companyName || !companyCode || !adminName || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Check if client code exists
    const existingClient = await prisma.client.findUnique({
      where: { code: companyCode.toUpperCase() }
    });
    if (existingClient) {
      return NextResponse.json({ message: "Company code already exists" }, { status: 400 });
    }

    // Check if user email exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    if (existingUser) {
        return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Transaction to create Client and Admin
    await prisma.$transaction(async (tx) => {
        const client = await tx.client.create({
            data: {
                name: companyName,
                code: companyCode.toUpperCase(),
            }
        });

        await tx.user.create({
            data: {
                name: adminName,
                email,
                password: hashedPassword,
                role: "CLIENT_ADMIN",
                clientId: client.id
            }
        });
    });

    return NextResponse.json({ message: "Organization registered successfully" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error registering organization" }, { status: 500 });
  }
}
