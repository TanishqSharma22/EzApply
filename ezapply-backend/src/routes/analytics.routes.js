const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get(
  '/recruiter',
  authenticate,
  authorize('recruiter'),
  analyticsController.getRecruiterAnalytics
);

router.get(
  '/seeker',
  authenticate,
  authorize('job_seeker'),
  analyticsController.getSeekerAnalytics
);

module.exports = router;
