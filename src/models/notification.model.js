//backend/src/models/notification.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  relatedTo: {
    type: DataTypes.STRING,
    comment: 'Entity type: trip, alert, etc.'
  },
  relatedId: {
    type: DataTypes.INTEGER,
    comment: 'ID of the related entity'
  },
  type: {
    type: DataTypes.ENUM('info', 'alert', 'warning', 'action_required'),
    defaultValue: 'info'
  },
  status: {
    type: DataTypes.ENUM('sent', 'delivered', 'read', 'failed'),
    defaultValue: 'sent'
  },
  sentVia: {
    type: DataTypes.ENUM('websocket', 'sms', 'push', 'email'),
    defaultValue: 'websocket'
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  readAt: {
    type: DataTypes.DATE
  },
  expiresAt: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true
});

module.exports = Notification;