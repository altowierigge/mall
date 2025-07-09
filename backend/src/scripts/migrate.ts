import { readFileSync } from 'fs';
import { join } from 'path';
import { pool, checkDatabaseConnection } from '../config/database';

async function migrate() {
  try {
    console.log('🔄 Starting database migration...');
    
    // Check database connection
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.error('❌ Database connection failed');
      process.exit(1);
    }
    
    // Read and execute schema
    const schemaPath = join(__dirname, '../sql/schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Executing schema migration...');
    await pool.query(schema);
    
    console.log('✅ Database migration completed successfully');
    
    // Check if tables were created
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📊 Created tables:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  migrate();
}

export { migrate };