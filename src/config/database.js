// backend/src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuration for database connection
let sequelize;

// Check if DATABASE_URL is provided (Railway deployment)
if (process.env.DATABASE_URL) {
  console.log('Using DATABASE_URL for connection');
  
  // Log the format of the URL (masking sensitive data)
  const urlParts = process.env.DATABASE_URL.split('@');
  const hostPart = urlParts.length > 1 ? urlParts[1] : 'unknown';
  console.log(`Database URL format check - Host part: ${hostPart}`);
  
  try {
    // Create Sequelize instance from the connection string
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'mysql',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false
        } : false,
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
  // Use individual connection parameters (local development)
  console.log('Using individual DB connection parameters');
  
  try {
    sequelize = new Sequelize(
      process.env.DB_NAME || 'school_bus_tracking_system_demo',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
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
