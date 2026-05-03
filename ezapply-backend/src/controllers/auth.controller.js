const authService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const { email, password, full_name, role } = req.body;

    if (!email || !password || !full_name || !role) {
      return res.status(400).json({
        success: false,
        message: 'email, password, full_name, and role are required',
      });
    }

    if (!['job_seeker', 'recruiter'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'role must be job_seeker or recruiter',
      });
    }

    const data = await authService.register({ email, password, full_name, role });
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'email and password are required',
      });
    }

    const data = await authService.login({ email, password });
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
