import { Sequelize, ModelStatic } from 'sequelize';
import User from './user';
import UserPhoneNumber from './userPhoneNumber';
import UserEmail from './userEmail';
import Campaign from './campaign';
import Contact from './contact';
import Message from './message';
import { Models } from './types';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

const models: Models = {
  User: User(sequelize),
  UserPhoneNumber: UserPhoneNumber(sequelize),
  UserEmail: UserEmail(sequelize),
  Campaign: Campaign(sequelize),
  Contact: Contact(sequelize),
  Message: Message(sequelize),
};

// Define relationships
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

export { sequelize };
export default models; 