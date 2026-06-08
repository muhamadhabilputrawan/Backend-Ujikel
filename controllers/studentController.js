'use strict';
const { Student, Rombel, Rayon, CounselingRequest } = require('../models');
const { Op } = require('sequelize');

const getStudents = async (req, res) => {
  try {
    const { search, rombel_id, rayon_id, page = 1, limit = 10 } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { nama: { [Op.like]: `%${search}%` } },
        { nis: { [Op.like]: `%${search}%` } }
      ];
    }
    if (rombel_id) where.rombel_id = rombel_id;
    if (rayon_id) where.rayon_id = rayon_id;

    // Pembimbing rayon hanya lihat siswa di rayon mereka (opsional, disesuaikan)
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Student.findAndCountAll({
      where,
      include: [
        { model: Rombel, as: 'rombel', attributes: ['id', 'nama_rombel', 'jurusan', 'tingkat'] },
        { model: Rayon, as: 'rayon', attributes: ['id', 'nama_rayon'] }
      ],
      limit: parseInt(limit),
      offset,
      order: [['nama', 'ASC']]
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

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [
        { model: Rombel, as: 'rombel' },
        { model: Rayon, as: 'rayon' }
      ]
    });
    if (!student) return res.status(404).json({ success: false, message: 'Siswa tidak ditemukan.' });
    return res.json({ success: true, data: student });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

const createStudent = async (req, res) => {
  try {
    const { nis, nama, gender, alamat, telepon, rombel_id, rayon_id } = req.body;

    const existing = await Student.findOne({ where: { nis } });
    if (existing) return res.status(400).json({ success: false, message: 'NIS sudah terdaftar.' });

    const student = await Student.create({ nis, nama, gender, alamat, telepon, rombel_id, rayon_id });
    return res.status(201).json({ success: true, message: 'Siswa berhasil ditambahkan.', data: student });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.', error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Siswa tidak ditemukan.' });

    const { nis, nama, gender, alamat, telepon, rombel_id, rayon_id } = req.body;

    if (nis && nis !== student.nis) {
      const existing = await Student.findOne({ where: { nis } });
      if (existing) return res.status(400).json({ success: false, message: 'NIS sudah digunakan.' });
    }

    await student.update({ nis, nama, gender, alamat, telepon, rombel_id, rayon_id });
    return res.json({ success: true, message: 'Data siswa berhasil diperbarui.', data: student });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Siswa tidak ditemukan.' });
    await student.destroy();
    return res.json({ success: true, message: 'Data siswa berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// GET /api/students/:id/history — riwayat konseling siswa
const getStudentHistory = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Siswa tidak ditemukan.' });

    const requests = await CounselingRequest.findAll({
      where: { student_id: req.params.id },
      include: [
        { model: require('../models').ProblemCategory, as: 'category' },
        { model: require('../models').User, as: 'submitter', attributes: ['id', 'name', 'role'] },
        { model: require('../models').User, as: 'bkUser', attributes: ['id', 'name'] },
        { model: require('../models').CounselingSchedule, as: 'schedule',
          include: [{ model: require('../models').CounselingResult, as: 'result' }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.json({ success: true, data: { student, requests } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.', error: error.message });
  }
};

module.exports = { getStudents, getStudentById, createStudent, updateStudent, deleteStudent, getStudentHistory };
