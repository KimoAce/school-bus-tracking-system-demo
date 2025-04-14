//backend/src/models/tripLog.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TripLog = sequelize.define('TripLog', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  tripId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  altitude: {
    type: DataTypes.DECIMAL(10, 2)
  },
  heading: {
    type: DataTypes.DECIMAL(5, 2)
  },
  speed: {
    type: DataTypes.DECIMAL(10, 2)
  },
  accuracy: {
    type: DataTypes.DECIMAL(10, 2)
  },
  deviceTimestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  networkStatus: {
    type: DataTypes.STRING
  },
  clientGeneratedId: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true
});

module.exports = TripLog;