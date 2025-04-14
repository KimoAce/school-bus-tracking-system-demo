//backend/src/models/route.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Route = sequelize.define('Route', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT
  },
  startLocation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  endLocation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startLatitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false
  },
  startLongitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false
  },
  endLatitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false
  },
  endLongitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false
  },
  estimatedDuration: {
    type: DataTypes.INTEGER,
    comment: 'Duration in minutes'
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

module.exports = Route;