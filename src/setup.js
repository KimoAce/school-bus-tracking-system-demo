// src/setup.js
const mysql = require('mysql2/promise');
require('dotenv').config();

async function setup() {
  try {
    console.log('Starting database setup...');
    
    // If using Railway with DATABASE_URL
    if (process.env.DATABASE_URL) {
      console.log('Using Railway DATABASE_URL for database connection');
      // No need to create database as it's already provided by Railway
      return true;
    }
    
    // Local development setup
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });
    
    const dbName = process.env.DB_NAME || 'school_bus_tracking_system_demo';
    console.log(`Creating database ${dbName} if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    
    console.log(`Database ${dbName} created or already exists`);
    
    await connection.end();
    console.log('Database setup completed successfully');
    
    return true;
  } catch (error) {
    console.error('Database setup failed:', error);
    return false;
  }
}

// If this script is run directly
if (require.main === module) {
  setup().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = setup;
