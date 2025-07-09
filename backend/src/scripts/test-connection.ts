import { pool, checkDatabaseConnection } from '../config/database';

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    const isConnected = await checkDatabaseConnection();
    
    if (isConnected) {
      console.log('✅ Database connection successful');
      
      // Test basic query
      const result = await pool.query('SELECT NOW() as current_time');
      console.log('⏰ Current database time:', result.rows[0].current_time);
      
      // Check database info
      const dbInfo = await pool.query(`
        SELECT 
          current_database() as database_name,
          current_user as user_name,
          version() as version
      `);
      
      console.log('📊 Database information:');
      console.log(`  - Database: ${dbInfo.rows[0].database_name}`);
      console.log(`  - User: ${dbInfo.rows[0].user_name}`);
      console.log(`  - Version: ${dbInfo.rows[0].version.split(' ')[0]}`);
      
      // Check connection pool status
      console.log('🏊 Connection pool status:');
      console.log(`  - Total connections: ${pool.totalCount}`);
      console.log(`  - Idle connections: ${pool.idleCount}`);
      console.log(`  - Waiting clients: ${pool.waitingCount}`);
      
    } else {
      console.error('❌ Database connection failed');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  testConnection();
}

export { testConnection };