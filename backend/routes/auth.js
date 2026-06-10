// backend/routes/auth.js
// Handles student registration, student login, and admin login

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

// ─────────────────────────────────────────────
// POST /api/auth/student/register
// Register a new student
// ─────────────────────────────────────────────
router.post('/student/register', async (req, res) => {
  const { name, email, password, cgpa, branch } = req.body;

  // Basic validation
  if (!name || !email || !password || !cgpa || !branch) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (cgpa < 0 || cgpa > 10) {
    return res.status(400).json({ message: 'CGPA must be between 0 and 10.' });
  }

  try {
    // Check if email already exists
    const [existing] = await db.query('SELECT id FROM students WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new student
    const [result] = await db.query(
      'INSERT INTO students (name, email, password, cgpa, branch) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, cgpa, branch]
    );

    res.status(201).json({
      message: 'Registration successful! Please login.',
      studentId: result.insertId
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/auth/student/login
// Student login → returns JWT
// ─────────────────────────────────────────────
router.post('/student/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM students WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const student = rows[0];
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: student.id, email: student.email, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful!',
      token,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        cgpa: student.cgpa,
        branch: student.branch
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/auth/admin/login
// Admin login → returns JWT
// ─────────────────────────────────────────────
router.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM admin WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const adminUser = rows[0];
    const isMatch = await bcrypt.compare(password, adminUser.password);
    console.log("Entered Password:", password);
    console.log("Password Match:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: adminUser.id, username: adminUser.username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Admin login successful!',
      token,
      admin: {
        id: adminUser.id,
        username: adminUser.username
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;
