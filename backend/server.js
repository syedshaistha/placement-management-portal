// backend/server.js
// Main entry point for the Express backend server

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ─── Middleware ───────────────────────────────
app.use(cors({
  origin: 'http://localhost:3000', // React dev server
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ──────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/student', require('./routes/student'));
app.use('/api/admin',   require('./routes/admin'));

app.use('/api/analytics', require('./placement-analytics/analyticsRoutes'));
app.use('/api/export', require('./export-reports/exportRoutes'));

// ─── Health Check ─────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🎓 Placement Portal API is running!', status: 'OK' });
});

// ─── 404 Handler ──────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// ─── Global Error Handler ─────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error.' });
});

// ─── Start Server ─────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📌 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
