// export-reports/exportController.js
// Generates downloadable CSV files from existing database tables
// Uses 'fast-csv' package — npm install fast-csv
// NO database schema changes

const db     = require('../config/db');   // your existing db.js path
const csv    = require('fast-csv');

// Helper: stream rows as a CSV download response
const sendCsv = (res, filename, headers, rows) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  const stream = csv.format({ headers: true });
  stream.pipe(res);

  // Write header row
  rows.forEach(row => stream.write(row));
  stream.end();
};

// ─────────────────────────────────────────────────────────
// GET /api/export/students
// CSV columns: ID, Name, Email, Branch, CGPA,
//              Applications, Placed, Registered On
// ─────────────────────────────────────────────────────────
const exportStudents = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        s.id            AS "ID",
        s.name          AS "Name",
        s.email         AS "Email",
        s.branch        AS "Branch",
        s.cgpa          AS "CGPA",
        COUNT(a.id)     AS "Total Applications",
        SUM(CASE WHEN a.status = 'Selected' THEN 1 ELSE 0 END) AS "Placed",
        DATE_FORMAT(s.created_at, '%d-%b-%Y') AS "Registered On"
      FROM students s
      LEFT JOIN applications a ON a.student_id = s.id
      GROUP BY s.id
      ORDER BY s.name ASC
    `);

    sendCsv(res, `students_report_${Date.now()}.csv`, true, rows);
  } catch (err) {
    console.error('Export students error:', err);
    res.status(500).json({ message: 'Failed to export students report.' });
  }
};

// ─────────────────────────────────────────────────────────
// GET /api/export/companies
// CSV columns: ID, Company, Role, Package, Min CGPA,
//              Total Applicants, Selected, Added On
// ─────────────────────────────────────────────────────────
const exportCompanies = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        c.id                  AS "ID",
        c.company_name        AS "Company Name",
        c.role                AS "Role",
        CONCAT('₹', c.package, ' LPA') AS "Package",
        c.min_cgpa            AS "Min CGPA",
        COUNT(a.id)           AS "Total Applicants",
        SUM(CASE WHEN a.status = 'Selected' THEN 1 ELSE 0 END) AS "Students Selected",
        DATE_FORMAT(c.created_at, '%d-%b-%Y') AS "Added On"
      FROM companies c
      LEFT JOIN applications a ON a.company_id = c.id
      GROUP BY c.id
      ORDER BY c.package DESC
    `);

    sendCsv(res, `companies_report_${Date.now()}.csv`, true, rows);
  } catch (err) {
    console.error('Export companies error:', err);
    res.status(500).json({ message: 'Failed to export companies report.' });
  }
};

// ─────────────────────────────────────────────────────────
// GET /api/export/applications
// CSV columns: App ID, Student Name, Email, Branch, CGPA,
//              Company, Role, Package, Status, Applied On
// ─────────────────────────────────────────────────────────
const exportApplications = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        a.id                  AS "App ID",
        s.name                AS "Student Name",
        s.email               AS "Email",
        s.branch              AS "Branch",
        s.cgpa                AS "CGPA",
        c.company_name        AS "Company",
        c.role                AS "Role",
        CONCAT('₹', c.package, ' LPA') AS "Package",
        a.status              AS "Status",
        DATE_FORMAT(a.applied_at, '%d-%b-%Y %H:%i') AS "Applied On",
        DATE_FORMAT(a.updated_at, '%d-%b-%Y %H:%i') AS "Last Updated"
      FROM applications a
      JOIN students s  ON a.student_id  = s.id
      JOIN companies c ON a.company_id  = c.id
      ORDER BY a.applied_at DESC
    `);

    sendCsv(res, `applications_report_${Date.now()}.csv`, true, rows);
  } catch (err) {
    console.error('Export applications error:', err);
    res.status(500).json({ message: 'Failed to export applications report.' });
  }
};

module.exports = { exportStudents, exportCompanies, exportApplications };
