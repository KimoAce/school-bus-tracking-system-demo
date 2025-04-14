//backend/src/controllers/bus.controller.js
const { Bus, User } = require('../models');

exports.getBuses = async (req, res) => {
  try {
    const buses = await Bus.findAll({
      include: [
        { model: User, as: 'driver', attributes: ['id', 'name', 'phone'] }
      ]
    });
    
    return res.status(200).json(buses);
  } catch (error) {
    console.error('Get buses error:', error);
    return res.status(500).json({ message: 'Error fetching buses' });
  }
};

exports.getBusById = async (req, res) => {
  try {
    const bus = await Bus.findByPk(req.params.id, {
      include: [
        { model: User, as: 'driver', attributes: ['id', 'name', 'phone'] }
      ]
    });
    
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    
    return res.status(200).json(bus);
  } catch (error) {
    console.error('Get bus error:', error);
    return res.status(500).json({ message: 'Error fetching bus' });
  }
};

exports.createBus = async (req, res) => {
  try {
    const { plateNumber, capacity, model, year, driverId } = req.body;
    
    // Validate required fields
    if (!plateNumber || !capacity) {
      return res.status(400).json({ message: 'Plate number and capacity are required' });
    }
    
    // Check if driver exists
    if (driverId) {
      const driver = await User.findOne({
        where: {
          id: driverId,
          role: 'driver'
        }
      });
      
      if (!driver) {
        return res.status(404).json({ message: 'Driver not found' });
      }
    }
    
    // Create bus
    const bus = await Bus.create({
      plateNumber,
      capacity,
      model,
      year,
      driverId,
      status: 'active'
    });
    
    return res.status(201).json(bus);
  } catch (error) {
    console.error('Create bus error:', error);
    return res.status(500).json({ message: 'Error creating bus' });
  }
};

exports.updateBus = async (req, res) => {
  try {
    const { plateNumber, capacity, model, year, status, driverId } = req.body;
    
    const bus = await Bus.findByPk(req.params.id);
    
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    
    // Check if driver exists
    if (driverId) {
      const driver = await User.findOne({
        where: {
          id: driverId,
          role: 'driver'
        }
      });
      
      if (!driver) {
        return res.status(404).json({ message: 'Driver not found' });
      }
    }
    
    // Update bus
    await bus.update({
      plateNumber: plateNumber || bus.plateNumber,
      capacity: capacity || bus.capacity,
      model: model || bus.model,
      year: year || bus.year,
      status: status || bus.status,
      driverId: driverId !== undefined ? driverId : bus.driverId
    });
    
    return res.status(200).json(bus);
  } catch (error) {
    console.error('Update bus error:', error);
    return res.status(500).json({ message: 'Error updating bus' });
  }
};