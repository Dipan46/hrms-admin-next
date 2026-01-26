const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
    const email = 'john@acme.com';
    const newPassword = 'user123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    let log = `Checking user: ${email}\n`;

    const user = await prisma.user.findUnique({
        where: { email },
        include: { employeeProfile: true }
    });

    if (!user) {
        log += "User not found. Creating...\n";
        // Fetch client and branch again to be safe
        const client = await prisma.client.findFirst();
        const branch = await prisma.branch.findFirst();
        const shift = await prisma.shift.findFirst();

        if (!client || !branch) {
            log += "Error: No Client or Branch found to link user.\n";
        } else {
            await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name: 'John Doe',
                    role: 'EMPLOYEE',
                    clientId: client.id,
                    employeeProfile: {
                        create: {
                            branchId: branch.id,
                            shiftId: shift ? shift.id : undefined,
                        },
                    },
                },
            });
            log += "User created successfully with password: user123\n";
        }
    } else {
        log += `User found. ID: ${user.id}\n`;
        log += `Role: ${user.role}\n`;
        log += `Employee Profile: ${user.employeeProfile ? 'YES' : 'NO'}\n`;

        // Update password
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });
        log += "Password reset to: user123\n";
    }

    // Write log to file
    fs.writeFileSync('verify_log.txt', log);
    console.log(log);
}

main()
    .catch((e) => {
        fs.writeFileSync('verify_log.txt', `Error: ${e.message}`);
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
