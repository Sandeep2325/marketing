import { sequelize } from '../models';

async function migrate() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await sequelize.close();
  }
}

migrate(); 