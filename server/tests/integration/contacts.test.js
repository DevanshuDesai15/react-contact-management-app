const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');
const request = require('supertest');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { User, Contact } = require('../../models');
const { authenticateToken } = require('../../middleware/auth');
const { clearDatabase, createTestUser, createTestContact, generateTestToken } = require('../helpers/testHelpers');

// Create test app with contacts routes
const createTestApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // GET /contacts - Fetch all contacts for authenticated user
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

  // POST /contacts - Create new contact for authenticated user
  app.post('/contacts', authenticateToken, async (req, res) => {
    try {
      const { name, email } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }
      
      const contact = await Contact.create({
        name,
        email,
        userId: req.user.id
      });
      
      res.status(201).json(contact);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create contact' });
    }
  });

  // PUT /contacts/:id - Update contact for authenticated user
  app.put('/contacts/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }
      
      const contact = await Contact.findOne({
        where: { id, userId: req.user.id }
      });
      
      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      
      await contact.update({ name, email });
      res.json(contact);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update contact' });
    }
  });

  // DELETE /contacts/:id - Delete contact for authenticated user
  app.delete('/contacts/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      
      const contact = await Contact.findOne({
        where: { id, userId: req.user.id }
      });
      
      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      
      await contact.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete contact' });
    }
  });

  return app;
};

