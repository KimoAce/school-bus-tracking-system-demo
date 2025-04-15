// src/db-diagnostic.js
require('dotenv').config();

console.log('--- Database Connection Diagnostic ---');
console.log('Environment:', process.env.NODE_ENV || 'development');

// Check environment variables
console.log('\nChecking environment variables:');
console.log('DATABASE_URL exists:', process.env.DATABASE_URL ? 'YES' : 'NO');
console.log('DB_HOST:', process.env.DB_HOST || 'not set');
console.log('DB_USER:', process.env.DB_USER || 'not set');
console.log('DB_NAME:', process.env.DB_NAME || 'not set');

// Test database connection
async function testConnection() {
  try {
    console.log('\nAttempting database connection...');
    const sequelize = require('./config/database');
    
    await sequelize.authenticate();
    console.log('Database connection successful!');
    
    // Get dialect and storage details
    const dialect = sequelize.getDialect();
    let connectionDetails = 'Using dialect: ' + dialect;
    
    // For MySQL, we can get additional connection info
    if (dialect === 'mysql') {
      const config = sequelize.config;
      if (config.host) {
        connectionDetails += `\nHost: ${config.host}`;
        connectionDetails += `\nDatabase: ${config.database}`;
        connectionDetails += `\nUsername: ${config.username}`;
      } else {
        connectionDetails += '\nUsing connection URI (details hidden)';
      }
    }
    
    console.log(connectionDetails);
    
    return true;
  } catch (error) {
    console.error('Database connection failed:');
    console.error(error.message);
    return false;
  }
}

testConnection()
  .then(success => {
    console.log('\n--- Diagnostic Complete ---');
    process.exit(success ? 0 : 1);
  });