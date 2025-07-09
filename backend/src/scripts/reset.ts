import { pool, checkDatabaseConnection } from '../config/database';
import { migrate } from './migrate';
import { seed } from './seed';

async function reset() {
  try {
    console.log('🔄 Starting database reset...');
    
    // Check database connection
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.error('❌ Database connection failed');
      process.exit(1);
    }
    
    // Drop all tables
    console.log('🧹 Dropping existing tables...');
    await pool.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO postgres;
      GRANT ALL ON SCHEMA public TO public;
    `);
    
    console.log('✅ Database reset completed');
    
    // Run migration
    console.log('🔄 Running migration...');
    await migrate();
    
    // Run seeding
    console.log('🌱 Running seeding...');
    await seed();
    
    console.log('🎉 Database reset and setup completed successfully');
    
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  reset();
}

export { reset };