import { Model, DataTypes, ModelStatic, ModelAttributes, ModelOptions } from 'sequelize';
import { Models, ModelDefinition } from './types';

interface UserPhoneNumberAttributes {
  id: string;
  userId: string;
  phoneNumber: string;
  type: 'telemarketing' | 'sms';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const attributes: ModelAttributes = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('telemarketing', 'sms'),
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
};

const options: ModelOptions = {
  modelName: 'UserPhoneNumber',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'type'],
    },
  ],
};

export default (sequelize: any) => {
  class UserPhoneNumber extends Model<UserPhoneNumberAttributes> implements UserPhoneNumberAttributes {
    public id!: string;
    public userId!: string;
    public phoneNumber!: string;
    public type!: 'telemarketing' | 'sms';
    public isActive!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: Models) {
      UserPhoneNumber.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  UserPhoneNumber.init(attributes, { ...options, sequelize });

  return UserPhoneNumber;
}; 