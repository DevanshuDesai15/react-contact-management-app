import dotenv from 'dotenv';
import { User, sequelize } from './models';

dotenv.config();

const checkUsers = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync models (create tables if they don't exist)
    await sequelize.sync();
    console.log('✅ Database synchronized successfully.');
    
    // Count total users
    const userCount = await User.count();
    console.log(`\n📊 Total users in database: ${userCount}`);
    
    if (userCount > 0) {
      // Fetch all users (without passwords)
      const users = await User.findAll({
        attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
      });
      
      console.log('\n👥 Users in database:');
      console.log('==========================================');
      
      users.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user.id}`);
        console.log(`   Username: ${user.username}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log(`   Updated: ${user.updatedAt}`);
        console.log('------------------------------------------');
      });
    } else {
      console.log('\n❌ No users found in database.');
      console.log('💡 You can create a user by registering through the API or frontend.');
    }
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    // Close database connection
    await sequelize.close();
    console.log('\n✅ Database connection closed.');
    process.exit(0);
  }
};

// Run the script
checkUsers(); 