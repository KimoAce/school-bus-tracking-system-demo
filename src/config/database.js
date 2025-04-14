// backend/src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Check if DATABASE_URL is available (Railway environment)
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // Local development fallback
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
