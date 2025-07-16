const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isEmail: true
    }
  }
}, {
  tableName: 'contacts',
  timestamps: true,
  underscored: true
});

module.exports = Contact;