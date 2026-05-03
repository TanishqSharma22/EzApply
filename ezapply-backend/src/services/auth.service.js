const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { signToken } = require('../utils/jwt.utils');

const SALT_ROUNDS = 12;

const register = async ({ email, password, full_name, role }) => {
  const existing = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );

  if (existing.rows.length > 0) {
    const error = new Error('Email is already registered');
    error.statusCode = 409;
    throw error;
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await pool.query(
    `INSERT INTO users (email, password_hash, full_name, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, full_name, role, created_at`,
    [email, password_hash, full_name, role]
  );

  const user = result.rows[0];
  const token = signToken({ userId: user.id, role: user.role });

  return { user, token };
};

const login = async ({ email, password }) => {
  const result = await pool.query(
    `SELECT id, email, full_name, role, password_hash
     FROM users WHERE email = $1`,
    [email]
  );

  const user = result.rows[0];

  const invalidError = new Error('Invalid email or password');
  invalidError.statusCode = 401;

  if (!user) throw invalidError;

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw invalidError;

  const token = signToken({ userId: user.id, role: user.role });
  const { password_hash, ...safeUser } = user;

  return { user: safeUser, token };
};

module.exports = { register, login };
