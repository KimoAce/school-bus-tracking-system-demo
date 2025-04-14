//backend/src/controllers/alert.controller.js
const { Alert, Trip } = require('../models');

exports.createAlert = async (req, res) => {
  try {
    const { tripId, alertType, message, latitude, longitude, severity } = req.body;
    
    // Validate required fields
    if (!tripId || !alertType || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check if trip exists
    const trip = await Trip.findByPk(tripId);
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    // Create alert
    const alert = await Alert.create({
      tripId,
      alertType,
      message,
      latitude,
      longitude,
      timestamp: new Date(),
      severity: severity || 'medium'
    });
    
    // This will be used later when we set up the socket.io connections
    // alertsNamespace.emit('alert:broadcast', alert);
    
    return res.status(201).json(alert);
  } catch (error) {
    console.error('Create alert error:', error);
    return res.status(500).json({ message: 'Error creating alert' });
  }
};

exports.acknowledgeAlert = async (req, res) => {
  try {
    const alert = await Alert.findByPk(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    if (alert.acknowledged) {
      return res.status(400).json({ message: 'Alert already acknowledged' });
    }
    
    // Update alert
    alert.acknowledged = true;
    alert.acknowledgedBy = req.userId;
    alert.acknowledgedAt = new Date();
    await alert.save();
    
    return res.status(200).json(alert);
  } catch (error) {
    console.error('Acknowledge alert error:', error);
    return res.status(500).json({ message: 'Error acknowledging alert' });
  }
};

exports.resolveAlert = async (req, res) => {
  try {
    const { notes } = req.body;
    
    const alert = await Alert.findByPk(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    if (alert.resolved) {
      return res.status(400).json({ message: 'Alert already resolved' });
    }
    
    // Update alert
    alert.resolved = true;
    alert.resolvedBy = req.userId;
    alert.resolvedAt = new Date();
    alert.notes = notes;
    await alert.save();
    
    return res.status(200).json(alert);
  } catch (error) {
    console.error('Resolve alert error:', error);
    return res.status(500).json({ message: 'Error resolving alert' });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.findAll({
      order: [['timestamp', 'DESC']]
    });
    
    return res.status(200).json(alerts);
  } catch (error) {
    console.error('Get alerts error:', error);
    return res.status(500).json({ message: 'Error fetching alerts' });
  }
};

exports.getTripAlerts = async (req, res) => {
  try {
    const alerts = await Alert.findAll({
      where: {
        tripId: req.params.tripId
      },
      order: [['timestamp', 'DESC']]
    });
    
    return res.status(200).json(alerts);
  } catch (error) {
    console.error('Get trip alerts error:', error);
    return res.status(500).json({ message: 'Error fetching trip alerts' });
  }
};