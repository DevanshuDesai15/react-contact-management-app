const { User, Contact } = require('../../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createTestUser = async (userData = {}) => {
  const defaultUserData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  };

  const user = await User.create({ ...defaultUserData, ...userData });
  return user;
};

const createTestContact = async (contactData = {}, userId) => {
  const defaultContactData = {
    name: 'Test Contact',
    email: 'contact@example.com'
  };

  const contact = await Contact.create({ 
    ...defaultContactData, 
    ...contactData,
    userId 
  });
  return contact;
};

const generateTestToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const clearDatabase = async () => {
  await Contact.destroy({ where: {}, force: true });
  await User.destroy({ where: {}, force: true });
};

module.exports = {
  createTestUser,
  createTestContact,
  generateTestToken,
  hashPassword,
  clearDatabase
};