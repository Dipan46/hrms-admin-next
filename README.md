# HRMS System

## Setup Instructions

Since the automated setup could not run in your environment, please follow these steps manually:

1.  Open a terminal in this folder (`c:\Users\dipan\OneDrive\Desktop\HRMS`).
2.  Run `npm install` to install dependencies.
3.  Run `npx prisma generate` to create the database client.
4.  Run `npx prisma db push` to create the database file (`dev.db`).
5.  Run `node prisma/seed.js` to create the Super Admin user.
6.  Run `npm run dev` to start the application.

## Credentials
- **Super Admin Email**: admin@hrms.com
- **Password**: admin123
# hrms-admin-next
