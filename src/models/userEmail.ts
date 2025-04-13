import { Model, DataTypes, ModelStatic, ModelAttributes, ModelOptions } from 'sequelize';
import { Models, ModelDefinition } from './types';

interface UserEmailAttributes {
  id: string;
  userId: string;
  email: string;
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
};

const options: ModelOptions = {
  modelName: 'UserEmail',
  timestamps: true,
};

export default (sequelize: any) => {
  class UserEmail extends Model<UserEmailAttributes> implements UserEmailAttributes {
    public id!: string;
    public userId!: string;
    public email!: string;
    public isActive!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: Models) {
      UserEmail.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  UserEmail.init(attributes, { ...options, sequelize });

  return UserEmail;
}; 