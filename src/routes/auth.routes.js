//backend/src/routes/auth.routes.js
const express = require('express');
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/login', authController.login);
router.put('/device-token', authMiddleware, authController.updateDeviceToken);

module.exports = router;