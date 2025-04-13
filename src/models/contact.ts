import { Model, DataTypes, ModelStatic, ModelAttributes, ModelOptions } from 'sequelize';
import { Models, ModelDefinition } from './types';

interface ContactAttributes {
  id: string;
  userId: string;
  campaignId?: string;
  name?: string;
  phoneNumber?: string;
  email?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
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
  campaignId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'unsubscribed', 'bounced'),
    defaultValue: 'active',
  },
};

const options: ModelOptions = {
  modelName: 'Contact',
  timestamps: true,
};

export default (sequelize: any) => {
  class Contact extends Model<ContactAttributes> implements ContactAttributes {
    public id!: string;
    public userId!: string;
    public campaignId?: string;
    public name?: string;
    public phoneNumber?: string;
    public email?: string;
    public status!: 'active' | 'unsubscribed' | 'bounced';
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: Models) {
      Contact.belongsTo(models.User, { foreignKey: 'userId' });
      Contact.belongsTo(models.Campaign, { foreignKey: 'campaignId' });
    }
  }

  Contact.init(attributes, { ...options, sequelize });

  return Contact;
}; 