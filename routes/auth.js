'use strict';
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { login, getProfile, updateProfile, changePassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/login', [
  body('email').isEmail().withMessage('Email tidak valid.'),
  body('password').notEmpty().withMessage('Password wajib diisi.')
], login);

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);

module.exports = router;
