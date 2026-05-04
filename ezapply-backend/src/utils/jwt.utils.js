require('dotenv').config();
const jwt = require('jsonwebtoken');

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined in environment variables');
  return secret;
};

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const signToken = (payload) => jwt.sign(payload, getSecret(), { expiresIn: JWT_EXPIRES_IN });
const verifyToken = (token) => jwt.verify(token, getSecret());

module.exports = { signToken, verifyToken };
