const pool = require('../config/db');

const applyToJob = async ({ jobId, applicantId, coverLetter }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const jobCheck = await client.query(
      `SELECT id, status FROM jobs WHERE id = $1`,
      [jobId]
    );

    if (jobCheck.rows.length === 0) {
      const error = new Error('Job not found');
      error.statusCode = 404;
      throw error;
    }

    if (jobCheck.rows[0].status !== 'open') {
      const error = new Error('This job is no longer accepting applications');
      error.statusCode = 400;
      throw error;
    }

    const appResult = await client.query(
      `INSERT INTO applications (job_id, applicant_id, cover_letter)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [jobId, applicantId, coverLetter]
    );

    const application = appResult.rows[0];

    await client.query(
      `INSERT INTO status_history (application_id, old_status, new_status, note)
       VALUES ($1, NULL, 'submitted', 'Application submitted')`,
      [application.id]
    );

    await client.query('COMMIT');
    return application;

  } catch (err) {
    await client.query('ROLLBACK');

    if (err.code === '23505') {
      const error = new Error('You have already applied to this job');
      error.statusCode = 409;
      throw error;
    }

    throw err;
  } finally {
    client.release();
  }
};

const getMyApplications = async (applicantId) => {
  const result = await pool.query(
    `SELECT
       a.id, a.status, a.applied_at, a.updated_at,
       j.title AS job_title,
       j.company,
       j.location,
       j.status AS job_status
     FROM applications a
     JOIN jobs j ON j.id = a.job_id
     WHERE a.applicant_id = $1
     ORDER BY a.applied_at DESC`,
    [applicantId]
  );

  return result.rows;
};

const getApplicationsForJob = async ({ jobId, recruiterId }) => {
  const result = await pool.query(
    `SELECT
       a.id, a.status, a.applied_at, a.cover_letter,
       u.full_name AS applicant_name,
       u.email AS applicant_email
     FROM applications a
     JOIN users u ON u.id = a.applicant_id
     JOIN jobs j ON j.id = a.job_id
     WHERE a.job_id = $1
       AND j.recruiter_id = $2
     ORDER BY a.applied_at DESC`,
    [jobId, recruiterId]
  );

  return result.rows;
};

const updateApplicationStatus = async ({ applicationId, recruiterId, newStatus, note }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const current = await client.query(
      `SELECT a.status, a.id
       FROM applications a
       JOIN jobs j ON j.id = a.job_id
       WHERE a.id = $1 AND j.recruiter_id = $2`,
      [applicationId, recruiterId]
    );

    if (current.rows.length === 0) {
      const error = new Error('Application not found or access denied');
      error.statusCode = 404;
      throw error;
    }

    const oldStatus = current.rows[0].status;

    const updated = await client.query(
      `UPDATE applications
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [newStatus, applicationId]
    );

    await client.query(
      `INSERT INTO status_history (application_id, old_status, new_status, note)
       VALUES ($1, $2, $3, $4)`,
      [applicationId, oldStatus, newStatus, note || null]
    );

    await client.query('COMMIT');
    return updated.rows[0];

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
};
