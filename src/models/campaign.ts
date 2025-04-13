import { Model, DataTypes, ModelStatic, ModelAttributes, ModelOptions } from 'sequelize';
import { Models, ModelDefinition } from './types';

interface CampaignAttributes {
  id: string;
  userId: string;
  type: 'telemarketing' | 'sms' | 'email' | 'video';
  name: string;
  status: 'draft' | 'active' | 'completed' | 'failed';
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
  type: {
    type: DataTypes.ENUM('telemarketing', 'sms', 'email', 'video'),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'completed', 'failed'),
    defaultValue: 'draft',
  },
};

const options: ModelOptions = {
  modelName: 'Campaign',
  timestamps: true,
};

export default (sequelize: any) => {
  class Campaign extends Model<CampaignAttributes> implements CampaignAttributes {
    public id!: string;
    public userId!: string;
    public type!: 'telemarketing' | 'sms' | 'email' | 'video';
    public name!: string;
    public status!: 'draft' | 'active' | 'completed' | 'failed';
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: Models) {
      Campaign.belongsTo(models.User, { foreignKey: 'userId' });
      Campaign.hasMany(models.Contact, { foreignKey: 'campaignId' });
      Campaign.hasMany(models.Message, { foreignKey: 'campaignId' });
    }
  }

  Campaign.init(attributes, { ...options, sequelize });

  return Campaign;
}; 