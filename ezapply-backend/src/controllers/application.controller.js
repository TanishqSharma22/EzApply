const applicationService = require('../services/application.service');

const applyToJob = async (req, res, next) => {
  try {
    const { coverLetter } = req.body;
    const { jobId } = req.params;

    const application = await applicationService.applyToJob({
      jobId,
      applicantId: req.user.userId,
      coverLetter,
    });

    res.status(201).json({ success: true, data: application });
  } catch (err) {
    next(err);
  }
};

const getMyApplications = async (req, res, next) => {
  try {
    const applications = await applicationService.getMyApplications(req.user.userId);
    res.status(200).json({ success: true, data: applications });
  } catch (err) {
    next(err);
  }
};

const getApplicationsForJob = async (req, res, next) => {
  try {
    const applications = await applicationService.getApplicationsForJob({
      jobId: req.params.jobId,
      recruiterId: req.user.userId,
    });
    res.status(200).json({ success: true, data: applications });
  } catch (err) {
    next(err);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['under_review', 'shortlisted', 'rejected', 'hired'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const application = await applicationService.updateApplicationStatus({
      applicationId: req.params.id,
      recruiterId: req.user.userId,
      newStatus: status,
      note,
    });

    res.status(200).json({ success: true, data: application });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
};
