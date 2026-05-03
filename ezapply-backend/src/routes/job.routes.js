const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/',    jobController.getJobs);
router.get('/:id', jobController.getJobById);

router.post(  '/',    authenticate, authorize('recruiter'), jobController.createJob);
router.patch( '/:id', authenticate, authorize('recruiter'), jobController.updateJob);
router.delete('/:id', authenticate, authorize('recruiter'), jobController.deleteJob);

module.exports = router;
