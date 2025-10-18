const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const dsaRoutes = require('./api/dsa');
const gateRoutes = require('./api/gate');
const userRoutes = require('./api/user');

// Use routes
app.use('/api/dsa', dsaRoutes);
app.use('/api/gate', gateRoutes);
app.use('/api/user', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to PrepVerse API',
    version: '1.0.0',
    endpoints: {
      dsa: '/api/dsa',
      gate: '/api/gate',
      user: '/api/user'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`PrepVerse API server running on port ${PORT}`);
});
