const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("--- BRANCHES ---");
    const branches = await prisma.branch.findMany();
    console.dir(branches, { depth: null });
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
