const sequelize = require('../config/database');
const User = require('./User');
const Contact = require('./Contact');

User.hasMany(Contact, {
  foreignKey: 'userId',
  as: 'contacts',
  onDelete: 'CASCADE'
});

Contact.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

const db = {
  sequelize,
  User,
  Contact
};

module.exports = db;