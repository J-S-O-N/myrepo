const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');

const Goal = sequelize.define('Goal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  target_amount: {
    type: DataTypes.INTEGER, // in cents
    allowNull: false,
  },
  current_amount: {
    type: DataTypes.INTEGER, // in cents
    defaultValue: 0,
  },
  target_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Other',
  },
  icon: {
    type: DataTypes.STRING(10),
    defaultValue: '🎯',
  },
  color: {
    type: DataTypes.STRING(50),
    defaultValue: 'blue',
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'paused'),
    defaultValue: 'active',
  },
}, {
  tableName: 'goals',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Goal;
