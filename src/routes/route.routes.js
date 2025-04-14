//backend/src/routes/route.routes.js
const express = require('express');
const routeController = require('../controllers/route.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Generate a new route
router.post('/generate', authMiddleware, routeController.generateRoute);

// Get all routes
router.get('/', authMiddleware, routeController.getRoutes);

// Get a specific route
router.get('/:id', authMiddleware, routeController.getRoute);

module.exports = router;