-- Enable UUID generation (PostgreSQL built-in extension)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────
-- ENUM TYPES  (self-documenting constraints)
-- ─────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('job_seeker', 'recruiter');

CREATE TYPE job_status AS ENUM ('open', 'closed', 'draft');

CREATE TYPE application_status AS ENUM (
  'submitted',
  'under_review',
  'shortlisted',
  'rejected',
  'hired'
);

-- ─────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name     VARCHAR(100) NOT NULL,
  role          user_role NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index: auth queries always filter by email
CREATE INDEX idx_users_email ON users(email);
-- Index: dashboard queries filter users by role
CREATE INDEX idx_users_role ON users(role);

-- ─────────────────────────────────────────
-- JOBS
-- ─────────────────────────────────────────

CREATE TABLE jobs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title         VARCHAR(150) NOT NULL,
  company       VARCHAR(100) NOT NULL,
  location      VARCHAR(100),
  description   TEXT NOT NULL,
  status        job_status NOT NULL DEFAULT 'open',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index: recruiters fetch their own jobs constantly
CREATE INDEX idx_jobs_recruiter_id ON jobs(recruiter_id);
-- Index: job seekers browse open jobs (most frequent public query)
CREATE INDEX idx_jobs_status ON jobs(status);
-- Composite: "show me open jobs, newest first" — covers both filter + sort
CREATE INDEX idx_jobs_status_created ON jobs(status, created_at DESC);

-- ─────────────────────────────────────────
-- APPLICATIONS
-- ─────────────────────────────────────────

CREATE TABLE applications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id        UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status        application_status NOT NULL DEFAULT 'submitted',
  cover_letter  TEXT,
  applied_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- One person cannot apply to the same job twice
  CONSTRAINT unique_application UNIQUE (job_id, applicant_id)
);

-- Index: job seekers track their own applications
CREATE INDEX idx_applications_applicant ON applications(applicant_id);
-- Index: recruiters view applications for a specific job
CREATE INDEX idx_applications_job ON applications(job_id);
-- Composite: analytics queries — "applications per job filtered by status"
CREATE INDEX idx_applications_job_status ON applications(job_id, status);

-- ─────────────────────────────────────────
-- STATUS HISTORY  (audit trail)
-- ─────────────────────────────────────────

CREATE TABLE status_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id  UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  old_status      application_status,
  new_status      application_status NOT NULL,
  note            TEXT,
  changed_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index: fetching the history of one application
CREATE INDEX idx_status_history_application ON status_history(application_id);

-- ─────────────────────────────────────────
-- AUTO-UPDATE updated_at ON ROW CHANGE
-- ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();