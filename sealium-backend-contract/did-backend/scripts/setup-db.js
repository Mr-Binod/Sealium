const { Pool } = require('pg');
require('dotenv').config();

async function setupDatabase() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'did_database',
    ssl: false, // Disable SSL for local development
  });

  try {
    console.log('Connecting to database...');
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connection successful');
    
    // Check if tables exist
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('dids', 'did_documents', 'verification_methods', 'services')
    `);
    
    if (result.rows.length === 0) {
      console.log('⚠️  No tables found. Please run: npm run db:push');
    } else {
      console.log('✅ Database tables found:', result.rows.map(row => row.table_name));
    }
    
    client.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\nPlease make sure:');
    console.log('1. PostgreSQL is running');
    console.log('2. Database "did_database" exists');
    console.log('3. Environment variables are set correctly');
  } finally {
    await pool.end();
  }
}

setupDatabase(); 