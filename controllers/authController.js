'use strict';
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, message: 'Validasi gagal', errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    }

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Akun Anda tidak aktif.' });
    }

    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.json({
      success: true,
      message: 'Login berhasil.',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          phone: user.phone,
          is_active: user.is_active
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.', error: error.message });
  }
};

// GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    return res.json({
      success: true,
      data: {
        id: req.user.id,
        name: req.user.name,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone,
        is_active: req.user.is_active,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    await req.user.update({ name, phone });
    return res.json({
      success: true,
      message: 'Profil berhasil diperbarui.',
      data: {
        id: req.user.id,
        name: req.user.name,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// PUT /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;

    const isMatch = await req.user.checkPassword(old_password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Password lama tidak sesuai.' });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password baru minimal 6 karakter.' });
    }

    await req.user.update({ password: new_password });

    return res.json({ success: true, message: 'Password berhasil diubah.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

module.exports = { login, getProfile, updateProfile, changePassword };
