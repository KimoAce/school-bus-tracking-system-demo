//backend/src/controllers/route.controller.js
const { Route, Stop } = require('../models');
const routeService = require('../services/route.service');

exports.generateRoute = async (req, res) => {
  try {
    const { startLat, startLng, distanceKm } = req.body;
    
    if (!startLat || !startLng) {
      return res.status(400).json({ message: 'Starting coordinates are required' });
    }
    
    // Generate route
    const routeData = await routeService.generateRoute(
      parseFloat(startLat),
      parseFloat(startLng),
      distanceKm ? parseFloat(distanceKm) : 5
    );
    
    // Save route to database
    const route = await Route.create({
      name: routeData.name,
      description: routeData.description,
      startLocation: routeData.startLocation,
      endLocation: routeData.endLocation,
      startLatitude: routeData.startLatitude,
      startLongitude: routeData.startLongitude,
      endLatitude: routeData.endLatitude,
      endLongitude: routeData.endLongitude,
      estimatedDuration: routeData.estimatedDuration,
      active: true
    });
    
    // Save stops
    const stops = await Promise.all(routeData.stops.map(stopData => {
      return Stop.create({
        routeId: route.id,
        name: stopData.name,
        address: stopData.address,
        latitude: stopData.latitude,
        longitude: stopData.longitude,
        sequence: stopData.sequence,
        estimatedArrivalOffset: stopData.estimatedArrivalOffset,
        active: true
      });
    }));
    
    return res.status(201).json({
      route,
      stops
    });
  } catch (error) {
    console.error('Generate route error:', error);
    return res.status(500).json({ message: 'Error generating route' });
  }
};

exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.findAll({
      where: { active: true },
      include: [{ model: Stop }]
    });
    
    return res.status(200).json(routes);
  } catch (error) {
    console.error('Get routes error:', error);
    return res.status(500).json({ message: 'Error fetching routes' });
  }
};

exports.getRoute = async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id, {
      include: [{ model: Stop }]
    });
    
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    
    return res.status(200).json(route);
  } catch (error) {
    console.error('Get route error:', error);
    return res.status(500).json({ message: 'Error fetching route' });
  }
};