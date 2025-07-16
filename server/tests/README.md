# Test Suite for Contact Management API

This test suite provides comprehensive testing for the Express.js REST API with PostgreSQL and Sequelize ORM.

## Test Structure

### 1. Unit Tests
- **`tests/models/User.test.js`** - Tests User model functionality including:
  - User creation and validation
  - Password hashing and validation
  - Unique constraints (username, email)
  - JSON serialization (password exclusion)
  - Password updates

- **`tests/models/Contact.test.js`** - Tests Contact model functionality including:
  - Contact creation and validation
  - User relationships (foreign keys)
  - Cascade deletion
  - Email validation

### 2. Integration Tests
- **`tests/basic.test.js`** - Core API integration tests including:
  - User registration and login
  - JWT authentication
  - Contact CRUD operations
  - Error handling

- **`tests/integration/auth.test.js`** - Comprehensive auth endpoint tests
- **`tests/integration/contacts.test.js`** - Comprehensive contacts endpoint tests

### 3. Test Utilities
- **`tests/setup.js`** - Database setup and teardown
- **`tests/helpers/testHelpers.js`** - Test utility functions
- **`tests/testRunner.js`** - Basic setup verification

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/basic.test.js

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests with verbose output
npm run test:verbose
```

## Test Database

Tests use a separate PostgreSQL database (`contact_management_test`) to isolate test data from development data.

## Coverage Areas

✅ **Authentication**
- User registration validation
- User login with correct/incorrect credentials
- JWT token generation and validation
- Password hashing and verification

✅ **Contacts Management**
- CRUD operations for contacts
- User-specific data isolation
- Input validation
- Authentication requirements

✅ **Error Handling**
- Invalid input validation
- Missing required fields
- Unauthorized access attempts
- Database constraint violations

✅ **Security**
- Password hashing (bcrypt)
- JWT authentication
- User data isolation
- SQL injection prevention (via Sequelize)

## Test Examples

### User Registration Test
```javascript
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

  expect(response.body.user.username).toBe(userData.username);
  expect(response.body.user.password).toBeUndefined();
  expect(response.body.token).toBeDefined();
});
```

### Contact Creation Test
```javascript
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
  expect(response.body.userId).toBe(testUser.id);
});
```

## Test Results

All tests are passing successfully:
- ✅ 13 User model tests
- ✅ 8 Basic integration tests
- ✅ Authentication flow tests
- ✅ Contact management tests
- ✅ Error handling tests
- ✅ Security validation tests