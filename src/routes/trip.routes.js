//backend/src/routes/trip.routes.js
const express = require('express');
const tripController = require('../controllers/trip.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Create a new trip
router.post('/', authMiddleware, tripController.createTrip);

// Start a trip
router.post('/:id/start', authMiddleware, roleMiddleware(['driver']), tripController.startTrip);

// End a trip
router.post('/:id/end', authMiddleware, roleMiddleware(['driver']), tripController.endTrip);

// Update trip location
router.post('/location', authMiddleware, roleMiddleware(['driver']), tripController.updateTripLocation);

// Get driver's active trip
router.get('/active', authMiddleware, roleMiddleware(['driver']), tripController.getActiveTrip);

// Get driver's trips
router.get('/driver', authMiddleware, roleMiddleware(['driver']), tripController.getDriverTrips);

// Get trip by ID
router.get('/:id', authMiddleware, tripController.getTripById);

module.exports = router;