const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const dialect = process.env.DB_DIALECT || 'sqlite';
const config = {
  dialect: dialect,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

// SQLite uses storage, PostgreSQL uses host/port/database
if (dialect === 'sqlite') {
  config.storage = process.env.DB_STORAGE || './server/database.sqlite';
} else {
  config.host = process.env.DB_HOST || 'localhost';
  config.port = process.env.DB_PORT || 5432;
}

const sequelize = new Sequelize(
  process.env.DB_NAME || 'testaiapp',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  config
);

module.exports = sequelize;
