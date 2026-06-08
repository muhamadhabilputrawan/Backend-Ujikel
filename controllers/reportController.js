'use strict';
const { CounselingRequest, Student, User, ProblemCategory, Rombel, Rayon, sequelize } = require('../models');
const { Op } = require('sequelize');

// GET /api/reports/monthly?year=&month=
const getMonthlyReport = async (req, res) => {
  try {
    const year  = parseInt(req.query.year)  || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const startDate = new Date(year, month - 1, 1);
    const endDate   = new Date(year, month, 0, 23, 59, 59);

    const requests = await CounselingRequest.findAll({
      where: { createdAt: { [Op.between]: [startDate, endDate] } },
      include: [
        { model: Student, as: 'student', include: [{ model: Rombel, as: 'rombel' }, { model: Rayon, as: 'rayon' }] },
        { model: ProblemCategory, as: 'category' },
        { model: User, as: 'bkUser', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'ASC']]
    });

    const statusCounts = {}, categoryCounts = {};
    requests.forEach(r => {
      statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
      if (r.category) categoryCounts[r.category.nama_kategori] = (categoryCounts[r.category.nama_kategori] || 0) + 1;
    });

    return res.json({ success: true, data: { period: `${year}-${String(month).padStart(2,'0')}`, total: requests.length, status_summary: statusCounts, category_summary: categoryCounts, requests } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.', error: error.message });
  }
};

// GET /api/reports/annual?year=
const getAnnualReport = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const startDate = new Date(year, 0, 1);
    const endDate   = new Date(year, 11, 31, 23, 59, 59);

    const monthlyData = [];
    for (let m = 1; m <= 12; m++) {
      const mStart = new Date(year, m - 1, 1);
      const mEnd   = new Date(year, m, 0, 23, 59, 59);
      const count  = await CounselingRequest.count({ where: { createdAt: { [Op.between]: [mStart, mEnd] } } });
      monthlyData.push({ month: m, count });
    }

    const totalYear    = await CounselingRequest.count({ where: { createdAt: { [Op.between]: [startDate, endDate] } } });
    const statusCounts = await CounselingRequest.findAll({ where: { createdAt: { [Op.between]: [startDate, endDate] } }, attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'count']], group: ['status'], raw: true });
    const categoryCounts = await CounselingRequest.findAll({ where: { createdAt: { [Op.between]: [startDate, endDate] } }, include: [{ model: ProblemCategory, as: 'category', attributes: ['nama_kategori'] }], attributes: ['category_id', [sequelize.fn('COUNT', sequelize.col('CounselingRequest.id')), 'count']], group: ['category_id', 'category.id', 'category.nama_kategori'], raw: true, nest: true });

    return res.json({ success: true, data: { year, total: totalYear, monthly_data: monthlyData, status_summary: statusCounts, category_summary: categoryCounts } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.', error: error.message });
  }
};

// GET /api/reports/by-student/:student_id
const getStudentReport = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.student_id, {
      include: [{ model: Rombel, as: 'rombel' }, { model: Rayon, as: 'rayon' }]
    });
    if (!student) return res.status(404).json({ success: false, message: 'Siswa tidak ditemukan.' });

    const requests = await CounselingRequest.findAll({
      where: { student_id: req.params.student_id },
      include: [
        { model: ProblemCategory, as: 'category' },
        { model: User, as: 'bkUser', attributes: ['id', 'name'] },
        { model: User, as: 'submitter', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.json({ success: true, data: { student, total_konseling: requests.length, requests } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// GET /api/reports/by-rombel/:rombel_id
const getRombelReport = async (req, res) => {
  try {
    const rombel = await Rombel.findByPk(req.params.rombel_id);
    if (!rombel) return res.status(404).json({ success: false, message: 'Rombel tidak ditemukan.' });

    const students   = await Student.findAll({ where: { rombel_id: req.params.rombel_id } });
    const studentIds = students.map(s => s.id);

    if (studentIds.length === 0) {
      return res.json({ success: true, data: { rombel, total_siswa: 0, total_konseling: 0, siswa_pernah_konseling: 0, category_summary: {}, status_summary: {}, students, requests: [] } });
    }

    const requests = await CounselingRequest.findAll({
      where: { student_id: { [Op.in]: studentIds } },
      include: [
        { model: Student, as: 'student' },
        { model: ProblemCategory, as: 'category' },
        { model: User, as: 'bkUser', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    const categoryCounts = {}, statusCounts = {};
    const siswaSet = new Set();
    requests.forEach(r => {
      if (r.category) categoryCounts[r.category.nama_kategori] = (categoryCounts[r.category.nama_kategori] || 0) + 1;
      statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
      siswaSet.add(r.student_id);
    });

    return res.json({
      success: true,
      data: {
        rombel,
        total_siswa:          students.length,
        total_konseling:      requests.length,
        siswa_pernah_konseling: siswaSet.size,
        category_summary:     categoryCounts,
        status_summary:       statusCounts,
        students,
        requests
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// GET /api/reports/by-rayon/:rayon_id  ← BARU
const getRayonReport = async (req, res) => {
  try {
    const rayon = await Rayon.findByPk(req.params.rayon_id);
    if (!rayon) return res.status(404).json({ success: false, message: 'Rayon tidak ditemukan.' });

    const students   = await Student.findAll({
      where: { rayon_id: req.params.rayon_id },
      include: [{ model: Rombel, as: 'rombel', attributes: ['id', 'nama_rombel', 'jurusan', 'tingkat'] }]
    });
    const studentIds = students.map(s => s.id);

    if (studentIds.length === 0) {
      return res.json({ success: true, data: { rayon, total_siswa: 0, total_konseling: 0, siswa_pernah_konseling: 0, category_summary: {}, status_summary: {}, students, requests: [] } });
    }

    const requests = await CounselingRequest.findAll({
      where: { student_id: { [Op.in]: studentIds } },
      include: [
        { model: Student, as: 'student', include: [{ model: Rombel, as: 'rombel' }] },
        { model: ProblemCategory, as: 'category' },
        { model: User, as: 'bkUser', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    const categoryCounts = {}, statusCounts = {};
    const siswaSet = new Set();
    requests.forEach(r => {
      if (r.category) categoryCounts[r.category.nama_kategori] = (categoryCounts[r.category.nama_kategori] || 0) + 1;
      statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
      siswaSet.add(r.student_id);
    });

    return res.json({
      success: true,
      data: {
        rayon,
        total_siswa:            students.length,
        total_konseling:        requests.length,
        siswa_pernah_konseling: siswaSet.size,
        category_summary:       categoryCounts,
        status_summary:         statusCounts,
        students,
        requests
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

module.exports = { getMonthlyReport, getAnnualReport, getStudentReport, getRombelReport, getRayonReport };
