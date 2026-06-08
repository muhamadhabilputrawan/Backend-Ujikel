'use strict';
const { Room } = require('../models');

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({ order: [['room_name', 'ASC']] });
    return res.json({ success: true, data: rooms });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

const createRoom = async (req, res) => {
  try {
    const { room_name, location } = req.body;
    const room = await Room.create({ room_name, location });
    return res.status(201).json({ success: true, message: 'Ruangan berhasil dibuat.', data: room });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Ruangan tidak ditemukan.' });
    await room.update({ room_name: req.body.room_name, location: req.body.location });
    return res.json({ success: true, message: 'Ruangan berhasil diperbarui.', data: room });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Ruangan tidak ditemukan.' });
    await room.destroy();
    return res.json({ success: true, message: 'Ruangan berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

module.exports = { getRooms, createRoom, updateRoom, deleteRoom };
