'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files untuk uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'MGKONSEL API berjalan dengan baik.', version: '1.0.0' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/users', require('./routes/users'));
app.use('/api/rombels', require('./routes/rombels'));
app.use('/api/rayons', require('./routes/rayons'));
app.use('/api/students', require('./routes/students'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/counseling', require('./routes/counseling'));
app.use('/api/reports', require('./routes/reports'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Endpoint '${req.method} ${req.path}' tidak ditemukan.` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan server.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
