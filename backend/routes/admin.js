// backend/routes/admin.js
// Protected routes for admin operations

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyAdmin } = require('../middleware/auth');

// ─────────────────────────────────────────────
// GET /api/admin/dashboard
// Returns high-level stats for the admin dashboard
// ─────────────────────────────────────────────
router.get('/dashboard', verifyAdmin, async (req, res) => {
  try {
    const [[{ totalStudents }]]    = await db.query('SELECT COUNT(*) AS totalStudents FROM students');
    const [[{ totalCompanies }]]   = await db.query('SELECT COUNT(*) AS totalCompanies FROM companies');
    const [[{ totalApplications }]] = await db.query('SELECT COUNT(*) AS totalApplications FROM applications');
    const [[{ totalSelected }]]    = await db.query("SELECT COUNT(*) AS totalSelected FROM applications WHERE status = 'Selected'");

    // Applications by status (for chart)
    const [statusBreakdown] = await db.query(`
      SELECT status, COUNT(*) AS count
      FROM applications
      GROUP BY status
    `);

    // Recent applications
    const [recentApplications] = await db.query(`
      SELECT
        a.id, a.status, a.applied_at,
        s.name AS student_name, s.branch,
        c.company_name, c.role
      FROM applications a
      JOIN students s ON a.student_id = s.id
      JOIN companies c ON a.company_id = c.id
      ORDER BY a.applied_at DESC
      LIMIT 5
    `);

    res.json({
      stats: { totalStudents, totalCompanies, totalApplications, totalSelected },
      statusBreakdown,
      recentApplications
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/admin/students
// Get all students
// ─────────────────────────────────────────────
router.get('/students', verifyAdmin, async (req, res) => {
  try {
    const [students] = await db.query(`
      SELECT
        s.id, s.name, s.email, s.cgpa, s.branch, s.created_at,
        COUNT(a.id) AS application_count
      FROM students s
      LEFT JOIN applications a ON a.student_id = s.id
      GROUP BY s.id
      ORDER BY s.name ASC
    `);
    res.json({ students });
  } catch (err) {
    console.error('Get students error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/admin/companies
// Get all companies
// ─────────────────────────────────────────────
router.get('/companies', verifyAdmin, async (req, res) => {
  try {
    const [companies] = await db.query(`
      SELECT
        c.*,
        COUNT(a.id) AS applicant_count
      FROM companies c
      LEFT JOIN applications a ON a.company_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);
    res.json({ companies });
  } catch (err) {
    console.error('Get companies error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/admin/companies
// Add a new company
// ─────────────────────────────────────────────
router.post('/companies', verifyAdmin, async (req, res) => {
  const { company_name, role, package: pkg, min_cgpa, description } = req.body;

  if (!company_name || !role || !pkg || !min_cgpa) {
    return res.status(400).json({ message: 'Company name, role, package, and min CGPA are required.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO companies (company_name, role, package, min_cgpa, description) VALUES (?, ?, ?, ?, ?)',
      [company_name, role, pkg, min_cgpa, description || '']
    );
    res.status(201).json({ message: 'Company added successfully!', companyId: result.insertId });
  } catch (err) {
    console.error('Add company error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────
// DELETE /api/admin/companies/:id
// Delete a company
// ─────────────────────────────────────────────
router.delete('/companies/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM companies WHERE id = ?', [id]);
    res.json({ message: 'Company deleted successfully.' });
  } catch (err) {
    console.error('Delete company error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/admin/applications
// Get all applications with details
// ─────────────────────────────────────────────
router.get('/applications', verifyAdmin, async (req, res) => {
  try {
    const [applications] = await db.query(`
      SELECT
        a.id, a.status, a.applied_at, a.updated_at,
        s.name AS student_name, s.email AS student_email,
        s.cgpa, s.branch,
        c.company_name, c.role, c.package
      FROM applications a
      JOIN students s ON a.student_id = s.id
      JOIN companies c ON a.company_id = c.id
      ORDER BY a.applied_at DESC
    `);
    res.json({ applications });
  } catch (err) {
    console.error('Get applications error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────
// PUT /api/admin/applications/:id/status
// Update an application's status
// ─────────────────────────────────────────────
router.put('/applications/:id/status', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Selected', 'Rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }

  try {
    const [result] = await db.query(
      'UPDATE applications SET status = ? WHERE id = ?',
      [status, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Application not found.' });
    }
    res.json({ message: 'Application status updated successfully.' });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
