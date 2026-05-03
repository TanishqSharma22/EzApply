const jobService = require('../services/job.service');

const createJob = async (req, res, next) => {
  try {
    const { title, company, location, description } = req.body;

    if (!title || !company || !description) {
      return res.status(400).json({
        success: false,
        message: 'title, company, and description are required',
      });
    }

    const job = await jobService.createJob({
      recruiterId: req.user.userId,
      title, company, location, description,
    });

    res.status(201).json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};

const getJobs = async (req, res, next) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page)  || 1);
    const limit  = Math.min(50, parseInt(req.query.limit) || 10);
    const search = req.query.search || '';

    const data = await jobService.getJobs({ page, limit, search });
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    res.status(200).json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await jobService.updateJob({
      jobId: req.params.id,
      recruiterId: req.user.userId,
      updates: req.body,
    });
    res.status(200).json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const result = await jobService.deleteJob({
      jobId: req.params.id,
      recruiterId: req.user.userId,
    });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob };
