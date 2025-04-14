//backend/src/controllers/trip.controller.js
const { Trip, Bus, Route, User, TripLog, Alert } = require('../models');
const { locationNamespace, alertsNamespace } = require('../socket');

exports.createTrip = async (req, res) => {
  try {
    const { busId, routeId, scheduledStartTime, scheduledEndTime } = req.body;
    
    // Validate required fields
    if (!busId || !routeId || !scheduledStartTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check if bus and route exist
    const bus = await Bus.findByPk(busId);
    const route = await Route.findByPk(routeId);
    
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    
    // Create trip
    const trip = await Trip.create({
      busId,
      routeId,
      driverId: req.userId,
      scheduledStartTime,
      scheduledEndTime,
      status: 'scheduled'
    });
    
    return res.status(201).json(trip);
  } catch (error) {
    console.error('Create trip error:', error);
    return res.status(500).json({ message: 'Error creating trip' });
  }
};

exports.startTrip = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id, {
      include: [
        { model: Bus },
        { model: Route, include: [{ model: Stop }] },
        { model: User, as: 'driver' }
      ]
    });
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    if (trip.status !== 'scheduled') {
      return res.status(400).json({ message: 'Trip is not in scheduled status' });
    }
    
    // Update trip status
    trip.status = 'in_progress';
    trip.actualStartTime = new Date();
    await trip.save();
    
    return res.status(200).json(trip);
  } catch (error) {
    console.error('Start trip error:', error);
    return res.status(500).json({ message: 'Error starting trip' });
  }
};

exports.endTrip = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    if (trip.status !== 'in_progress') {
      return res.status(400).json({ message: 'Trip is not in progress' });
    }
    
    // Update trip status
    trip.status = 'completed';
    trip.actualEndTime = new Date();
    await trip.save();
    
    return res.status(200).json(trip);
  } catch (error) {
    console.error('End trip error:', error);
    return res.status(500).json({ message: 'Error ending trip' });
  }
};

exports.updateTripLocation = async (req, res) => {
  try {
    const { tripId, latitude, longitude, speed, heading, altitude, accuracy } = req.body;
    
    // Validate required fields
    if (!tripId || !latitude || !longitude) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Find trip
    const trip = await Trip.findByPk(tripId, {
      include: [
        { model: Bus },
        { model: Route }
      ]
    });
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    if (trip.status !== 'in_progress') {
      return res.status(400).json({ message: 'Trip is not in progress' });
    }
    
    // Create trip log
    const tripLog = await TripLog.create({
      tripId,
      latitude,
      longitude,
      altitude: altitude || 0,
      heading: heading || 0,
      speed: speed || 0,
      accuracy: accuracy || 0,
      deviceTimestamp: new Date(),
      networkStatus: 'connected',
      clientGeneratedId: `${tripId}-${Date.now()}`
    });
    
    // Check for speed violations (over 30km/h for demo)
    if (speed > 30) {
      const alert = await Alert.create({
        tripId,
        alertType: 'speed',
        message: `Speed violation: ${speed} km/h (limit: 30 km/h)`,
        latitude,
        longitude,
        timestamp: new Date(),
        severity: 'medium'
      });
      
      // Broadcast alert via Socket.IO
      // We'll implement this later when we set up the socket.io connections
    }
    
    // Prepare location data for broadcasting
    const locationData = {
      tripId,
      busId: trip.busId,
      routeId: trip.routeId,
      driverId: trip.driverId,
      latitude,
      longitude,
      speed,
      heading,
      timestamp: new Date()
    };
    
    // This will be used later when we set up the socket.io connections
    // locationNamespace.emit('location:broadcast', locationData);
    
    return res.status(201).json(tripLog);
  } catch (error) {
    console.error('Update trip location error:', error);
    return res.status(500).json({ message: 'Error updating trip location' });
  }
};

exports.getActiveTrip = async (req, res) => {
  try {
    // Find active trip for driver
    const trip = await Trip.findOne({
      where: {
        driverId: req.userId,
        status: 'in_progress'
      },
      include: [
        { model: Bus },
        { model: Route, include: [{ model: Stop }] }
      ]
    });
    
    if (!trip) {
      return res.status(404).json({ message: 'No active trip found' });
    }
    
    return res.status(200).json(trip);
  } catch (error) {
    console.error('Get active trip error:', error);
    return res.status(500).json({ message: 'Error fetching active trip' });
  }
};

exports.getDriverTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll({
      where: {
        driverId: req.userId
      },
      include: [
        { model: Bus },
        { model: Route }
      ],
      order: [['scheduledStartTime', 'DESC']]
    });
    
    return res.status(200).json(trips);
  } catch (error) {
    console.error('Get driver trips error:', error);
    return res.status(500).json({ message: 'Error fetching driver trips' });
  }
};

exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id, {
      include: [
        { model: Bus },
        { model: Route, include: [{ model: Stop }] },
        { model: User, as: 'driver' }
      ]
    });
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    return res.status(200).json(trip);
  } catch (error) {
    console.error('Get trip error:', error);
    return res.status(500).json({ message: 'Error fetching trip' });
  }
};