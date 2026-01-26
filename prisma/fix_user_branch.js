const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // 1. Find John
    const user = await prisma.user.findUnique({
        where: { email: 'john@acme.com' },
        include: {
            employeeProfile: {
                include: { branch: true }
            }
        }
    });

    if (!user || !user.employeeProfile || !user.employeeProfile.branch) {
        console.log("❌ Error: John or his Profile/Branch not found!");
        // Fallback: Update ALL branches to be safe?
        // console.log("Updating ALL branches as fallback...");
        // await prisma.branch.updateMany({ data: { latitude: 23.4144, longitude: 88.4853 } });
        return;
    }

    const branchId = user.employeeProfile.branch.id;
    const currentCoords = `${user.employeeProfile.branch.latitude},${user.employeeProfile.branch.longitude}`;
    console.log(`ℹ️ John is assigned to Branch ID: ${branchId}`);
    console.log(`ℹ️ Current Branch Coords: ${currentCoords}`);

    // 2. Update THIS branch
    const updated = await prisma.branch.update({
        where: { id: branchId },
        data: {
            latitude: 23.4144,
            longitude: 88.4853,
            name: "HQ - User Location (Fixed)"
        }
    });

    console.log(`✅ Updated Branch ${updated.name} to 23.4144, 88.4853`);
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
