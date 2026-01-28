# Patch Notes - v1.1.0

**Release Date:** January 28, 2026

---

## 🐛 Bug Fixes

### Employee Edit Not Saving Branch/Shift
- **Issue:** When editing an employee, changes to branch and shift were not being saved
- **Fix:** Updated PATCH API to correctly update `employeeProfile` with `branchId` and `shiftId`
- **File:** `src/app/api/admin/employees/[id]/route.ts`

### Dashboard Employee Count Mismatch
- **Issue:** Client cards showed all users instead of only employees, causing count mismatches with dashboard
- **Fix:** Changed `_count.users` query to filter by `role: "EMPLOYEE"` only
- **File:** `src/app/api/admin/clients/route.ts`

### UI Label Clarification
- **Issue:** Client card showed "Users" which was confusing
- **Fix:** Changed label to "Employees" for clarity
- **File:** `src/app/admin/clients/page.tsx`

---

## ✨ Improvements

### Enhanced Seed Data
- Added second client: TechStart Inc (code: TECH)
- Added CLIENT_ADMIN users for each client
- Increased employee count: 3 for Acme, 2 for TechStart
- Added leave types per client
- Added 4 common holidays

---

## 📋 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@hrms.com | admin123 |
| Client Admin (Acme) | hradmin@acme.com | admin123 |
| Client Admin (TechStart) | hradmin@techstart.com | admin123 |
| Employee (Acme) | john@acme.com | user123 |
| Employee (TechStart) | alice@techstart.com | user123 |

---

## 🔧 Files Changed

```
src/app/api/admin/employees/[id]/route.ts   # Employee PATCH fix
src/app/api/admin/clients/route.ts          # Count filter fix
src/app/admin/clients/page.tsx              # Label change
prisma/master_seed.js                       # Enhanced seed data
```

---

## 🚀 Upgrade Steps

```bash
# Reset database and apply new seed
npx prisma db push --force-reset
node prisma/master_seed.js

# Start the server
npm run dev
```
