<<<<<<< HEAD
# 🎓 PlacementHub — College Placement Management Portal

A full-stack mini project for college placements, built with **React + Node.js + MySQL**.

---

## 📁 Folder Structure

```
placement-portal/
│
├── database/
│   └── schema.sql              ← SQL schema + sample data
│
├── backend/
│   ├── config/
│   │   └── db.js               ← MySQL connection pool
│   ├── middleware/
│   │   └── auth.js             ← JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js             ← Register / Login endpoints
│   │   ├── student.js          ← Student-protected endpoints
│   │   └── admin.js            ← Admin-protected endpoints
│   ├── .env                    ← Environment variables
│   ├── package.json
│   └── server.js               ← Express app entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── context/
        │   └── AuthContext.js  ← Global auth state (React Context)
        ├── utils/
        │   └── api.js          ← Axios instance with JWT interceptor
        ├── components/
        │   └── shared/
        │       ├── Navbar.js
        │       └── ProtectedRoute.js
        ├── pages/
        │   ├── Home.js
        │   ├── student/
        │   │   ├── Login.js
        │   │   ├── Register.js
        │   │   ├── Dashboard.js
        │   │   ├── Companies.js
        │   │   └── Applications.js
        │   └── admin/
        │       ├── Login.js
        │       ├── Dashboard.js
        │       ├── Students.js
        │       ├── Companies.js
        │       └── Applications.js
        ├── App.js
        └── index.js
```

---

## 🗄️ Database Schema

```sql
students    (id, name, email, password, cgpa, branch, created_at)
companies   (id, company_name, role, package, min_cgpa, description, created_at)
applications(id, student_id, company_id, status, applied_at, updated_at)
admin       (id, username, password)
```

---

## 🚀 Installation Steps

### Prerequisites
- Node.js (v16+) — https://nodejs.org
- MySQL (v8+) — https://dev.mysql.com/downloads/
- npm (comes with Node.js)

---

### Step 1 — Set up the Database

```bash
# Log into MySQL
mysql -u root -p

# Run the schema file
source /path/to/placement-portal/database/schema.sql;
```

Or in MySQL Workbench: File → Open SQL Script → Run

---

### Step 2 — Set up the Backend

```bash
cd placement-portal/backend

# Install dependencies
npm install

# Edit the .env file — update your MySQL password:
# DB_PASSWORD=your_actual_mysql_password

# Start the server
npm run dev        # development (uses nodemon)
# OR
npm start          # production
```

Backend runs on: http://localhost:5000

---

### Step 3 — Set up the Frontend

```bash
cd placement-portal/frontend

# Install dependencies
npm install

# Start React app
npm start
```

Frontend runs on: http://localhost:3000

---

## 🔐 Demo Login Credentials

| Role    | Username / Email         | Password     |
|---------|--------------------------|--------------|
| Admin   | `admin`                  | `password123`|
| Student | `arjun@college.edu`      | `password123`|
| Student | `priya@college.edu`      | `password123`|
| Student | `rahul@college.edu`      | `password123`|

---

## 📡 API Endpoints

### Auth Routes (`/api/auth`)
| Method | Endpoint                    | Description             |
|--------|-----------------------------|-------------------------|
| POST   | `/auth/student/register`    | Register new student    |
| POST   | `/auth/student/login`       | Student login → JWT     |
| POST   | `/auth/admin/login`         | Admin login → JWT       |

### Student Routes (`/api/student`) — Requires Student JWT
| Method | Endpoint                        | Description                    |
|--------|---------------------------------|--------------------------------|
| GET    | `/student/dashboard`            | Dashboard stats                |
| GET    | `/student/companies`            | Companies with eligibility     |
| POST   | `/student/apply/:companyId`     | Apply (with CGPA check)        |
| GET    | `/student/applications`         | My applications                |

### Admin Routes (`/api/admin`) — Requires Admin JWT
| Method | Endpoint                            | Description              |
|--------|-------------------------------------|--------------------------|
| GET    | `/admin/dashboard`                  | Dashboard stats          |
| GET    | `/admin/students`                   | All students             |
| GET    | `/admin/companies`                  | All companies            |
| POST   | `/admin/companies`                  | Add new company          |
| DELETE | `/admin/companies/:id`              | Delete company           |
| GET    | `/admin/applications`               | All applications         |
| PUT    | `/admin/applications/:id/status`    | Update status            |

---

## 🧠 Module Explanations (for Viva)

### 1. Student Registration & Login
- Student fills name, email, password, CGPA, branch
- Password is hashed with **bcryptjs** before storing in MySQL
- On login, bcrypt compares passwords and returns a **JWT token**
- Token is stored in `localStorage` and sent as `Authorization: Bearer <token>` header

### 2. Student Dashboard
- Shows stats: total applications, shortlisted, selected, eligible companies
- Fetches profile from `/student/dashboard` using the JWT

### 3. Eligibility Check (Core Feature)
```
Backend logic:
if (student.cgpa >= company.min_cgpa) → Allow apply
else → Return 403 "Not Eligible"
```
- Frontend shows green "Eligible" badge / "Apply Now" button
- Or shows grayed "Not Eligible (Need X CGPA)" button

### 4. Apply for Job
- Student clicks "Apply Now"
- Backend checks CGPA vs company min_cgpa again (never trust frontend)
- Checks for duplicate application (UNIQUE constraint in DB)
- Inserts into `applications` table with status = "Applied"

### 5. View Application Status
- Student sees all their applications in a table
- Status changes are reflected in real time (color-coded badges)

### 6. Admin Dashboard
- Shows aggregate stats
- Bar chart of applications by status
- Recent applications table

### 7. Admin: Add Company
- Admin fills company name, role, package, min_cgpa, description
- POST to `/api/admin/companies`

### 8. Admin: Update Application Status
- Dropdown with: Applied → Under Review → Shortlisted → Selected → Rejected
- PUT to `/api/admin/applications/:id/status`
- Status update persists and is immediately visible to the student

---

## 🔒 Security Features
- Passwords stored as **bcrypt hashes** (never plain text)
- **JWT** protects all dashboard routes
- **Role-based access**: student tokens can't access admin routes and vice versa
- **CGPA eligibility re-validated on server** (not just frontend)
- Duplicate application prevented by UNIQUE constraint

---

## 🛠️ Tech Stack Summary

| Layer     | Technology                     |
|-----------|--------------------------------|
| Frontend  | React 18, React Router v6      |
| Styling   | Bootstrap 5, inline CSS        |
| State     | React Context API              |
| HTTP      | Axios                          |
| Backend   | Node.js, Express.js            |
| Auth      | JWT (jsonwebtoken), bcryptjs   |
| Database  | MySQL 8 (mysql2 driver)        |
| Dev tool  | nodemon                        |
=======
# placement-management-portal
>>>>>>> 7d1e88b40d6f29a10467906a22405ee3840e6ae0
