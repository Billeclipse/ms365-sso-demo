const { Sequelize } = require('sequelize');
const config = require('../config');

// Create a Sequelize instance using the config values
const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    logging: false
  }
);

// Import models
const User = require('./user')(sequelize);

// Sync the database. In a real application you might use migrations instead.
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Database connected and synced.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = {
  sequelize,
  initializeDatabase,
  User
};