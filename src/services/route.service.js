//backend/src/services/route.service.js
const axios = require('axios');

exports.generateRoute = async (startLat, startLng, distanceKm = 5) => {
  try {
    // For demo purposes, we'll create a simple route with the given start point
    // In a real implementation, we would use OSRM or a similar service
    
    // Calculate end point (roughly 5km away in a random direction)
    const angle = Math.random() * Math.PI * 2; // Random angle in radians
    const earthRadius = 6371; // Earth radius in km
    
    // Calculate approximate end point using simple calculation
    // For demo purposes only - in production use proper routing service
    const endLat = startLat + (distanceKm / earthRadius) * (180 / Math.PI) * Math.cos(angle);
    const endLng = startLng + (distanceKm / earthRadius) * (180 / Math.PI) * Math.sin(angle) / Math.cos(startLat * Math.PI / 180);
    
    // Generate stops at equal intervals
    const numStops = 3;
    const stops = [];
    
    for (let i = 1; i <= numStops; i++) {
      const fraction = i / (numStops + 1);
      const lat = startLat + fraction * (endLat - startLat);
      const lng = startLng + fraction * (endLng - startLng);
      
      stops.push({
        name: `Stop ${i}`,
        address: `Generated Stop ${i}`,
        latitude: lat,
        longitude: lng,
        sequence: i,
        estimatedArrivalOffset: Math.round(fraction * (distanceKm * 60 / 30)) // Assuming 30km/h average speed
      });
    }
    
    // Create route object
    const route = {
      name: `Demo Route ${new Date().toISOString().slice(0, 10)}`,
      description: 'Auto-generated demo route',
      startLocation: 'Demo Start Location',
      endLocation: 'Demo End Location',
      startLatitude: startLat,
      startLongitude: startLng,
      endLatitude: endLat,
      endLongitude: endLng,
      estimatedDuration: Math.round(distanceKm * 60 / 30), // Assuming 30km/h average speed
      active: true,
      stops
    };
    
    return route;
  } catch (error) {
    console.error('Error generating route:', error);
    throw error;
  }
};