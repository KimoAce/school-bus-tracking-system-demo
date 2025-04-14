//backend/src/controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    // Find user by phone
    const user = await User.findOne({ where: { phone } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Validate password
    const isPasswordValid = await user.isValidPassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    
    // Update last login
    user.last_login = new Date();
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    return res.status(200).json({
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateDeviceToken = async (req, res) => {
  try {
    const { device_token } = req.body;
    
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.device_token = device_token;
    await user.save();
    
    return res.status(200).json({ message: 'Device token updated successfully' });
  } catch (error) {
    console.error('Update device token error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};