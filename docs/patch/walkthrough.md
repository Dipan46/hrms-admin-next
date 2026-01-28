# Walkthrough - HRMS Admin Bug Fixes

## What Was Fixed

### 1. Employee Edit Bug ✅
**Issue:** Branch and shift changes not saving when editing employees  
**Fix:** Updated API to save `branchId` and `shiftId` to employee profile

### 2. Dashboard Count Mismatch ✅
**Issue:** Client cards showed all users, dashboard showed only employees  
**Fix:** Client API now counts only `role: "EMPLOYEE"` users

### 3. Seed Data Gaps ✅
**Issue:** Only 1 client, 1 employee - hard to test  
**Fix:** Added 2 clients, 2 client admins, 5 employees, leave types, holidays

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@hrms.com | admin123 |
| Client Admin (Acme) | hradmin@acme.com | admin123 |
| Client Admin (TechStart) | hradmin@techstart.com | admin123 |
| Employee (Acme) | john@acme.com | user123 |
| Employee (TechStart) | alice@techstart.com | user123 |

---

## How to Apply

```bash
# Reset and seed database
npx prisma db push --force-reset
node prisma/master_seed.js

# Start server
npm run dev
```

---

## Verification Steps

1. Login as `admin@hrms.com`
2. Check dashboard shows 5 employees total
3. Check Acme client card shows 3 employees
4. Edit an employee's branch → verify it saves
5. Login as `hradmin@acme.com` → should only see Acme data
