const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Master Seed...");

    // Helper function to create employee
    async function createEmployee(email, name, password, clientId, branchId, shiftId) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const existing = await prisma.user.findUnique({
            where: { email },
            include: { employeeProfile: true }
        });

        if (!existing) {
            await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: 'EMPLOYEE',
                    clientId,
                    employeeProfile: {
                        create: { branchId, shiftId }
                    }
                }
            });
            console.log(`✅ Employee created: ${email}`);
        } else {
            if (!existing.employeeProfile) {
                await prisma.employeeProfile.create({
                    data: { userId: existing.id, branchId, shiftId }
                });
            }
            console.log(`ℹ️ Employee exists: ${email}`);
        }
    }

    // ==========================================
    // CLIENT 1: Acme Corp
    // ==========================================
    let client1 = await prisma.client.findUnique({ where: { code: 'ACME' } });
    if (!client1) {
        client1 = await prisma.client.create({
            data: {
                name: 'Acme Corp',
                code: 'ACME',
                address: '123 Tech Park, Bangalore',
                settings: JSON.stringify({ allowMobilePunch: true, geoFenceRadius: 5000 })
            }
        });
        console.log('✅ Client created: Acme Corp');
    } else {
        console.log('ℹ️ Client exists: Acme Corp');
    }

    // Acme Branch
    let acmeBranch = await prisma.branch.findFirst({ where: { clientId: client1.id, name: 'HQ - Bangalore' } });
    if (!acmeBranch) {
        acmeBranch = await prisma.branch.create({
            data: {
                name: 'HQ - Bangalore',
                clientId: client1.id,
                latitude: 12.9716,
                longitude: 77.5946,
                radius: 5000
            }
        });
        console.log('✅ Branch created: Acme HQ');
    }

    // Acme Shift
    let acmeShift = await prisma.shift.findFirst({ where: { clientId: client1.id } });
    if (!acmeShift) {
        acmeShift = await prisma.shift.create({
            data: {
                name: 'General Shift',
                clientId: client1.id,
                startTime: '09:00',
                endTime: '18:00'
            }
        });
        console.log('✅ Shift created: Acme General');
    }

    // Acme Leave Types
    const acmeLeaveTypes = ['Casual Leave', 'Sick Leave', 'Earned Leave'];
    for (const typeName of acmeLeaveTypes) {
        const exists = await prisma.leaveType.findFirst({ where: { clientId: client1.id, name: typeName } });
        if (!exists) {
            await prisma.leaveType.create({ data: { name: typeName, clientId: client1.id } });
            console.log(`✅ Leave type created: ${typeName} (Acme)`);
        }
    }

    // ==========================================
    // CLIENT 2: TechStart Inc
    // ==========================================
    let client2 = await prisma.client.findUnique({ where: { code: 'TECH' } });
    if (!client2) {
        client2 = await prisma.client.create({
            data: {
                name: 'TechStart Inc',
                code: 'TECH',
                address: '456 Innovation Hub, Mumbai',
                settings: JSON.stringify({ allowMobilePunch: true, geoFenceRadius: 3000 })
            }
        });
        console.log('✅ Client created: TechStart Inc');
    } else {
        console.log('ℹ️ Client exists: TechStart Inc');
    }

    // TechStart Branch
    let techBranch = await prisma.branch.findFirst({ where: { clientId: client2.id } });
    if (!techBranch) {
        techBranch = await prisma.branch.create({
            data: {
                name: 'Mumbai Office',
                clientId: client2.id,
                latitude: 19.0760,
                longitude: 72.8777,
                radius: 3000
            }
        });
        console.log('✅ Branch created: TechStart Mumbai');
    }

    // TechStart Shift
    let techShift = await prisma.shift.findFirst({ where: { clientId: client2.id } });
    if (!techShift) {
        techShift = await prisma.shift.create({
            data: {
                name: 'Flexi Shift',
                clientId: client2.id,
                startTime: '10:00',
                endTime: '19:00'
            }
        });
        console.log('✅ Shift created: TechStart Flexi');
    }

    // TechStart Leave Types
    for (const typeName of ['Annual Leave', 'Sick Leave']) {
        const exists = await prisma.leaveType.findFirst({ where: { clientId: client2.id, name: typeName } });
        if (!exists) {
            await prisma.leaveType.create({ data: { name: typeName, clientId: client2.id } });
            console.log(`✅ Leave type created: ${typeName} (TechStart)`);
        }
    }

    // ==========================================
    // SUPER ADMIN
    // ==========================================
    const adminEmail = 'admin@hrms.com';
    const adminPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
        where: { email: adminEmail },
        update: { password: adminPassword, role: 'SUPER_ADMIN' },
        create: {
            email: adminEmail,
            password: adminPassword,
            name: 'Super Admin',
            role: 'SUPER_ADMIN'
        }
    });
    console.log('✅ Super Admin: admin@hrms.com / admin123');

    // ==========================================
    // CLIENT ADMINS
    // ==========================================
    // Acme Client Admin
    const acmeAdminEmail = 'hradmin@acme.com';
    const acmeAdminPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
        where: { email: acmeAdminEmail },
        update: { password: acmeAdminPassword, role: 'CLIENT_ADMIN', clientId: client1.id },
        create: {
            email: acmeAdminEmail,
            password: acmeAdminPassword,
            name: 'Acme HR Admin',
            role: 'CLIENT_ADMIN',
            clientId: client1.id
        }
    });
    console.log('✅ Client Admin (Acme): hradmin@acme.com / admin123');

    // TechStart Client Admin
    const techAdminEmail = 'hradmin@techstart.com';
    const techAdminPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
        where: { email: techAdminEmail },
        update: { password: techAdminPassword, role: 'CLIENT_ADMIN', clientId: client2.id },
        create: {
            email: techAdminEmail,
            password: techAdminPassword,
            name: 'TechStart HR Admin',
            role: 'CLIENT_ADMIN',
            clientId: client2.id
        }
    });
    console.log('✅ Client Admin (TechStart): hradmin@techstart.com / admin123');

    // ==========================================
    // EMPLOYEES - Acme Corp (3 employees)
    // ==========================================
    await createEmployee('john@acme.com', 'John Doe', 'user123', client1.id, acmeBranch.id, acmeShift.id);
    await createEmployee('jane@acme.com', 'Jane Smith', 'user123', client1.id, acmeBranch.id, acmeShift.id);
    await createEmployee('mike@acme.com', 'Mike Johnson', 'user123', client1.id, acmeBranch.id, acmeShift.id);

    // ==========================================
    // EMPLOYEES - TechStart Inc (2 employees)
    // ==========================================
    await createEmployee('alice@techstart.com', 'Alice Brown', 'user123', client2.id, techBranch.id, techShift.id);
    await createEmployee('bob@techstart.com', 'Bob Wilson', 'user123', client2.id, techBranch.id, techShift.id);

    // ==========================================
    // HOLIDAYS
    // ==========================================
    const holidays = [
        { name: 'Republic Day', date: new Date('2026-01-26') },
        { name: 'Holi', date: new Date('2026-03-14') },
        { name: 'Independence Day', date: new Date('2026-08-15') },
        { name: 'Diwali', date: new Date('2026-11-01') }
    ];

    for (const holiday of holidays) {
        // Add to both clients
        for (const client of [client1, client2]) {
            const exists = await prisma.holiday.findFirst({
                where: { clientId: client.id, name: holiday.name }
            });
            if (!exists) {
                await prisma.holiday.create({
                    data: { ...holiday, clientId: client.id }
                });
            }
        }
    }
    console.log('✅ Holidays created for both clients');

    console.log("\n🎉 Master Seed Complete!");
    console.log("\n📋 Test Credentials:");
    console.log("   Super Admin: admin@hrms.com / admin123");
    console.log("   Client Admin (Acme): hradmin@acme.com / admin123");
    console.log("   Client Admin (TechStart): hradmin@techstart.com / admin123");
    console.log("   Employee (Acme): john@acme.com / user123");
    console.log("   Employee (TechStart): alice@techstart.com / user123");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
