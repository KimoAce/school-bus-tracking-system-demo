//backend/src/models/alert.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alert = sequelize.define('Alert', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tripId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  alertType: {
    type: DataTypes.ENUM('sos', 'delay', 'detour', 'breakdown', 'accident', 'other', 'speed'),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8)
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 8)
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium'
  },
  acknowledged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  acknowledgedBy: {
    type: DataTypes.INTEGER
  },
  acknowledgedAt: {
    type: DataTypes.DATE
  },
  resolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  resolvedBy: {
    type: DataTypes.INTEGER
  },
  resolvedAt: {
    type: DataTypes.DATE
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true
});

module.exports = Alert;