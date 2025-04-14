//backend/src/routes/bus.routes.js
const express = require('express');
const busController = require('../controllers/bus.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all buses
router.get('/', authMiddleware, busController.getBuses);

// Get bus by ID
router.get('/:id', authMiddleware, busController.getBusById);

// Create a new bus
router.post('/', authMiddleware, roleMiddleware(['admin']), busController.createBus);

// Update a bus
router.put('/:id', authMiddleware, roleMiddleware(['admin']), busController.updateBus);

module.exports = router;