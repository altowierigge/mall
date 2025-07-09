import { readFileSync } from 'fs';
import { join } from 'path';
import { pool, checkDatabaseConnection } from '../config/database';

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Check database connection
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.error('❌ Database connection failed');
      process.exit(1);
    }
    
    // Read and execute seed data
    const seedPath = join(__dirname, '../sql/seed.sql');
    const seedData = readFileSync(seedPath, 'utf8');
    
    console.log('📊 Inserting seed data...');
    await pool.query(seedData);
    
    console.log('✅ Database seeding completed successfully');
    
    // Show inserted data counts
    const tables = [
      'malls', 'shops', 'shop_owners', 'products', 
      'templates', 'offers', 'analytics', 'activity_log'
    ];
    
    console.log('📈 Seeded data counts:');
    for (const table of tables) {
      try {
        const result = await pool.query(`SELECT COUNT(*) FROM ${table}`);
        console.log(`  - ${table}: ${result.rows[0].count} records`);
      } catch (error) {
        console.log(`  - ${table}: table not found or error`);
      }
    }
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  seed();
}

export { seed };