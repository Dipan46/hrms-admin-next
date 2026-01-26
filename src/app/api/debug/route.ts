import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const clients = await prisma.client.findMany();
    const seededTypes = [];

    // Auto-seed Leave Types if missing
    for (const client of clients) {
        const types = ["Sick Leave", "Casual Leave", "Privilege Leave"];
        for (const name of types) {
            const existing = await prisma.leaveType.findFirst({
                where: { name, clientId: client.id }
            });
            if (!existing) {
                const newType = await prisma.leaveType.create({
                    data: { name, clientId: client.id }
                });
                seededTypes.push(newType);
            }
        }
    }

    const allTypes = await prisma.leaveType.findMany();
    const john = await prisma.user.findUnique({
        where: { email: "john@acme.com" },
        include: { client: true }
    });

    return NextResponse.json({
        message: seededTypes.length > 0 ? "✅ Automatically seeded missing leave types!" : "Data is already correct.",
        clients,
        leaveTypes: allTypes,
        user_john: john,
        seeded_now: seededTypes
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
