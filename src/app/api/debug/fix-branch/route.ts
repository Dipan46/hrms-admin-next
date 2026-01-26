import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Hardcoded fix for John's location
    const targetLat = 23.4144;
    const targetLon = 88.4853;

    // fix for John
    const user = await prisma.user.findUnique({
        where: { email: "john@acme.com" },
        include: { employeeProfile: { include: { branch: true } } }
    });

    if (!user || !user.employeeProfile || !user.employeeProfile.branch) {
        return NextResponse.json({ error: "John's branch not found" }, { status: 404 });
    }

    const branchId = user.employeeProfile.branch.id;
    const updated = await prisma.branch.update({
        where: { id: branchId },
        data: {
            latitude: targetLat,
            longitude: targetLon,
            name: "HQ - Kolkata (Fixed)"
        }
    });

    return NextResponse.json({
        message: "✅ Branch coordinates updated successfully!",
        old_branch: user.employeeProfile.branch,
        new_branch: updated
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
