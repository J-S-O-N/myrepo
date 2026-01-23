// Authentication configuration
require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  jwtExpiration: '24h',
  bcryptRounds: 10,
  passwordMinLength: 8
};
