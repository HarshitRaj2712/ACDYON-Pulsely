const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

const jobRoutes = require('./routes/jobRoutes');
const ingestionRoutes = require('./routes/ingestionRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(
  cors({
    origin: [env.CLIENT_ORIGIN, 'http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json());

// API Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/ingestion', ingestionRoutes);
app.use('/api/health', healthRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Cannot ${req.method} ${req.url}`
    }
  });
});

// Central Error Handler
app.use(errorHandler);

module.exports = app;
