# Developer Workflows

This document outlines the standard workflows for developing, testing, and deploying the **HRMS Admin Next** application.

## 1. Local Development Setup

### Prerequisites
-   Node.js (v18 or later)
-   npm or yarn
-   PostgreSQL Database (Local or Cloud like Neon/Supabase)

### Step-by-Step Setup

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd hrms-admin-next
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory with the following variables:
    ```env
    # Database Connection
    DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

    # NextAuth Configuration
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="your-super-secret-key-32-chars-long"
    ```

4.  **Database Setup**
    Push the Prisma schema to your database:
    ```bash
    npx prisma db push
    ```
    Populate the database with initial seed data (if available), or manually create a Client and Admin user via Prisma Studio:
    ```bash
    npx prisma studio
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:3000`.

## 2. Database Management
We use Prisma ORM for database interactions.

-   **Update Schema**: Edit `prisma/schema.prisma`.
-   **Apply Changes**: `npx prisma db push` (for development) or `npx prisma migrate dev --name <migration_name>` (for versioned changes).
-   **View Data**: `npx prisma studio` opens a GUI to view and edit data.
-   **Generate Client**: If you change the schema, ensure you run `npx prisma generate` to update the TypeScript client.

## 3. Common Development Tasks

### Adding a New Admin Page
1.  Create a folder in `src/app/admin/<feature-name>`.
2.  Add a `page.tsx` file exporting a React component.
3.  Add `layout.tsx` if you need nested navigation or specific wrappers.
4.  Update the sidebar navigation in `src/components/Sidebar.tsx` (or equivalent) to link to the new page.

### Adding an API Route
1.  Create a folder in `src/app/api/<feature-name>`.
2.  Add a `route.ts` file.
3.  Export standard HTTP method functions (`GET`, `POST`, `PUT`, `DELETE`).
    ```typescript
    import { NextResponse } from "next/server";
    import { prisma } from "@/lib/prisma";

    export async function GET() {
        const data = await prisma.modelName.findMany();
        return NextResponse.json(data);
    }
    ```

## 4. Testing & Quality Assurance

### Running Linter
```bash
npm run lint
```

### Type Checking
```bash
npx tsc --noEmit
```

### Manual Testing Checklist
- [ ] Authentication flow (Login/Logout)
- [ ] Admin pages load correctly
- [ ] Employee dashboard functions
- [ ] Leave request workflow
- [ ] Attendance marking

## 5. Environment Management

### Environment Variables Best Practices
-   Never commit `.env` files to version control.
-   Use `.env.local` for local overrides.
-   Store production secrets securely in your deployment platform.

### Generating Secure Secrets
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

## 6. Git Workflow

### Branch Naming Convention
-   `feature/feature-name` - New features
-   `bugfix/bug-name` - Bug fixes
-   `hotfix/issue-name` - Critical fixes

### Commit Message Format
```
type(scope): description

Examples:
feat(auth): add remember me functionality
fix(attendance): correct geolocation calculation
docs(readme): update installation steps
```

## 7. Build and Deployment

### Production Build
To create an optimized production build:
```bash
npm run build
```
To start the production server:
```bash
npm start
```

### Vercel Deployment
1.  Push your code to GitHub/GitLab.
2.  Import the project in Vercel.
3.  Go to **Settings > Environment Variables** and add `DATABASE_URL` and `NEXTAUTH_SECRET`.
4.  Vercel automatically detects Next.js and deploys.
