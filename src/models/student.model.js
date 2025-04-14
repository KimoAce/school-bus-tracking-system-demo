//backend/src/models/student.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  grade: {
    type: DataTypes.STRING
  },
  homeAddress: {
    type: DataTypes.STRING
  },
  homeLatitude: {
    type: DataTypes.DECIMAL(10, 8)
  },
  homeLongitude: {
    type: DataTypes.DECIMAL(10, 8)
  },
  emergencyContact: {
    type: DataTypes.STRING
  },
  parentId: {
    type: DataTypes.INTEGER
  },
  routeId: {
    type: DataTypes.INTEGER
  },
  assignedStopId: {
    type: DataTypes.INTEGER
  }
}, {
  timestamps: true
});

module.exports = Student;