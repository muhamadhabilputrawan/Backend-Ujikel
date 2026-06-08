'use strict';

// Middleware pengecekan role
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Tidak terautentikasi.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak. Role '${req.user.role}' tidak memiliki izin untuk aksi ini.`
      });
    }
    next();
  };
};

// Shorthand roles
const isAdmin = checkRole('admin');
const isGurubk = checkRole('guru_bk');
const isRayon = checkRole('pembimbing_rayon');
const isAdminOrBk = checkRole('admin', 'guru_bk');
const isAdminOrRayon = checkRole('admin', 'pembimbing_rayon');
const isAll = checkRole('admin', 'guru_bk', 'pembimbing_rayon');

module.exports = { checkRole, isAdmin, isGurubk, isRayon, isAdminOrBk, isAdminOrRayon, isAll };
