import { Pool } from 'pg';

// Test database configuration
const testDbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'mall_app_test',
  user: process.env.DB_USER || 'test_user',
  password: process.env.DB_PASSWORD || 'test_password'
};

export const testPool = new Pool(testDbConfig);

// Global test setup
beforeAll(async () => {
  // Create test database tables
  await testPool.query(`
    CREATE TABLE IF NOT EXISTS test_table (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Global test cleanup
afterAll(async () => {
  await testPool.end();
});

// Clean up between tests
afterEach(async () => {
  // Clean up test data
  await testPool.query('DELETE FROM test_table');
});

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_key_for_testing_only';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_key_for_testing_only';