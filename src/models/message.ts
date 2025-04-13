import { Model, DataTypes, ModelStatic, ModelAttributes, ModelOptions } from 'sequelize';
import { Models, ModelDefinition } from './types';

interface MessageAttributes {
  id: string;
  campaignId: string;
  content: string;
  type: 'text' | 'audio' | 'video' | 'email';
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const attributes: ModelAttributes = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  campaignId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('text', 'audio', 'video', 'email'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'sent', 'delivered', 'failed'),
    defaultValue: 'pending',
  },
};

const options: ModelOptions = {
  modelName: 'Message',
  timestamps: true,
};

export default (sequelize: any) => {
  class Message extends Model<MessageAttributes> implements MessageAttributes {
    public id!: string;
    public campaignId!: string;
    public content!: string;
    public type!: 'text' | 'audio' | 'video' | 'email';
    public status!: 'pending' | 'sent' | 'delivered' | 'failed';
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: Models) {
      Message.belongsTo(models.Campaign, { foreignKey: 'campaignId' });
    }
  }

  Message.init(attributes, { ...options, sequelize });

  return Message;
}; 