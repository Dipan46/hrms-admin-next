const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const client = await prisma.client.findUnique({ where: { code: 'ACME' } });
    if (!client) {
        console.log("Client ACME not found. Run master_seed.js first.");
        return;
    }

    const types = ["Sick Leave", "Casual Leave", "Privilege Leave"];

    for (const name of types) {
        const existing = await prisma.leaveType.findFirst({
            where: { name, clientId: client.id }
        });

        if (!existing) {
            await prisma.leaveType.create({
                data: {
                    name,
                    clientId: client.id
                }
            });
            console.log(`Created Leave Type: ${name}`);
        } else {
            console.log(`Leave Type exists: ${name}`);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
