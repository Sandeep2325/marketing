import { Model, DataTypes, ModelStatic, ModelAttributes, ModelOptions } from 'sequelize';
import { Models, ModelDefinition } from './types';

interface UserAttributes {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

const attributes: ModelAttributes = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
};

const options: ModelOptions = {
  modelName: 'User',
  timestamps: true,
};

export default (sequelize: any) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    declare id: string;
    declare email: string;
    declare name?: string;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    static associate(models: Models) {
      User.hasMany(models.UserPhoneNumber, { foreignKey: 'userId' });
      User.hasOne(models.UserEmail, { foreignKey: 'userId' });
      User.hasMany(models.Campaign, { foreignKey: 'userId' });
      User.hasMany(models.Contact, { foreignKey: 'userId' });
    }
  }

  User.init(attributes, { ...options, sequelize });

  return User;
}; 