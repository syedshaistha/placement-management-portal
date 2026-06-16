// placement-analytics/analyticsRoutes.js
// Mount these routes in your existing server.js

const express = require('express');
const router  = express.Router();
const { verifyAdmin } = require('../middleware/auth'); // your existing middleware

const {
  getOverview,
  getCompanyWise,
  getStatusWise,
  getBranchWise
} = require('./analyticsController');

// All analytics routes are admin-protected (read-only)
router.get('/overview',     verifyAdmin, getOverview);
router.get('/company-wise', verifyAdmin, getCompanyWise);
router.get('/status-wise',  verifyAdmin, getStatusWise);
router.get('/branch-wise',  verifyAdmin, getBranchWise);

module.exports = router;
