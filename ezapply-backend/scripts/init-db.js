require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initDB() {
  const client = await pool.connect();
  
  try {
    // Read schema file
    const schemaPath = path.join(__dirname, '../src/config/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    console.log('Executing schema...');
    await client.query(schema);
    console.log('✅ Schema executed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

initDB();
