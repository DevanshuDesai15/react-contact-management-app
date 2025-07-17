import sequelize from '../config/database';
import User from './User';
import Contact from './Contact';

// Define associations
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

export { sequelize, User, Contact };
export default db; 