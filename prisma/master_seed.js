const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Master Seed...");

    // 1. Create or Find Client
    let client = await prisma.client.findUnique({ where: { code: 'ACME' } });
    if (!client) {
        client = await prisma.client.create({
            data: {
                name: 'Acme Corp',
                code: 'ACME',
                address: '123 Tech Park',
                settings: JSON.stringify({ allowMobilePunch: true, geoFenceRadius: 5000 }), // Large radius for testing
            },
        });
        console.log('✅ Client created: Acme Corp');
    } else {
        console.log('ℹ️ Client already exists: Acme Corp');
    }

    // 2. Create or Find Branch
    let branch = await prisma.branch.findFirst({ where: { clientId: client.id } });
    if (!branch) {
        branch = await prisma.branch.create({
            data: {
                name: 'HQ - Bangalore',
                clientId: client.id,
                latitude: 23.4144,
                longitude: 88.4853,
                radius: 5000, // 5km radius for easier testing
            },
        });
        console.log('✅ Branch created: HQ');
    } else {
        console.log('ℹ️ Branch already exists: HQ');
    }

    // 3. Create or Find Shift
    let shift = await prisma.shift.findFirst({ where: { clientId: client.id } });
    if (!shift) {
        shift = await prisma.shift.create({
            data: {
                name: 'General Shift',
                clientId: client.id,
                startTime: '09:00',
                endTime: '18:00',
            },
        });
        console.log('✅ Shift created: General');
    } else {
        console.log('ℹ️ Shift already exists: General');
    }

    // 4. Upsert Super Admin
    const adminEmail = 'admin@hrms.com';
    const adminPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
        where: { email: adminEmail },
        update: { password: adminPassword, role: 'SUPER_ADMIN' },
        create: {
            email: adminEmail,
            password: adminPassword,
            name: 'Super Admin',
            role: 'SUPER_ADMIN',
        },
    });
    console.log('✅ Super Admin ensured: admin@hrms.com / admin123');

    // 5. Upsert Employee User
    const employeeEmail = 'john@acme.com';
    const employeePassword = await bcrypt.hash('user123', 10);

    const existingEmpUser = await prisma.user.findUnique({
        where: { email: employeeEmail },
        include: { employeeProfile: true }
    });

    if (!existingEmpUser) {
        await prisma.user.create({
            data: {
                email: employeeEmail,
                password: employeePassword,
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
        console.log('✅ Employee created: john@acme.com / user123');
    } else {
        // Ensure profile exists
        if (!existingEmpUser.employeeProfile) {
            await prisma.employeeProfile.create({
                data: {
                    userId: existingEmpUser.id,
                    branchId: branch.id,
                    shiftId: shift.id
                }
            });
            console.log('✅ Added missing profile to John Doe');
        }
        // Update password just in case
        await prisma.user.update({
            where: { email: employeeEmail },
            data: { password: employeePassword }
        });
        console.log('✅ Employee ensured: john@acme.com / user123');
    }

    console.log("Master Seed Complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
