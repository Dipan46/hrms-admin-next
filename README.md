# HRMS Admin Next

![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38bdf8)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)

A comprehensive **Human Resource Management System (HRMS)** built with **Next.js 14**, designed to streamline employee management, attendance tracking, and leave workflows for multi-tenant organizations.

🚀 **Live Demo on Vercel**: [View Deployment](https://hrms-admin-next.vercel.app/)

## 📖 Table of Contents
- [Features](#-features)
- [Preview](#-preview)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## ✨ Features

### 🏢 Organization Management
- **Multi-Tenancy**: Support for multiple organizations (Clients) in a single instance.
- **Branches**: Manage multiple office locations with Geofencing support (Latitude/Longitude/Radius).
- **Shifts**: Define custom shift timings with grace periods for late entries.

### 👥 User Roles & Permissions
- **Super Admin**: System-wide control.
- **Client Admin**: Manage specific organization settings and employees.
- **Manager**: View team attendance and approve leave requests.
- **Employee**: Self-service portal for attendance and leaves.

### 📍 Smart Attendance
- **Geofencing**: Employees can only check in when physically within the branch's radius (optional).
- **Location Types**: Support for Office, Work From Home (WFH), and Travel modes.
- **Real-time Logs**: Tracks Check-In, Check-Out, and location coordinates.

### 📅 Leave Management
- **Workflow**: Apply -> Manager Approval/Rejection -> Notification.
- **Leave Types**: Configurable leave types (Sick, Casual, Paid, etc.).

---

## 📸 Preview

![Preview](./prev/1.png)
![Preview](./prev/2.png)
![Preview](./prev/3.png)
![Preview](./prev/4.png)
![Preview](./prev/5.png)
![Preview](./prev/6.png)
![Preview](./prev/7.png)
![Preview](./prev/8.png)
![Preview](./prev/9.png)
![Preview](./prev/10.png)
![Preview](./prev/11.png)
![Preview](./prev/12.png)
![Preview](./prev/13.png)

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via Neon/Supabase)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [clsx](https://github.com/lukeed/clsx)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Credentials Provider)
- **UI Components**: [Lucide React](https://lucide.dev/) (Icons)

---

## 🏗 Architecture

The application follows a modern **Server Component** architecture using Next.js 14 App Router.

- **`src/app`**: Contains all routes. Folders in `(admin)` and `(employee)` groups organize the different dashboards.
- **`prisma/schema.prisma`**: Defines the data model (User, specific EmployeeProfile, AttendanceLog, etc.).
- **Server Actions** (if applicable): Used for form mutations to ensure type safety and reduced client-side Javascript.
- **Middleware**: `middleware.ts` handles route protection and role-based redirection.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL Database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dipan46/hrms-admin-next.git
   cd hrms-admin-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"  # Generate using: openssl rand -base64 32
   ```

4. **Setup Database**
   ```bash
   npx prisma db push
   # or
   npx prisma migrate dev
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## 📂 Project Structure

```bash
├── prisma/
│   └── schema.prisma    # Database schema
├── public/              # Static assets
├── src/
│   ├── app/
│   │   ├── admin/       # Admin dashboard routes
│   │   ├── employee/    # Employee dashboard routes
│   │   ├── api/         # Backend API routes
│   │   └── login/       # Auth pages
│   ├── components/      # Reusable UI components
│   ├── lib/             # Utilities (db connection, helpers)
│   └── middleware.ts    # Auth middleware
└── package.json
```

---

## ☁️ Deployment

This project is optimized for deployment on **Vercel**.

1. Push your code to a Git repository (GitHub/GitLab).
2. Import the project into Vercel.
3. Add the **Environment Variables** (`DATABASE_URL`, `NEXTAUTH_SECRET`) in the Vercel Project Settings.
4. Deploy! 🚀

---

## � Demo Credentials

To access the live demo, use the following super admin credentials:

- **Email**: `superadmin@hrms.com`
- **Password**: `superadmin123`

> [!NOTE]
> These credentials provide full system access including multi-tenant management, organization setup, and all administrative features.

---

## �🐛 Troubleshooting

### Database Connection Issues
- Ensure your `DATABASE_URL` is correct and the database is accessible.
- For Neon/Supabase, verify connection pooling settings.

### Build Errors
- Clear `.next` folder and `node_modules`, then reinstall: `rm -rf .next node_modules && npm install`
- Ensure all environment variables are set correctly.

### Authentication Not Working
- Verify `NEXTAUTH_SECRET` is set in production.
- Check that `NEXTAUTH_URL` matches your deployment URL.

---

**Developed for HR Management Automation.**

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a new branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨💻 Author

Made with ❤️ by [Dipan46](https://github.com/Dipan46)
