// placement-analytics/analyticsController.js
// All database queries for the Placement Analytics Dashboard
// Uses existing tables: students, companies, applications
// NO schema changes required

const db = require('../config/db'); // adjust path to your existing db.js

// ─────────────────────────────────────────────────────────
// GET /api/analytics/overview
// Returns: total students, companies, applications, placed
// ─────────────────────────────────────────────────────────
const getOverview = async (req, res) => {
  try {
    const [[{ totalStudents }]]     = await db.query('SELECT COUNT(*) AS totalStudents FROM students');
    const [[{ totalCompanies }]]    = await db.query('SELECT COUNT(*) AS totalCompanies FROM companies');
    const [[{ totalApplications }]] = await db.query('SELECT COUNT(*) AS totalApplications FROM applications');
    const [[{ placedStudents }]]    = await db.query(
      "SELECT COUNT(DISTINCT student_id) AS placedStudents FROM applications WHERE status = 'Selected'"
    );
    const [[{ avgCgpa }]] = await db.query(
      'SELECT ROUND(AVG(cgpa), 2) AS avgCgpa FROM students'
    );
    const [[{ highestPackage }]] = await db.query(
      'SELECT MAX(package) AS highestPackage FROM companies'
    );
    const placementRate = totalStudents > 0
      ? Math.round((placedStudents / totalStudents) * 100)
      : 0;

    res.json({
      totalStudents,
      totalCompanies,
      totalApplications,
      placedStudents,
      avgCgpa,
      highestPackage,
      placementRate
    });
  } catch (err) {
    console.error('Analytics overview error:', err);
    res.status(500).json({ message: 'Server error fetching overview.' });
  }
};

// ─────────────────────────────────────────────────────────
// GET /api/analytics/company-wise
// Returns: applications per company (for bar chart)
// ─────────────────────────────────────────────────────────
const getCompanyWise = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        c.company_name,
        c.package,
        COUNT(a.id)                                             AS total_applications,
        SUM(CASE WHEN a.status = 'Selected'    THEN 1 ELSE 0 END) AS selected,
        SUM(CASE WHEN a.status = 'Shortlisted' THEN 1 ELSE 0 END) AS shortlisted,
        SUM(CASE WHEN a.status = 'Rejected'    THEN 1 ELSE 0 END) AS rejected
      FROM companies c
      LEFT JOIN applications a ON a.company_id = c.id
      GROUP BY c.id, c.company_name, c.package
      ORDER BY total_applications DESC
    `);
    res.json({ data: rows });
  } catch (err) {
    console.error('Company-wise analytics error:', err);
    res.status(500).json({ message: 'Server error fetching company-wise data.' });
  }
};

// ─────────────────────────────────────────────────────────
// GET /api/analytics/status-wise
// Returns: count of each application status (for pie chart)
// ─────────────────────────────────────────────────────────
const getStatusWise = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT status, COUNT(*) AS count
      FROM applications
      GROUP BY status
      ORDER BY count DESC
    `);
    res.json({ data: rows });
  } catch (err) {
    console.error('Status-wise analytics error:', err);
    res.status(500).json({ message: 'Server error fetching status-wise data.' });
  }
};

// ─────────────────────────────────────────────────────────
// GET /api/analytics/branch-wise
// Returns: student count per branch (for doughnut chart)
// ─────────────────────────────────────────────────────────
const getBranchWise = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        s.branch,
        COUNT(DISTINCT s.id)                                        AS total_students,
        ROUND(AVG(s.cgpa), 2)                                       AS avg_cgpa,
        COUNT(DISTINCT CASE WHEN a.status = 'Selected' THEN a.student_id END) AS placed_students
      FROM students s
      LEFT JOIN applications a ON a.student_id = s.id
      GROUP BY s.branch
      ORDER BY total_students DESC
    `);
    res.json({ data: rows });
  } catch (err) {
    console.error('Branch-wise analytics error:', err);
    res.status(500).json({ message: 'Server error fetching branch-wise data.' });
  }
};

module.exports = { getOverview, getCompanyWise, getStatusWise, getBranchWise };
