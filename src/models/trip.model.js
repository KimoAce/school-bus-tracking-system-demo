//backend/src/models/trip.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  busId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  routeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  driverId: {
    type: DataTypes.INTEGER
  },
  scheduledStartTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  actualStartTime: {
    type: DataTypes.DATE
  },
  scheduledEndTime: {
    type: DataTypes.DATE
  },
  actualEndTime: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'cancelled', 'delayed'),
    defaultValue: 'scheduled'
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true
});

module.exports = Trip;