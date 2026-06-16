🎓 PlacementHub — College Placement Management Portal

A comprehensive, full-stack college placement management system designed to streamline recruitment workflows for students and administrators. Features robust security, real-time tracking, advanced visual analytics, and on-demand report exporting. Built using React, Node.js, Express, and MySQL.

---

## 📁 Folder Structure

```text
placement-portal/
│
├── database/
│   └── schema.sql                  ← SQL schema + sample data
│
├── backend/
│   ├── config/
│   │   └── db.js                   ← MySQL connection pool
│   ├── middleware/
│   │   └── auth.js                 ← JWT authentication & role authorization
│   ├── routes/
│   │   ├── auth.js                 ← Register / Login endpoints
│   │   ├── student.js              ← Student-protected endpoints
│   │   └── admin.js                ← Admin-protected endpoints
│   ├── placement-analytics/         ← [PHASE 2] Metrics aggregation layer
│   │   ├── analyticsController.js
│   │   └── analyticsRoutes.js
│   ├── export-reports/              ← [PHASE 2] Streamed reporting layer
│   │   ├── exportController.js
│   │   └── exportRoutes.js
│   ├── .env                        ← Environment variables
│   ├── package.json
│   └── server.js                   ← Express application entry point
│
└── frontend/
    ├── public/
    │   └── index.html              ← Dynamic browser tab branding (🎓 Favicon)
    └── src/
        ├── context/
        │   └── AuthContext.js      ← Global auth state (React Context)
        ├── utils/
        │   └── api.js              ← Axios instance with automated JWT interceptor
        ├── components/
        │   └── shared/
        │       ├── Navbar.js       ← Updated scannable navigation panel
        │       └── ProtectedRoute.js
        ├── styles/
        │   └── globals.css         ← [PHASE 3] Modernized dark-mode aesthetic theme
        ├── pages/
        │   ├── Home.js             ← [PHASE 3] Landing page with Live Placement Tracker
        │   ├── student/
        │   │   ├── Login.js
        │   │   ├── Register.js
        │   │   ├── Dashboard.js
        │   │   ├── Companies.js    ← Job cards with direct eligibility criteria
        │   │   └── Applications.js
        │   └── admin/
        │       ├── Login.js
        │       ├── Dashboard.js
        │       ├── Students.js
        │       ├── Companies.js
        │       ├── Applications.js
        │       ├── PlacementAnalytics.jsx   ← [PHASE 2] Interactive Chart.js boards
        │       ├── PlacementAnalytics.css   ← Customized administrative visual theme
        │       └── ExportReports.jsx        ← [PHASE 2] Administrative download center
        ├── App.js
        └── index.js

```

---

## 🗄️ Database Schema

```sql
students     (id, name, email, password, cgpa, branch, created_at)
companies    (id, company_name, role, package, min_cgpa, description, created_at)
applications (id, student_id, company_id, status, applied_at, updated_at)
admin        (id, username, password)

```

*Note: The platform utilizes cascading relations and structural tracking constraints. Advanced analytics and features read from these primary core tables without requiring extra schema overhead.*

---

## 🚀 Installation & Setup

### Prerequisites

* **Node.js** (v16 or higher)
* **MySQL Server** (v8 or higher)
* **npm** (bundled with Node.js)

### Step 1 — Set up the Database

1. Launch your MySQL terminal client or MySQL Workbench.
2. Source the schema file to build the architecture and insert testing records:
```bash
mysql -u root -p

```


```sql
source /path/to/placement-portal/database/schema.sql;

```



### Step 2 — Configure and Run the Backend Server

1. Navigate to the server folder and install dependencies:
```bash
cd backend
npm install

```


2. Create or edit your `.env` configuration file in the root of the `backend/` directory:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_NAME=placement_db
JWT_SECRET=your_super_secure_random_string_key

```


3. Fire up the development backend listener instance:
```bash
npm run dev

```


*The core server actively handles connections at: `http://localhost:5000*`

### Step 3 — Configure and Run the Frontend Client

1. Navigate to the client folder and install the UI dependencies:
```bash
cd ../frontend
npm install

```


2. Launch the React development compilation client server:
```bash
npm start

```


*The primary application browser window launches automatically at: `http://localhost:3000*`

---

## 🔐 System Demo Credentials

| Role | Username / Email | Password |
| --- | --- | --- |
| **Administrator** | `admin` | `password123` |
| **Student (CS)** | `arjun@college.edu` | `password123` |
| **Student (EC)** | `priya@college.edu` | `password123` |
| **Student (ME)** | `rahul@college.edu` | `password123` |

