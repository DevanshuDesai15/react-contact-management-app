const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');
const { User } = require('../../models');
const { clearDatabase } = require('../helpers/testHelpers');

describe('User Model', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('User Creation', () => {
    test('should create a user with valid data', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const user = await User.create(userData);

      expect(user.id).toBeDefined();
      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // Password should be hashed
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    test('should hash password before saving', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const user = await User.create(userData);
      expect(user.password).not.toBe(userData.password);
      expect(user.password.length).toBeGreaterThan(50); // Bcrypt hash length
    });

    test('should validate password correctly', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const user = await User.create(userData);
      
      const isValid = await user.validatePassword('password123');
      expect(isValid).toBe(true);
      
      const isInvalid = await user.validatePassword('wrongpassword');
      expect(isInvalid).toBe(false);
    });
  });

  describe('User Validation', () => {
    test('should require username', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should require email', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should require password', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should validate email format', async () => {
      const userData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should enforce unique username', async () => {
      const userData1 = {
        username: 'testuser',
        email: 'test1@example.com',
        password: 'password123'
      };

      const userData2 = {
        username: 'testuser',
        email: 'test2@example.com',
        password: 'password123'
      };

      await User.create(userData1);
      await expect(User.create(userData2)).rejects.toThrow();
    });

    test('should enforce unique email', async () => {
      const userData1 = {
        username: 'testuser1',
        email: 'test@example.com',
        password: 'password123'
      };

      const userData2 = {
        username: 'testuser2',
        email: 'test@example.com',
        password: 'password123'
      };

      await User.create(userData1);
      await expect(User.create(userData2)).rejects.toThrow();
    });

    test('should validate username length', async () => {
      const userData = {
        username: 'ab', // Too short
        email: 'test@example.com',
        password: 'password123'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should validate password length', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: '123' // Too short
      };

      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe('User JSON Serialization', () => {
    test('should not include password in JSON output', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const user = await User.create(userData);
      const userJson = user.toJSON();

      expect(userJson.password).toBeUndefined();
      expect(userJson.username).toBe(userData.username);
      expect(userJson.email).toBe(userData.email);
    });
  });

  describe('User Update', () => {
    test('should hash password when updating', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const user = await User.create(userData);
      const originalPassword = user.password;

      await user.update({ password: 'newpassword123' });
      
      expect(user.password).not.toBe('newpassword123');
      expect(user.password).not.toBe(originalPassword);
      
      const isValidNew = await user.validatePassword('newpassword123');
      expect(isValidNew).toBe(true);
      
      const isValidOld = await user.validatePassword('password123');
      expect(isValidOld).toBe(false);
    });
  });
});