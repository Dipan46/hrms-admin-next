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

        // Optional: Check if used in requests before deleting?
        // For now, simpler delete. Prisma might throw if foreign key constraints exist unless cascade is on.
        // Assuming strict for safety, but if user wants to force delete we'd need to handle that.
        // Let's try simple delete.

        await prisma.leaveType.delete({
            where: { 
                id,
                clientId: session.user.clientId! // Ensure deleting own client's type
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
