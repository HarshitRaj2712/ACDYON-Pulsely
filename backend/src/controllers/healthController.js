const mongoose = require('mongoose');

const getHealth = (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

  res.json({
    status: 'ok',
    service: 'JobPulse Backend',
    timestamp: new Date().toISOString(),
    database: states[dbState] || 'unknown'
  });
};

module.exports = { getHealth };
