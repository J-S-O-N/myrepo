// Authentication configuration
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  jwtExpiration: '24h',
  bcryptRounds: 10,
  passwordMinLength: 8
};
