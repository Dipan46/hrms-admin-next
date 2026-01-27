# HRMS User Manual

Welcome to the **HRMS Admin Next** User Manual. This guide will help you navigate and use the features of the Human Resource Management System.

## 👥 System Roles

The system is designed for different types of users:
-   **Super Admin**: Manages the entire platform and all Client organizations.
-   **Client Admin**: Manages a specific Company (Client), including its branches, shifts, and employees.
-   **Manager**: Oversees a team of employees, approves leaves, and monitors attendance.
-   **Employee**: Uses the system to mark attendance, apply for leave, and view their profile.

---

## 🛠 Admin Guide (For Administrators & Managers)

### 1. Setting Up Organization (Client Admin)
Before onboarding employees, setting up the infrastructure is crucial.

#### **Manage Branches**
Branches represent physical office locations.
-   **Navigate**: Go to **Admin > Branches**.
-   **Action**: Click "Add Branch".
-   **Details Needed**: Name, Address, and Geocoordinates (Latitude & Longitude) for attendance tracking.

#### **Manage Shifts**
Shifts define the working hours.
-   **Navigate**: Go to **Admin > Shifts**.
-   **Action**: Create a new shift.
-   **Details Needed**: Start Time, End Time, and Grace Period (minutes allowed for late login).

### 2. Managing Employees
-   **Navigate**: Go to **Admin > Employees**.
-   **Add Employee**: Click "Add Employee". Fill in their details and assign them a **Role**, **Branch**, **Shift**, and **Manager**.
-   **Edit/View**: Click on an employee's name to view their detailed profile or update their settings.

### 3. Approving Leaves
-   **Navigate**: Go to **Admin > Leaves**.
-   **Dashboard**: You will see a list of "Pending" leave requests.
-   **Action**: Review the reason and dates, then click **Approve** or **Reject**.

### 4. Monitoring Attendance
-   **Navigate**: Go to **Admin > Attendance**.
-   **Report**: View daily logs to see who is Present, Absent, or Late.
-   **Filter**: Use filters to view specific dates or branches.

---

## 👤 Employee Guide (For Staff)

### 1. Logging In
-   Visit the main login page.
-   Enter your email and password provided by your HR/Admin.

### 2. Dashboard Overview
Upon logging in, your specific dashboard shows:
-   Today's Date and Time.
-   Your current Attendance Status (Not Checked In / Checked In).
-   Summary of available leave balance.

### 3. Marking Attendance
**Note**: You may need to be physically present at the office location if Geofencing is enabled.
1.  **Check In**: Click the **"Check In"** button at the start of your day. The system will record your time and location.
2.  **Check Out**: Click **"Check Out"** when you finish work.

### 4. Applying for Leave
1.  Navigate to **My Leaves**.
2.  Click **"Apply Leave"**.
3.  Fill in the form:
    -   **Type**: Select (Sick, Casual, Paid, etc.).
    -   **Dates**: From and To dates.
    -   **Reason**: Brief explanation.
4.  **Submit**. Your manager will be notified. Check back later to see if the status changes to **Approved**.

### 5. My Profile
-   Go to **Profile** to view your personal details, assigned shift, and branch information.

---

## 📱 Mobile App Installation

This application can be installed on your mobile device as a Web App (PWA) for quick access.

### **Android (Chrome)**
1.  Open Chrome and navigate to the application URL.
2.  Tap the **Three Dots** menu (⋮) in the top-right corner.
3.  Select **"Install App"** or **"Add to Home Screen"**.
4.  Follow the prompt to install. The app icon will appear on your home screen.

### **iOS (Safari)**
1.  Open Safari and navigate to the application URL.
2.  Tap the **Share** button (rectangle with an arrow pointing up).
3.  Scroll down and tap **"Add to Home Screen"**.
4.  Tap **Add** in the top-right corner. The app icon will appear on your home screen.

---

## ❓ Comparison of Roles

| Feature | Employee | Manager | Client Admin |
| :--- | :---: | :---: | :---: |
| **Mark Attendance** | ✅ | ✅ | ✅ |
| **Apply Leave** | ✅ | ✅ | ✅ |
| **View Own Profile** | ✅ | ✅ | ✅ |
| **Approve Leaves** | ❌ | ✅ | ✅ |
| **View Team Attendance**| ❌ | ✅ | ✅ |
| **Manage Employees** | ❌ | ❌ | ✅ |
| **Configure Settings** | ❌ | ❌ | ✅ |

---

**Need Help?** Contact your System Administrator for support.