describe('Contacts Endpoints', () => {
  let app;
  let testUser;
  let testUser2;
  let authToken;
  let authToken2;

  beforeEach(async () => {
    app = createTestApp();
    await clearDatabase();
    
    testUser = await createTestUser();
    testUser2 = await createTestUser({
      username: 'testuser2',
      email: 'test2@example.com'
    });
    
    authToken = generateTestToken(testUser.id);
    authToken2 = generateTestToken(testUser2.id);
  });

  describe('GET /contacts', () => {
    test('should fetch all contacts for authenticated user', async () => {
      // Create contacts for testUser
      await createTestContact({ name: 'Contact 1', email: 'contact1@example.com' }, testUser.id);
      await createTestContact({ name: 'Contact 2', email: 'contact2@example.com' }, testUser.id);
      
      // Create contact for testUser2
      await createTestContact({ name: 'Contact 3', email: 'contact3@example.com' }, testUser2.id);

      const response = await request(app)
        .get('/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('Contact 2'); // Ordered by createdAt DESC
      expect(response.body[1].name).toBe('Contact 1');
      expect(response.body[0].userId).toBe(testUser.id);
      expect(response.body[1].userId).toBe(testUser.id);
    });

    test('should return empty array when user has no contacts', async () => {
      const response = await request(app)
        .get('/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });

    test('should return 401 when no token provided', async () => {
      const response = await request(app)
        .get('/contacts')
        .expect(401);

      expect(response.body.error).toBe('Access token required');
    });

    test('should return 401 when invalid token provided', async () => {
      const response = await request(app)
        .get('/contacts')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);

      expect(response.body.error).toBe('Invalid or expired token');
    });

    test('should return 401 when token is for non-existent user', async () => {
      const fakeToken = jwt.sign({ userId: 'non-existent-id' }, process.env.JWT_SECRET);
      
      const response = await request(app)
        .get('/contacts')
        .set('Authorization', `Bearer ${fakeToken}`)
        .expect(401);

      expect(response.body.error).toBe('Invalid token');
    });
  });

  describe('POST /contacts', () => {
    test('should create a new contact successfully', async () => {
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
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    test('should return 400 when name is missing', async () => {
      const contactData = {
        email: 'john@example.com'
      };

      const response = await request(app)
        .post('/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(contactData)
        .expect(400);

      expect(response.body.error).toBe('Name and email are required');
    });

    test('should return 400 when email is missing', async () => {
      const contactData = {
        name: 'John Doe'
      };

      const response = await request(app)
        .post('/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(contactData)
        .expect(400);

      expect(response.body.error).toBe('Name and email are required');
    });

    test('should return 400 when email format is invalid', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(contactData)
        .expect(400);

      expect(response.body.error).toBe('Validation error');
    });

    test('should return 400 when name is empty', async () => {
      const contactData = {
        name: '',
        email: 'john@example.com'
      };

      const response = await request(app)
        .post('/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(contactData)
        .expect(400);

      expect(response.body.error).toBe('Validation error');
    });

    test('should return 401 when no token provided', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      const response = await request(app)
        .post('/contacts')
        .send(contactData)
        .expect(401);

      expect(response.body.error).toBe('Access token required');
    });
  });

  describe('PUT /contacts/:id', () => {
    let testContact;

    beforeEach(async () => {
      testContact = await createTestContact({ name: 'Original Name', email: 'original@example.com' }, testUser.id);
    });

    test('should update contact successfully', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      const response = await request(app)
        .put(`/contacts/${testContact.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.email).toBe(updateData.email);
      expect(response.body.userId).toBe(testUser.id);
      expect(response.body.id).toBe(testContact.id);
    });

    test('should return 400 when name is missing', async () => {
      const updateData = {
        email: 'updated@example.com'
      };

      const response = await request(app)
        .put(`/contacts/${testContact.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.error).toBe('Name and email are required');
    });

    test('should return 400 when email is missing', async () => {
      const updateData = {
        name: 'Updated Name'
      };

      const response = await request(app)
        .put(`/contacts/${testContact.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.error).toBe('Name and email are required');
    });

    test('should return 400 when email format is invalid', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'invalid-email'
      };

      const response = await request(app)
        .put(`/contacts/${testContact.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.error).toBe('Validation error');
    });

    test('should return 404 when contact does not exist', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      const response = await request(app)
        .put('/contacts/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body.error).toBe('Contact not found');
    });

    test('should return 404 when trying to update another user\'s contact', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      const response = await request(app)
        .put(`/contacts/${testContact.id}`)
        .set('Authorization', `Bearer ${authToken2}`)
        .send(updateData)
        .expect(404);

      expect(response.body.error).toBe('Contact not found');
    });

    test('should return 401 when no token provided', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      const response = await request(app)
        .put(`/contacts/${testContact.id}`)
        .send(updateData)
        .expect(401);

      expect(response.body.error).toBe('Access token required');
    });
  });

  describe('DELETE /contacts/:id', () => {
    let testContact;

    beforeEach(async () => {
      testContact = await createTestContact({ name: 'Test Contact', email: 'test@example.com' }, testUser.id);
    });

    test('should delete contact successfully', async () => {
      const response = await request(app)
        .delete(`/contacts/${testContact.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      expect(response.body).toEqual({});

      // Verify contact was deleted
      const deletedContact = await Contact.findByPk(testContact.id);
      expect(deletedContact).toBeNull();
    });

    test('should return 404 when contact does not exist', async () => {
      const response = await request(app)
        .delete('/contacts/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.error).toBe('Contact not found');
    });

    test('should return 404 when trying to delete another user\'s contact', async () => {
      const response = await request(app)
        .delete(`/contacts/${testContact.id}`)
        .set('Authorization', `Bearer ${authToken2}`)
        .expect(404);

      expect(response.body.error).toBe('Contact not found');
    });

    test('should return 401 when no token provided', async () => {
      const response = await request(app)
        .delete(`/contacts/${testContact.id}`)
        .expect(401);

      expect(response.body.error).toBe('Access token required');
    });
  });

  describe('User Isolation', () => {
    test('should ensure users can only access their own contacts', async () => {
      // Create contacts for both users
      const user1Contact = await createTestContact({ name: 'User 1 Contact', email: 'user1@example.com' }, testUser.id);
      const user2Contact = await createTestContact({ name: 'User 2 Contact', email: 'user2@example.com' }, testUser2.id);

      // User 1 should only see their own contact
      const user1Response = await request(app)
        .get('/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(user1Response.body).toHaveLength(1);
      expect(user1Response.body[0].name).toBe('User 1 Contact');

      // User 2 should only see their own contact
      const user2Response = await request(app)
        .get('/contacts')
        .set('Authorization', `Bearer ${authToken2}`)
        .expect(200);

      expect(user2Response.body).toHaveLength(1);
      expect(user2Response.body[0].name).toBe('User 2 Contact');
    });
  });
});