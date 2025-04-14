//backend/src/controllers/stop.controller.js
const { Stop, Route } = require('../models');

exports.getStops = async (req, res) => {
  try {
    const stops = await Stop.findAll({
      include: [{ model: Route }]
    });
    
    return res.status(200).json(stops);
  } catch (error) {
    console.error('Get stops error:', error);
    return res.status(500).json({ message: 'Error fetching stops' });
  }
};

exports.getStopsByRoute = async (req, res) => {
  try {
    const stops = await Stop.findAll({
      where: {
        routeId: req.params.routeId
      },
      order: [['sequence', 'ASC']]
    });
    
    return res.status(200).json(stops);
  } catch (error) {
    console.error('Get stops by route error:', error);
    return res.status(500).json({ message: 'Error fetching stops' });
  }
};

exports.getStop = async (req, res) => {
  try {
    const stop = await Stop.findByPk(req.params.id, {
      include: [{ model: Route }]
    });
    
    if (!stop) {
      return res.status(404).json({ message: 'Stop not found' });
    }
    
    return res.status(200).json(stop);
  } catch (error) {
    console.error('Get stop error:', error);
    return res.status(500).json({ message: 'Error fetching stop' });
  }
};