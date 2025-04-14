//backend/src/routes/stop.routes.js
const express = require('express');
const stopController = require('../controllers/stop.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all stops
router.get('/', authMiddleware, stopController.getStops);

// Get stops by route
router.get('/route/:routeId', authMiddleware, stopController.getStopsByRoute);

// Get stop by ID
router.get('/:id', authMiddleware, stopController.getStop);

module.exports = router;