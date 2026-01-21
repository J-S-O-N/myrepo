const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');

const UserSettings = sequelize.define('UserSettings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // One-to-one relationship
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  // Address Information
  street_address: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  postal_code: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING(100),
    defaultValue: 'South Africa',
  },
  // Transaction Limits (in cents for precision)
  daily_limit: {
    type: DataTypes.INTEGER,
    defaultValue: 500000, // R 5,000.00
  },
  monthly_limit: {
    type: DataTypes.INTEGER,
    defaultValue: 5000000, // R 50,000.00
  },
  mobile_app_limit: {
    type: DataTypes.INTEGER,
    defaultValue: 300000, // R 3,000.00
  },
  internet_banking_limit: {
    type: DataTypes.INTEGER,
    defaultValue: 1000000, // R 10,000.00
  },
  atm_limit: {
    type: DataTypes.INTEGER,
    defaultValue: 200000, // R 2,000.00
  },
  // Card Settings
  card_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  contactless_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  online_payments_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  international_transactions_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // Communication Preferences
  email_notifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  sms_notifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  whatsapp_notifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  in_app_notifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'user_settings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = UserSettings;
