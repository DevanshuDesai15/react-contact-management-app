const sequelize = require('../config/database');
const Contact = require('./Contact');

const db = {
  sequelize,
  Contact
};

module.exports = db;