'use strict';
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Verifikasi JWT Token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Token tidak ditemukan. Silahkan login.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User tidak ditemukan.' });
    }

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Akun Anda tidak aktif. Hubungi admin.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token sudah kadaluarsa. Silahkan login kembali.' });
    }
    return res.status(401).json({ success: false, message: 'Token tidak valid.' });
  }
};

module.exports = { authenticate };
