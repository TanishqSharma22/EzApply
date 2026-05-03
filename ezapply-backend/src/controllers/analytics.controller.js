const analyticsService = require('../services/analytics.service');

const getRecruiterAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getRecruiterAnalytics(req.user.userId);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getSeekerAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getSeekerAnalytics(req.user.userId);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getRecruiterAnalytics, getSeekerAnalytics };
