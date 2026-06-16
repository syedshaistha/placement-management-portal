// export-reports/exportRoutes.js
// Mount these routes in your existing server.js

const express = require('express');
const router  = express.Router();
const { verifyAdmin } = require('../middleware/auth'); // your existing middleware

const {
  exportStudents,
  exportCompanies,
  exportApplications
} = require('./exportController');

// All export routes are admin-protected
router.get('/students',     verifyAdmin, exportStudents);
router.get('/companies',    verifyAdmin, exportCompanies);
router.get('/applications', verifyAdmin, exportApplications);

module.exports = router;
