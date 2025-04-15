//backend/src/models/index.js
const sequelize = require('../config/database');
const User = require('./user.model');
const Bus = require('./bus.model');
const Route = require('./route.model');
const Stop = require('./stop.model');
const Student = require('./student.model');
const Trip = require('./trip.model');
const TripLog = require('./tripLog.model');
const Alert = require('./alert.model');
const Notification = require('./notification.model');

// Define relationships
User.hasMany(Student, { foreignKey: 'parentId' });
Student.belongsTo(User, { foreignKey: 'parentId', as: 'parent' });

Bus.belongsTo(User, { foreignKey: 'driverId', as: 'driver' });
User.hasMany(Bus, { foreignKey: 'driverId' });

// Fix: Specify the foreign key to match the existing routeId column
Route.hasMany(Stop, { foreignKey: 'routeId' });
Stop.belongsTo(Route, { foreignKey: 'routeId' });

// Fix: Specify the foreign key for Route-Student relationship
Route.hasMany(Student, { foreignKey: 'routeId' });
Student.belongsTo(Route, { foreignKey: 'routeId' });

Stop.hasMany(Student, { foreignKey: 'assignedStopId' });
Student.belongsTo(Stop, { foreignKey: 'assignedStopId', as: 'assignedStop' });

// Fix: Specify the foreign key for Bus-Trip relationship
Bus.hasMany(Trip, { foreignKey: 'busId' });
Trip.belongsTo(Bus, { foreignKey: 'busId' });

// Fix: Specify the foreign key for Route-Trip relationship
Route.hasMany(Trip, { foreignKey: 'routeId' });
Trip.belongsTo(Route, { foreignKey: 'routeId' });

User.hasMany(Trip, { foreignKey: 'driverId' });
Trip.belongsTo(User, { foreignKey: 'driverId', as: 'driver' });

// Fix: Specify the foreign key for Trip-TripLog relationship
Trip.hasMany(TripLog, { foreignKey: 'tripId' });
TripLog.belongsTo(Trip, { foreignKey: 'tripId' });

// Fix: Specify the foreign key for Trip-Alert relationship
Trip.hasMany(Alert, { foreignKey: 'tripId' });
Alert.belongsTo(Trip, { foreignKey: 'tripId' });

// Fix: Specify the foreign key for User-Notification relationship
User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Define sync options based on environment
    let syncOptions;
    
    if (process.env.NODE_ENV === 'production') {
      // In production, use safer options - ALTER instead of DROP+CREATE
      syncOptions = { alter: true };
      console.log('Using ALTER sync option for production');
    } else {
      // In development, we can use force: true to recreate tables
      // Only use force:true if explicitly set, otherwise use alter:true for safety
      const useForceSync = process.env.DB_FORCE_SYNC === 'true';
      syncOptions = { 
        force: useForceSync,
        alter: !useForceSync
      };
      console.log(`Using ${useForceSync ? 'FORCE' : 'ALTER'} sync option for development`);
    }
    
    // Sync with the determined options
    await sequelize.sync(syncOptions);
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Unable to sync database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Bus,
  Route,
  Stop,
  Student,
  Trip,
  TripLog,
  Alert,
  Notification,
  syncDatabase
};