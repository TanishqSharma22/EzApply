const pool = require('../config/db');

const createJob = async ({ recruiterId, title, company, location, description }) => {
  const result = await pool.query(
    `INSERT INTO jobs (recruiter_id, title, company, location, description)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [recruiterId, title, company, location, description]
  );
  return result.rows[0];
};

const getJobs = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const searchPattern = `%${search}%`;

  const dataQuery = pool.query(
    `SELECT
       j.id, j.title, j.company, j.location, j.status, j.created_at,
       u.full_name AS recruiter_name
     FROM jobs j
     JOIN users u ON u.id = j.recruiter_id
     WHERE j.status = 'open'
       AND (j.title ILIKE $1 OR j.company ILIKE $1)
     ORDER BY j.created_at DESC
     LIMIT $2 OFFSET $3`,
    [searchPattern, limit, offset]
  );

  const countQuery = pool.query(
    `SELECT COUNT(*) FROM jobs
     WHERE status = 'open'
       AND (title ILIKE $1 OR company ILIKE $1)`,
    [searchPattern]
  );

  const [dataResult, countResult] = await Promise.all([dataQuery, countQuery]);
  const total = parseInt(countResult.rows[0].count, 10);

  return {
    jobs: dataResult.rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getJobById = async (jobId) => {
  const result = await pool.query(
    `SELECT
       j.*,
       u.full_name AS recruiter_name,
       u.email AS recruiter_email
     FROM jobs j
     JOIN users u ON u.id = j.recruiter_id
     WHERE j.id = $1`,
    [jobId]
  );

  if (result.rows.length === 0) {
    const error = new Error('Job not found');
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

const updateJob = async ({ jobId, recruiterId, updates }) => {
  const { title, company, location, description, status } = updates;

  const result = await pool.query(
    `UPDATE jobs
     SET
       title       = COALESCE($1, title),
       company     = COALESCE($2, company),
       location    = COALESCE($3, location),
       description = COALESCE($4, description),
       status      = COALESCE($5, status)
     WHERE id = $6 AND recruiter_id = $7
     RETURNING *`,
    [title, company, location, description, status, jobId, recruiterId]
  );

  if (result.rows.length === 0) {
    const error = new Error('Job not found or you do not own this job');
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

const deleteJob = async ({ jobId, recruiterId }) => {
  const result = await pool.query(
    `DELETE FROM jobs
     WHERE id = $1 AND recruiter_id = $2
     RETURNING id`,
    [jobId, recruiterId]
  );

  if (result.rows.length === 0) {
    const error = new Error('Job not found or you do not own this job');
    error.statusCode = 404;
    throw error;
  }

  return { deleted: true, id: result.rows[0].id };
};

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob };
