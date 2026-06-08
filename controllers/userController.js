'use strict';
const { User } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

// GET /api/users
const getUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { username: { [Op.like]: `%${search}%` } }
      ];
    }
    if (role) where.role = role;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] }
    });

    return res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.', error: error.message });
  }
};

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// POST /api/users
const createUser = async (req, res) => {
  try {
    const { name, username, email, password, role, phone } = req.body;

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) return res.status(400).json({ success: false, message: 'Email sudah digunakan.' });

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) return res.status(400).json({ success: false, message: 'Username sudah digunakan.' });

    const user = await User.create({ name, username, email, password, role, phone });
    return res.status(201).json({
      success: true,
      message: 'User berhasil dibuat.',
      data: { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.', error: error.message });
  }
};

// PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });

    const { name, username, email, password, role, phone, is_active } = req.body;

    // Cek duplikat email/username jika diubah
    if (email && email !== user.email) {
      const exists = await User.findOne({ where: { email } });
      if (exists) return res.status(400).json({ success: false, message: 'Email sudah digunakan.' });
    }
    if (username && username !== user.username) {
      const exists = await User.findOne({ where: { username } });
      if (exists) return res.status(400).json({ success: false, message: 'Username sudah digunakan.' });
    }

    const updateData = { name, username, email, role, phone, is_active };
    if (password) updateData.password = password;

    await user.update(updateData);
    return res.json({ success: true, message: 'User berhasil diperbarui.', data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.', error: error.message });
  }
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });

    // Jangan hapus diri sendiri
    if (user.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'Tidak bisa menghapus akun sendiri.' });
    }

    await user.destroy();
    return res.json({ success: true, message: 'User berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
