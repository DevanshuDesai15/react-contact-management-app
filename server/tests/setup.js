const { Sequelize } = require('sequelize');
const path = require('path');

process.env.NODE_ENV = 'test';

require('dotenv').config({ path: path.join(__dirname, '../.env.test') });

const { User, Contact } = require('../models');

const setupTestDB = async () => {
  try {
    await User.sequelize.authenticate();
    console.log('Test database connection established successfully.');
    
    // Sync models
    await User.sequelize.sync({ force: true });
    console.log('Test database models synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the test database:', error);
    process.exit(1);
  }
};

const cleanupTestDB = async () => {
  try {
    await User.sequelize.drop();
    await User.sequelize.close();
    console.log('Test database cleaned up successfully.');
  } catch (error) {
    console.error('Error cleaning up test database:', error);
  }
};

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await cleanupTestDB();
});

module.exports = {
  setupTestDB,
  cleanupTestDB
};