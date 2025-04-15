// backend/src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Check if DATABASE_URL is available (Railway environment)
if (process.env.DATABASE_URL) {
  console.log('Using DATABASE_URL for connection');
  // Log the format of the URL (masking sensitive data)
  const urlParts = process.env.DATABASE_URL.split('@');
  const hostPart = urlParts.length > 1 ? urlParts[1] : 'unknown';
  console.log(`Database URL format check - Host part: ${hostPart}`);
  
  try {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'mysql',
      logging: true, // Enable logging for debugging
      dialectOptions: {
        ssl: {
          require: false,
          rejectUnauthorized: false
        },
        // Add connection timeout
        connectTimeout: 60000
      },
      // Add retry logic
      retry: {
        max: 3,
        timeout: 60000
      }
    });
    console.log('Sequelize instance created with DATABASE_URL');
  } catch (error) {
    console.error('Error creating Sequelize instance with DATABASE_URL:', error);
    throw error;
  }
} else {
  // Local development fallback
  console.log('Using local database configuration');
  try {
    sequelize = new Sequelize(
      process.env.DB_NAME || 'school_bus_tracking_system_demo',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: true // Enable logging for debugging
      }
    );
    console.log('Sequelize instance created with local configuration');
  } catch (error) {
    console.error('Error creating Sequelize instance with local configuration:', error);
    throw error;
  }
}

// Test the connection immediately and log the result
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
