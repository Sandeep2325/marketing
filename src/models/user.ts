import { Model, DataTypes, ModelStatic, ModelAttributes, ModelOptions } from 'sequelize';
import { Models, ModelDefinition } from './types';
import { sequelize } from './index';

export interface UserAttributes {
  id: number;
  email: string;
  name?: string;
  password: string;
  subscriptionPlan?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const attributes: ModelAttributes = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
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
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subscriptionPlan: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
};

const options: ModelOptions = {
  modelName: 'User',
  timestamps: true,
};

export default (sequelize: any) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public email!: string;
    public name?: string;
    public password!: string;
    public subscriptionPlan?: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

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