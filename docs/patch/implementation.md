# Implementation Details

## Overview
This document describes the technical implementation of bug fixes applied to the HRMS Admin application.

---

## 1. Employee PATCH API Fix

**File:** `src/app/api/admin/employees/[id]/route.ts`

**Problem:** The PATCH handler only updated `name` and `email`, ignoring `branchId` and `shiftId` from the form.

**Solution:** Extended the Prisma update to include nested `employeeProfile` update:

```typescript
const updatedUser = await prisma.user.update({
    where: { id },
    data: {
        name: body.name,
        email: body.email,
        employeeProfile: {
            update: {
                branchId: body.branchId || null,
                shiftId: body.shiftId || null
            }
        }
    },
    include: {
        employeeProfile: {
            include: { branch: true, shift: true }
        }
    }
});
```

---

## 2. Client Employee Count Fix

**File:** `src/app/api/admin/clients/route.ts`

**Problem:** `_count.users` counted all users including admins, causing mismatch with dashboard's "Total Employees".

**Solution:** Added filter to count only employees:

```typescript
include: {
    _count: {
        select: { 
            branches: true, 
            users: { where: { role: "EMPLOYEE" } } 
        }
    }
}
```

---

## 3. Seed Data Enhancement

**File:** `prisma/master_seed.js`

**Changes:**
- Added `TechStart Inc` as second client
- Added `CLIENT_ADMIN` role users for each client
- Added 5 employees total (3 Acme, 2 TechStart)
- Added client-specific leave types
- Added common holidays

---

## Database Schema Notes

The schema uses Next.js App Router conventions:
- `page.tsx` - Page components
- `route.ts` - API routes
- `layout.tsx` - Layout components

All naming follows correct conventions and requires no changes.
