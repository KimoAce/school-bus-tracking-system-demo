// src/setup.js
const mysql = require('mysql2/promise');
require('dotenv').config();

async function setup() {
  try {
    console.log('Starting database setup...');
    
    // Create connection without database selected
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });
    
    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'school_bus_tracking_system_demo';
    console.log(`Creating database ${dbName} if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    
    console.log(`Database ${dbName} created or already exists`);
    
    await connection.end();
    console.log('Database setup completed successfully');
    
    // The server.js file will handle table creation through Sequelize
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