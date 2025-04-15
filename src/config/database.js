//backend/src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuration for database connection
let sequelize;

// Check if DATABASE_URL is provided (Railway deployment)
if (process.env.DATABASE_URL) {
  console.log('Using DATABASE_URL for connection');
  
  // Create Sequelize instance from the connection string
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  });
} else {
  // Use individual connection parameters (local development)
  console.log('Using individual DB connection parameters');
  
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
}

module.exports = sequelize;