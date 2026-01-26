const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const branch = await prisma.branch.findFirst();
    if (!branch) {
        console.log("No branch found.");
        return;
    }

    const updated = await prisma.branch.update({
        where: { id: branch.id },
        data: {
            latitude: 23.4144,
            longitude: 88.4853,
            name: "HQ - User Location"
        }
    });

    console.log("✅ Branch coordinates updated:", updated);
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
