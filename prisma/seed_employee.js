const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    // 1. Create Client
    let client = await prisma.client.findUnique({ where: { code: 'ACME' } });
    if (!client) {
        client = await prisma.client.create({
            data: {
                name: 'Acme Corp',
                code: 'ACME',
                address: '123 Tech Park',
                settings: JSON.stringify({ allowMobilePunch: true, geoFenceRadius: 200 }),
            },
        });
        console.log('Client created: Acme Corp');
    }

    // 2. Create Branch
    const branch = await prisma.branch.create({
        data: {
            name: 'HQ - Bangalore',
            clientId: client.id,
            latitude: 12.9716, // Example: Bangalore
            longitude: 77.5946,
            radius: 500,
        },
    });
    console.log('Branch created: HQ');

    // 3. Create Shift
    const shift = await prisma.shift.create({
        data: {
            name: 'General Shift',
            clientId: client.id,
            startTime: '09:00',
            endTime: '18:00',
        },
    });
    console.log('Shift created: General');

    // 4. Create Employee User
    const email = 'john@acme.com';
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
        const hashedPassword = await bcrypt.hash('user123', 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: 'John Doe',
                role: 'EMPLOYEE',
                clientId: client.id,
                employeeProfile: {
                    create: {
                        branchId: branch.id,
                        shiftId: shift.id,
                    },
                },
            },
        });
        console.log('Employee created: john@acme.com');
    } else {
        console.log('Employee checks out.');
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
