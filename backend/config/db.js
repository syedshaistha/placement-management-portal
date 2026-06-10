// backend/config/db.js
// MySQL Database Connection using mysql2 with connection pooling

const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'placement_portal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Wrap in promise-based API for async/await usage
const db = pool.promise();

// Test connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ MySQL Database connected successfully');
    connection.release();
  }
});

module.exports = db;
