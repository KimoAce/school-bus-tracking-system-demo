//backend/src/routes/alert.routes.js
const express = require('express');
const alertController = require('../controllers/alert.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Create a new alert
router.post('/', authMiddleware, alertController.createAlert);

// Acknowledge an alert
router.put('/:id/acknowledge', authMiddleware, alertController.acknowledgeAlert);

// Resolve an alert
router.put('/:id/resolve', authMiddleware, alertController.resolveAlert);

// Get all alerts
router.get('/', authMiddleware, alertController.getAlerts);

// Get alerts for a specific trip
router.get('/trip/:tripId', authMiddleware, alertController.getTripAlerts);

module.exports = router;