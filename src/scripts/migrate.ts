import { sequelize } from '@/models';
import models from '@/models';

async function migrate() {
  try {
    // Sync all models
    await sequelize.sync({ force: true });
    console.log('Database migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

migrate(); 