---

## 📡 Complete REST API Blueprint

### Authentication Interfaces (`/api/auth`)

* `POST /api/auth/student/register` — Registers new student profile profiles.
* `POST /api/auth/student/login` — Checks student credentials and provisions a bearer token.
* `POST /api/auth/admin/login` — Authenticates structural administrators.

### Student Subsystem Operations (`/api/student`) *(Student Token Required)*

* `GET /api/student/dashboard` — Returns individual dashboard key metrics.
* `GET /api/student/companies` — Lists job profile parameters matching criteria mapping.
* `POST /api/student/apply/:companyId` — Processes eligibility constraints and applications.
* `GET /api/student/applications` — Fetches complete history log for the current student.

### Base Administrative Subsystem (`/api/admin`) *(Admin Token Required)*

* `GET /api/admin/dashboard` — Calculates global platform overview statistics.
* `GET /api/admin/students` — Retrieves structural ledger records of active students.
* `GET /api/admin/companies` — Displays listing data arrays for all job profiles.
* `POST /api/admin/companies` — Generates a new recruitment opening posting.
* `DELETE /api/admin/companies/:id` — Removes an existing company criteria posting profile.
* `GET /api/admin/applications` — Streams all active applicant records.
* `PUT /api/admin/applications/:id/status` — Processes updates across workflow stages.

### Analytics & Reporting Subsystems (`/api/analytics` & `/api/export`) *(Admin Token Required)*

* `GET /api/analytics/overview` — Compiles totals for students, jobs, applications, and placement percentages.
* `GET /api/analytics/company-engagement` — Provides comparative dataset vectors mapping applications across companies.
* `GET /api/analytics/status-distribution` — Yields percentage divisions spanning application statuses.
* `GET /api/analytics/branch-metrics` — Supplies placement rates and distributions partitioned across departments.
* `GET /api/export/students` — Assembles and streams an encoded CSV file of all student placement metrics.
* `GET /api/export/companies` — Generates and streams down an explicit spreadsheet file logging company statistics.
* `GET /api/export/applications` — Compiles every platform recruitment activity record into a CSV matrix file.

---

## 🧠 Technical Feature Explanations (Great for Viva Preparation!)

### 1. Unified Dark Theme & UX Flow (Phase 3)

The presentation layer uses a custom dark-mode design system with a high-contrast palette (`#0a1128` to `#141f3f`). It features fluid container boxes, interactive state borders, scannable badges, and an integrated browser title bar favicon rendered entirely using memory-efficient inline SVG vector strings (`🎓`).

### 2. Live Application Demo Tracker

To remain visually engaging prior to authentication, the landing hero interface renders an asynchronous placement timeline tracker interface. It simulates live metrics tracking, illustrating candidate progression status tiers (*Applied → Under Review → Shortlisted → Selected*) to show the application's core functionality to visitors.

### 3. Verification & Eligibility Gates

The architecture deploys deep defensive protection routines to ensure placement policy integrity. When a student attempts to apply for an opening, the server recalculates database criteria to check if `student.cgpa >= company.min_cgpa`. Applications are evaluated server-side to guarantee accuracy regardless of frontend UI overrides.

### 4. Interactive Data Visualization (Phase 2)

The admin panel integrates chart visualization layers powered by `Chart.js` via `react-chartjs-2`. Aggregated SQL selection queries compile system statistics into interactive Bar charts, Pie layouts, and Doughnut charts, giving administrators instant insight into placement metrics across branches.

### 5. Fast High-Performance Report Compilation (Phase 2)

The export dashboard implements memory-optimized data streams using the `fast-csv` utility. Large-scale database record rows are pulled and piped into direct binary text arrays on the fly. This processes instantly and initiates immediate Excel/Sheets-compatible browser downloads without bloating backend infrastructure.

---

## 🛠️ Technology Stack Summary

* **Frontend Architecture:** React 18 (Hooks, functional rendering trees)
* **Client-Side Routing:** React Router v6
* **Data Visualization:** Chart.js + `react-chartjs-2`
* **Network & Requests:** Axios (Configured with automated HTTP authentication header interceptors)
* **Layout Engine:** Customized CSS + Enhanced Bootstrap 5
* **Runtime Core Engine:** Node.js + Express.js Framework
* **Data Layer Engine:** MySQL 8 database management system (Leverages the high-performance `mysql2` connection pooling driver)
* **Cryptographic Layer:** `bcryptjs` for secure password hashing
* **State & Authorization:** JSON Web Tokens (JWT) + React Context API

```