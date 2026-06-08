'use strict';
const { Rombel, Student } = require('../models');
const { Op } = require('sequelize');

const getRombels = async (req, res) => {
  try {
    const { search } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { nama_rombel: { [Op.like]: `%${search}%` } },
        { jurusan: { [Op.like]: `%${search}%` } }
      ];
    }
    const rombels = await Rombel.findAll({ where, order: [['tingkat', 'ASC'], ['nama_rombel', 'ASC']] });
    return res.json({ success: true, data: rombels });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

const getRombelById = async (req, res) => {
  try {
    const rombel = await Rombel.findByPk(req.params.id, {
      include: [{ model: Student, as: 'students' }]
    });
    if (!rombel) return res.status(404).json({ success: false, message: 'Rombel tidak ditemukan.' });
    return res.json({ success: true, data: rombel });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

const createRombel = async (req, res) => {
  try {
    const { nama_rombel, jurusan, tingkat } = req.body;
    const rombel = await Rombel.create({ nama_rombel, jurusan, tingkat });
    return res.status(201).json({ success: true, message: 'Rombel berhasil dibuat.', data: rombel });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

const updateRombel = async (req, res) => {
  try {
    const rombel = await Rombel.findByPk(req.params.id);
    if (!rombel) return res.status(404).json({ success: false, message: 'Rombel tidak ditemukan.' });
    const { nama_rombel, jurusan, tingkat } = req.body;
    await rombel.update({ nama_rombel, jurusan, tingkat });
    return res.json({ success: true, message: 'Rombel berhasil diperbarui.', data: rombel });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

const deleteRombel = async (req, res) => {
  try {
    const rombel = await Rombel.findByPk(req.params.id);
    if (!rombel) return res.status(404).json({ success: false, message: 'Rombel tidak ditemukan.' });
    const studentCount = await Student.count({ where: { rombel_id: rombel.id } });
    if (studentCount > 0) {
      return res.status(400).json({ success: false, message: `Tidak bisa menghapus rombel yang masih memiliki ${studentCount} siswa.` });
    }
    await rombel.destroy();
    return res.json({ success: true, message: 'Rombel berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

module.exports = { getRombels, getRombelById, createRombel, updateRombel, deleteRombel };
