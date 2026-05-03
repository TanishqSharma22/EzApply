const pool = require('../config/db');

const getRecruiterAnalytics = async (recruiterId) => {
  const [
    overviewResult,
    statusBreakdownResult,
    topJobsResult,
    dailyApplicationsResult,
    avgTimeToHireResult,
  ] = await Promise.all([

    pool.query(
      `SELECT
         COUNT(DISTINCT j.id)                          AS total_jobs,
         COUNT(DISTINCT j.id)
           FILTER (WHERE j.status = 'open')            AS open_jobs,
         COUNT(a.id)                                   AS total_applications
       FROM jobs j
       LEFT JOIN applications a ON a.job_id = j.id
       WHERE j.recruiter_id = $1`,
      [recruiterId]
    ),

    pool.query(
      `SELECT
         a.status,
         COUNT(*) AS count
       FROM applications a
       JOIN jobs j ON j.id = a.job_id
       WHERE j.recruiter_id = $1
       GROUP BY a.status
       ORDER BY count DESC`,
      [recruiterId]
    ),

    pool.query(
      `SELECT
         j.id,
         j.title,
         j.company,
         j.status,
         COUNT(a.id) AS application_count
       FROM jobs j
       LEFT JOIN applications a ON a.job_id = j.id
       WHERE j.recruiter_id = $1
       GROUP BY j.id, j.title, j.company, j.status
       ORDER BY application_count DESC
       LIMIT 5`,
      [recruiterId]
    ),

    pool.query(
      `WITH date_series AS (
         SELECT generate_series(
           NOW() - INTERVAL '29 days',
           NOW(),
           INTERVAL '1 day'
         )::DATE AS day
       )
       SELECT
         ds.day,
         COUNT(a.id) AS applications
       FROM date_series ds
       LEFT JOIN applications a
         ON a.applied_at::DATE = ds.day
         AND a.job_id IN (
           SELECT id FROM jobs WHERE recruiter_id = $1
         )
       GROUP BY ds.day
       ORDER BY ds.day ASC`,
      [recruiterId]
    ),

    pool.query(
      `SELECT
         ROUND(
           AVG(
             EXTRACT(EPOCH FROM (sh.changed_at - a.applied_at)) / 86400
           )::NUMERIC, 1
         ) AS avg_days_to_hire
       FROM applications a
       JOIN jobs j ON j.id = a.job_id
       JOIN status_history sh
         ON sh.application_id = a.id
         AND sh.new_status = 'hired'
       WHERE j.recruiter_id = $1`,
      [recruiterId]
    ),
  ]);

  return {
    overview: overviewResult.rows[0],
    statusBreakdown: statusBreakdownResult.rows,
    topJobs: topJobsResult.rows,
    dailyApplications: dailyApplicationsResult.rows,
    avgDaysToHire: avgTimeToHireResult.rows[0]?.avg_days_to_hire ?? null,
  };
};

const getSeekerAnalytics = async (applicantId) => {
  const [
    overviewResult,
    statusBreakdownResult,
    recentActivityResult,
  ] = await Promise.all([

    pool.query(
      `SELECT
         COUNT(*)                                        AS total_applied,
         COUNT(*) FILTER (WHERE status = 'hired')        AS total_hired,
         COUNT(*) FILTER (WHERE status = 'shortlisted')  AS total_shortlisted,
         COUNT(*) FILTER (WHERE status = 'rejected')     AS total_rejected,
         ROUND(
           COUNT(*) FILTER (WHERE status = 'hired')::NUMERIC
           / NULLIF(COUNT(*), 0) * 100, 1
         )                                               AS success_rate_pct
       FROM applications
       WHERE applicant_id = $1`,
      [applicantId]
    ),

    pool.query(
      `SELECT status, COUNT(*) AS count
       FROM applications
       WHERE applicant_id = $1
       GROUP BY status
       ORDER BY count DESC`,
      [applicantId]
    ),

    pool.query(
      `SELECT
         sh.new_status,
         sh.old_status,
         sh.changed_at,
         j.title AS job_title,
         j.company
       FROM status_history sh
       JOIN applications a ON a.id = sh.application_id
       JOIN jobs j ON j.id = a.job_id
       WHERE a.applicant_id = $1
       ORDER BY sh.changed_at DESC
       LIMIT 5`,
      [applicantId]
    ),
  ]);

  return {
    overview: overviewResult.rows[0],
    statusBreakdown: statusBreakdownResult.rows,
    recentActivity: recentActivityResult.rows,
  };
};

module.exports = { getRecruiterAnalytics, getSeekerAnalytics };
