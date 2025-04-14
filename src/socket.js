// This file will export socket.io namespaces that are initialized in server.js

// These will be set by the initializeSocket function
let locationNamespace;
let alertsNamespace;
let notificationsNamespace;

const initializeSocket = (io) => {
  // Get the namespaces
  locationNamespace = io.of('/location');
  alertsNamespace = io.of('/alerts');
  notificationsNamespace = io.of('/notifications');
  
  return {
    locationNamespace,
    alertsNamespace,
    notificationsNamespace
  };
};

module.exports = {
  initializeSocket,
  locationNamespace,
  alertsNamespace,
  notificationsNamespace
};