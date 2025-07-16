const { createTestUser, createTestContact, clearDatabase } = require('./helpers/testHelpers');

// Simple test to verify setup
async function runBasicTests() {
  console.log('Running basic test setup verification...');
  
  try {
    // Clear database
    await clearDatabase();
    console.log('✓ Database cleared successfully');
    
    // Test user creation
    const user = await createTestUser();
    console.log('✓ Test user created:', user.username);
    
    // Test contact creation
    const contact = await createTestContact({}, user.id);
    console.log('✓ Test contact created:', contact.name);
    
    // Clear database again
    await clearDatabase();
    console.log('✓ Database cleared successfully');
    
    console.log('All basic tests passed!');
  } catch (error) {
    console.error('Test setup failed:', error);
    process.exit(1);
  }
}

runBasicTests();