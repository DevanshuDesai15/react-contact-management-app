const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');
const { User, Contact } = require('../../models');
const { clearDatabase, createTestUser } = require('../helpers/testHelpers');

describe('Contact Model', () => {
  let testUser;

  beforeEach(async () => {
    await clearDatabase();
    testUser = await createTestUser();
  });

  describe('Contact Creation', () => {
    test('should create a contact with valid data', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        userId: testUser.id
      };

      const contact = await Contact.create(contactData);

      expect(contact.id).toBeDefined();
      expect(contact.name).toBe(contactData.name);
      expect(contact.email).toBe(contactData.email);
      expect(contact.userId).toBe(testUser.id);
      expect(contact.createdAt).toBeDefined();
      expect(contact.updatedAt).toBeDefined();
    });

    test('should create contact with UUID primary key', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        userId: testUser.id
      };

      const contact = await Contact.create(contactData);
      
      expect(contact.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });
  });

  describe('Contact Validation', () => {
    test('should require name', async () => {
      const contactData = {
        email: 'john@example.com',
        userId: testUser.id
      };

      await expect(Contact.create(contactData)).rejects.toThrow();
    });

    test('should require email', async () => {
      const contactData = {
        name: 'John Doe',
        userId: testUser.id
      };

      await expect(Contact.create(contactData)).rejects.toThrow();
    });

    test('should require userId', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      await expect(Contact.create(contactData)).rejects.toThrow();
    });

    test('should validate email format', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'invalid-email',
        userId: testUser.id
      };

      await expect(Contact.create(contactData)).rejects.toThrow();
    });

    test('should validate name length', async () => {
      const contactData = {
        name: '', // Empty name
        email: 'john@example.com',
        userId: testUser.id
      };

      await expect(Contact.create(contactData)).rejects.toThrow();
    });

    test('should validate email is not empty', async () => {
      const contactData = {
        name: 'John Doe',
        email: '',
        userId: testUser.id
      };

      await expect(Contact.create(contactData)).rejects.toThrow();
    });

    test('should validate userId is valid UUID', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        userId: 'invalid-uuid'
      };

      await expect(Contact.create(contactData)).rejects.toThrow();
    });
  });

  describe('Contact-User Relationship', () => {
    test('should belong to a user', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        userId: testUser.id
      };

      const contact = await Contact.create(contactData);
      const contactWithUser = await Contact.findByPk(contact.id, {
        include: [{ model: User, as: 'user' }]
      });

      expect(contactWithUser.user).toBeDefined();
      expect(contactWithUser.user.id).toBe(testUser.id);
      expect(contactWithUser.user.username).toBe(testUser.username);
    });

    test('should be deleted when user is deleted (CASCADE)', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        userId: testUser.id
      };

      const contact = await Contact.create(contactData);
      
      // Delete the user
      await testUser.destroy();
      
      // Contact should be deleted too
      const deletedContact = await Contact.findByPk(contact.id);
      expect(deletedContact).toBeNull();
    });
  });

  describe('Contact Updates', () => {
    test('should update contact successfully', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        userId: testUser.id
      };

      const contact = await Contact.create(contactData);
      
      const updateData = {
        name: 'Jane Doe',
        email: 'jane@example.com'
      };

      await contact.update(updateData);

      expect(contact.name).toBe(updateData.name);
      expect(contact.email).toBe(updateData.email);
      expect(contact.userId).toBe(testUser.id); // Should remain unchanged
    });

    test('should validate updated email format', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        userId: testUser.id
      };

      const contact = await Contact.create(contactData);
      
      await expect(contact.update({ email: 'invalid-email' })).rejects.toThrow();
    });

    test('should validate updated name is not empty', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        userId: testUser.id
      };

      const contact = await Contact.create(contactData);
      
      await expect(contact.update({ name: '' })).rejects.toThrow();
    });
  });

  describe('Contact Queries', () => {
    test('should find contacts by user', async () => {
      const user2 = await createTestUser({
        username: 'user2',
        email: 'user2@example.com'
      });

      // Create contacts for different users
      await Contact.create({
        name: 'User 1 Contact',
        email: 'contact1@example.com',
        userId: testUser.id
      });

      await Contact.create({
        name: 'User 2 Contact',
        email: 'contact2@example.com',
        userId: user2.id
      });

      const user1Contacts = await Contact.findAll({
        where: { userId: testUser.id }
      });

      const user2Contacts = await Contact.findAll({
        where: { userId: user2.id }
      });

      expect(user1Contacts).toHaveLength(1);
      expect(user2Contacts).toHaveLength(1);
      expect(user1Contacts[0].name).toBe('User 1 Contact');
      expect(user2Contacts[0].name).toBe('User 2 Contact');
    });

    test('should order contacts by creation date', async () => {
      const contact1 = await Contact.create({
        name: 'First Contact',
        email: 'first@example.com',
        userId: testUser.id
      });

      // Wait a bit to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));

      const contact2 = await Contact.create({
        name: 'Second Contact',
        email: 'second@example.com',
        userId: testUser.id
      });

      const contacts = await Contact.findAll({
        where: { userId: testUser.id },
        order: [['createdAt', 'DESC']]
      });

      expect(contacts).toHaveLength(2);
      expect(contacts[0].name).toBe('Second Contact');
      expect(contacts[1].name).toBe('First Contact');
    });
  });
});