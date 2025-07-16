const { describe, test, expect, beforeEach } = require('@jest/globals');
const request = require('supertest');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { User, Contact } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { clearDatabase, createTestUser, generateTestToken } = require('./helpers/testHelpers');

// Create a simple test app
const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Auth routes
  app.post('/auth/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
      }
      
      const user = await User.create({ username, email, password });
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
      
      res.status(201).json({ message: 'User created successfully', user, token });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  app.post('/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const isValid = await user.validatePassword(password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
      res.json({ message: 'Login successful', user, token });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  });

  app.get('/contacts', authenticateToken, async (req, res) => {
    try {
      const contacts = await Contact.findAll({
        where: { userId: req.user.id },
        order: [['createdAt', 'DESC']]
      });
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch contacts' });
    }
  });

  app.post('/contacts', authenticateToken, async (req, res) => {
    try {
      const { name, email } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }
      
      const contact = await Contact.create({ name, email, userId: req.user.id });
      res.status(201).json(contact);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create contact' });
    }
  });

  return app;
};

describe('API Integration Tests', () => {
  let app;

  beforeEach(async () => {
    app = createApp();
    await clearDatabase();
  });

  describe('User Registration', () => {
    test('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('User created successfully');
      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.password).toBeUndefined();
      expect(response.body.token).toBeDefined();
    });

    test('should return 400 when required fields are missing', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com'
        // password missing
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('Username, email, and password are required');
    });
  });

  describe('User Login', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await createTestUser();
    });

    test('should login successfully with correct credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body.user.email).toBe(loginData.email);
      expect(response.body.token).toBeDefined();
    });

    test('should return 401 with incorrect password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.error).toBe('Invalid credentials');
    });
  });

  describe('Contacts', () => {
    let testUser;
    let authToken;

    beforeEach(async () => {
      testUser = await createTestUser();
      authToken = generateTestToken(testUser.id);
    });

    test('should fetch empty contacts list initially', async () => {
      const response = await request(app)
        .get('/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });

    test('should create a new contact', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      const response = await request(app)
        .post('/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(contactData)
        .expect(201);

      expect(response.body.name).toBe(contactData.name);
      expect(response.body.email).toBe(contactData.email);
      expect(response.body.userId).toBe(testUser.id);
    });

    test('should require authentication for contacts', async () => {
      const response = await request(app)
        .get('/contacts')
        .expect(401);

      expect(response.body.error).toBe('Access token required');
    });

    test('should return 400 when contact data is invalid', async () => {
      const contactData = {
        name: 'John Doe'
        // email missing
      };

      const response = await request(app)
        .post('/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(contactData)
        .expect(400);

      expect(response.body.error).toBe('Name and email are required');
    });
  });
});