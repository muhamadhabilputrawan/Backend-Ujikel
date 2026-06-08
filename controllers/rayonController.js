'use strict';
const { Rayon, Student } = require('../models');

const getRayons = async (req, res) => {
  try {
    const rayons = await Rayon.findAll({ order: [['nama_rayon', 'ASC']] });
    return res.json({ success: true, data: rayons });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

const getRayonById = async (req, res) => {
  try {
    const rayon = await Rayon.findByPk(req.params.id);
    if (!rayon) return res.status(404).json({ success: false, message: 'Rayon tidak ditemukan.' });
    return res.json({ success: true, data: rayon });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

const createRayon = async (req, res) => {
  try {
    const { nama_rayon } = req.body;
    const rayon = await Rayon.create({ nama_rayon });
    return res.status(201).json({ success: true, message: 'Rayon berhasil dibuat.', data: rayon });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

const updateRayon = async (req, res) => {
  try {
    const rayon = await Rayon.findByPk(req.params.id);
    if (!rayon) return res.status(404).json({ success: false, message: 'Rayon tidak ditemukan.' });
    await rayon.update({ nama_rayon: req.body.nama_rayon });
    return res.json({ success: true, message: 'Rayon berhasil diperbarui.', data: rayon });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

const deleteRayon = async (req, res) => {
  try {
    const rayon = await Rayon.findByPk(req.params.id);
    if (!rayon) return res.status(404).json({ success: false, message: 'Rayon tidak ditemukan.' });
    const studentCount = await Student.count({ where: { rayon_id: rayon.id } });
    if (studentCount > 0) {
      return res.status(400).json({ success: false, message: `Tidak bisa menghapus rayon yang masih memiliki ${studentCount} siswa.` });
    }
    await rayon.destroy();
    return res.json({ success: true, message: 'Rayon berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

module.exports = { getRayons, getRayonById, createRayon, updateRayon, deleteRayon };
