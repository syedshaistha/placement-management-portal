// backend/routes/student.js
// Protected routes for student operations

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyStudent } = require('../middleware/auth');

// ─────────────────────────────────────────────
// GET /api/student/dashboard
// Returns stats for the student dashboard
// ─────────────────────────────────────────────
router.get('/dashboard', verifyStudent, async (req, res) => {
  const studentId = req.user.id;

  try {
    // Get student profile
    const [studentRows] = await db.query(
      'SELECT id, name, email, cgpa, branch FROM students WHERE id = ?',
      [studentId]
    );
    if (studentRows.length === 0) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    const student = studentRows[0];

    // Count total applications
    const [appCount] = await db.query(
      'SELECT COUNT(*) AS total FROM applications WHERE student_id = ?',
      [studentId]
    );

    // Count shortlisted
    const [shortlisted] = await db.query(
      "SELECT COUNT(*) AS total FROM applications WHERE student_id = ? AND status = 'Shortlisted'",
      [studentId]
    );

    // Count selected
    const [selected] = await db.query(
      "SELECT COUNT(*) AS total FROM applications WHERE student_id = ? AND status = 'Selected'",
      [studentId]
    );

    // Count eligible companies
    const [eligible] = await db.query(
      'SELECT COUNT(*) AS total FROM companies WHERE min_cgpa <= ?',
      [student.cgpa]
    );

    res.json({
      student,
      stats: {
        totalApplications: appCount[0].total,
        shortlisted: shortlisted[0].total,
        selected: selected[0].total,
        eligibleCompanies: eligible[0].total
      }
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/student/companies
// Returns all companies with eligibility flag
// ─────────────────────────────────────────────
router.get('/companies', verifyStudent, async (req, res) => {
  const studentId = req.user.id;

  try {
    // Get student's CGPA
    const [studentRows] = await db.query('SELECT cgpa FROM students WHERE id = ?', [studentId]);
    const studentCgpa = studentRows[0].cgpa;

    // Get all companies + flag if already applied
    const [companies] = await db.query(`
      SELECT
        c.*,
        CASE WHEN c.min_cgpa <= ? THEN 1 ELSE 0 END AS eligible,
        CASE WHEN a.id IS NOT NULL THEN 1 ELSE 0 END AS already_applied,
        a.status AS application_status
      FROM companies c
      LEFT JOIN applications a
        ON a.company_id = c.id AND a.student_id = ?
      ORDER BY c.package DESC
    `, [studentCgpa, studentId]);

    res.json({ companies, studentCgpa });
  } catch (err) {
    console.error('Companies error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/student/apply/:companyId
// Apply for a company (with eligibility check)
// ─────────────────────────────────────────────
router.post('/apply/:companyId', verifyStudent, async (req, res) => {
  const studentId = req.user.id;
  const { companyId } = req.params;

  try {
    // Fetch student CGPA
    const [studentRows] = await db.query('SELECT cgpa FROM students WHERE id = ?', [studentId]);
    if (studentRows.length === 0) return res.status(404).json({ message: 'Student not found.' });

    const studentCgpa = studentRows[0].cgpa;

    // Fetch company min_cgpa
    const [companyRows] = await db.query('SELECT * FROM companies WHERE id = ?', [companyId]);
    if (companyRows.length === 0) return res.status(404).json({ message: 'Company not found.' });

    const company = companyRows[0];

    // ── Eligibility Check ──
    if (parseFloat(studentCgpa) < parseFloat(company.min_cgpa)) {
      return res.status(403).json({
        message: `Not eligible. Your CGPA (${studentCgpa}) is below the minimum required (${company.min_cgpa}).`,
        eligible: false
      });
    }

    // Check duplicate application
    const [existing] = await db.query(
      'SELECT id FROM applications WHERE student_id = ? AND company_id = ?',
      [studentId, companyId]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'You have already applied to this company.' });
    }

    // Insert application
    await db.query(
      "INSERT INTO applications (student_id, company_id, status) VALUES (?, ?, 'Applied')",
      [studentId, companyId]
    );

    res.status(201).json({ message: `Successfully applied to ${company.company_name}!`, eligible: true });
  } catch (err) {
    console.error('Apply error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/student/applications
// Get all applications for the logged-in student
// ─────────────────────────────────────────────
router.get('/applications', verifyStudent, async (req, res) => {
  const studentId = req.user.id;

  try {
    const [applications] = await db.query(`
      SELECT
        a.id,
        a.status,
        a.applied_at,
        a.updated_at,
        c.company_name,
        c.role,
        c.package
      FROM applications a
      JOIN companies c ON a.company_id = c.id
      WHERE a.student_id = ?
      ORDER BY a.applied_at DESC
    `, [studentId]);

    res.json({ applications });
  } catch (err) {
    console.error('Applications error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
