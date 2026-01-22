const sequelize = require('../config/database.cjs');
const User = require('./User.cjs');
const UserSettings = require('./UserSettings.cjs');
const Goal = require('./Goal.cjs');

// Define associations (one-to-one relationship)
User.hasOne(UserSettings, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  as: 'settings',
});

UserSettings.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// Define associations (one-to-many relationship for goals)
User.hasMany(Goal, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  as: 'goals',
});

Goal.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// Sync database (create tables if they don't exist)
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log('✅ Database synced successfully');
  } catch (error) {
    console.error('❌ Database sync error:', error);
  }
};

module.exports = {
  sequelize,
  User,
  UserSettings,
  Goal,
  syncDatabase,
};
