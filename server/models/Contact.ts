import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { IContact } from '../types';

interface ContactCreationAttributes extends Optional<IContact, 'id' | 'createdAt' | 'updatedAt'> {}

class Contact extends Model<IContact, ContactCreationAttributes> implements IContact {
  public id!: string;
  public name!: string;
  public email!: string;
  public userId!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Contact.init({
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
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'contacts',
  timestamps: true,
  underscored: true
});

export default Contact; 