# HRMS Admin Next - Project Architecture

## 1. Project Overview
**HRMS Admin Next** is a Human Resource Management System built with **Next.js 14 (App Router)**. It provides a comprehensive solution for managing employees, attendance, leaves, and organizational structures (Clients, Branches, Shifts).

### Key Features
-   **Role-Based Access Control (RBAC)**: Supports roles like `SUPER_ADMIN`, `CLIENT_ADMIN`, `MANAGER`, and `EMPLOYEE`.
-   **Multi-Tenancy**: Built to support multiple Clients (organizations) within a single instance.
-   **Attendance Tracking**: Geolocation-based check-in/check-out system (Office, WFH, Travel).
-   **Leave Management**: Workflow for applying and approving leave requests.
-   **Employee Management**: Profiles, shift assignments, and branch allocations.

## 2. Technology Stack

### Core Framework
-   **Next.js 14**: Uses the App Router for routing and layouts.
-   **TypeScript**: Ensures type safety across the application.
-   **React 18**: UI library.

### Database & ORM
-   **PostgreSQL**: Relational database (inferred from `provider = "postgresql"`).
-   **Prisma ORM**: Used for database schema definition and type-safe database queries.

### Styling & UI
-   **Tailwind CSS**: Utility-first CSS framework.
-   **Lucide React**: Icon library.
-   **Next-Themes**: Support for dark/light mode.

### Authentication
-   **NextAuth.js (v4)**: Handles authentication sessions and providers.

## 3. Database Schema (Prisma)
The data model is defined in `prisma/schema.prisma`. Here are the core models:

### Identity & Organization
-   **User**: The core identity record. Includes `email`, `password` (hashed), `role`, and `clientId`.
-   **Client**: Represents a tenant organization. Owns Branches, Shifts, and Employees.
-   **Branch**: Physical location with Geofencing settings (`latitude`, `longitude`, `radius`).
-   **Shift**: Defines work timings (`startTime`, `endTime`, `gracePeriod`).

### Employee Data
-   **EmployeeProfile**: Extends `User` with organization-specific data (`branchId`, `shiftId`, `managerId`). This separates the "Login" user from the "HR" employee record.

### Operational Data
-   **AttendanceLog**: Daily records of employee attendance, including:
    -   `inTime`, `outTime`
    -   `locationType` (OFFICE, WFH, etc.)
    -   Geocoordinates (`latitude`, `longitude`)
    -   `status` (PRESENT, ABSENT, LATE, etc.)
-   **LeaveRequest**: Requests tied to a `LeaveType` (e.g., Sick, Casual). Status flows from `PENDING` -> `APPROVED`/`REJECTED`.

## 4. Application Structure (`src/`)

### `app/` (Next.js App Router)
-   `api/`: Backend API routes.
    -   `/auth/[...nextauth]`: NextAuth handler.
    -   `/admin/*`: Administrative APIs (users, clients, attendance).
    -   `/employee/*`: Employee-facing APIs.
-   `admin/`: Dashboard pages for Administrators.
    -   `/employees`: Employee directory and management.
    -   `/attendance`: Attendance reports and logs.
    -   `/leaves`: Leave approval workflows.
    -   `/branches`, `/shifts`: Configuration pages.
-   `employee/`: Dashboard pages for regular Employees.
    -   `/profile`: Personal profile view.
    -   `/leaves`: My leave history and application form.
-   `login/`, `register/`: Public authentication pages.

### `middleware.ts`
-   Protects sensitive routes (`/dashboard`, `/api/protected`).
-   Redirects unauthenticated users to `/login`.

## 5. Deployment
-   **Build Command**: `npm run build` (runs `next build`).
-   **Start Command**: `npm run start` (runs `next start`).
-   **Database Migration**: `npx prisma migrate deploy` (recommended for prod) or `npx prisma db push` (for prototyping).

## 6. Security Considerations
-   **Password Hashing**: Uses `bcryptjs` for secure password storage.
-   **Session Management**: NextAuth.js handles secure session tokens.
-   **Route Protection**: Middleware ensures only authenticated users access protected routes.
-   **Role-Based Access**: Different UI and API permissions based on user roles.
-   **Environment Variables**: Sensitive data stored in `.env` files (never committed to version control).

## 7. Data Flow
-   **Authentication**: User credentials → NextAuth handler → Database verification → Session creation.
-   **Attendance Marking**: Employee action → Geolocation capture → API route → Database log.
-   **Leave Approval**: Employee request → Manager dashboard → API update → Status change → Notification.
