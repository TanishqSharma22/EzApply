const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.post(
  '/:jobId',
  authenticate,
  authorize('job_seeker'),
  applicationController.applyToJob
);

router.get(
  '/my',
  authenticate,
  authorize('job_seeker'),
  applicationController.getMyApplications
);

router.get(
  '/job/:jobId',
  authenticate,
  authorize('recruiter'),
  applicationController.getApplicationsForJob
);

router.patch(
  '/:id/status',
  authenticate,
  authorize('recruiter'),
  applicationController.updateApplicationStatus
);

module.exports = router;
