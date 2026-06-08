'use strict';
const { User, Student, CounselingRequest, CounselingSchedule, Rayon, Rombel, sequelize } = require('../models');
const { Op } = require('sequelize');

const getDashboard = async (req, res) => {
  try {
    const role = req.user.role;
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Data umum
    const totalStudents = await Student.count();
    const totalBK = await User.count({ where: { role: 'guru_bk', is_active: true } });
    const totalRayon = await User.count({ where: { role: 'pembimbing_rayon', is_active: true } });

    if (role === 'admin') {
      const totalCounseling = await CounselingRequest.count();
      const totalPengajuan = await CounselingRequest.count({ where: { status: 'menunggu' } });
      const statusCounts = await CounselingRequest.findAll({
        attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'count']],
        group: ['status'],
        raw: true
      });

      const monthlyCount = await CounselingRequest.count({
        where: { createdAt: { [Op.gte]: startOfMonth } }
      });

      return res.json({
        success: true,
        data: {
          total_siswa: totalStudents,
          total_konseling: totalCounseling,
          total_guru_bk: totalBK,
          total_pembimbing_rayon: totalRayon,
          total_menunggu: totalPengajuan,
          konseling_bulan_ini: monthlyCount,
          status_summary: statusCounts
        }
      });
    }

    if (role === 'guru_bk') {
      const myRequests = await CounselingRequest.count({ where: { bk_user_id: req.user.id } });
      const myPending = await CounselingRequest.count({ where: { bk_user_id: null, status: 'menunggu' } });
      const mySchedules = await CounselingSchedule.count({
        where: {
          bk_user_id: req.user.id,
          schedule_date: { [Op.gte]: today }
        }
      });
      const myCompleted = await CounselingRequest.count({
        where: { bk_user_id: req.user.id, status: 'selesai' }
      });
      const myMonthly = await CounselingRequest.count({
        where: { bk_user_id: req.user.id, createdAt: { [Op.gte]: startOfMonth } }
      });

      return res.json({
        success: true,
        data: {
          total_siswa: totalStudents,
          pengajuan_ditangani: myRequests,
          pengajuan_menunggu: myPending,
          jadwal_mendatang: mySchedules,
          konseling_selesai: myCompleted,
          konseling_bulan_ini: myMonthly
        }
      });
    }

    if (role === 'pembimbing_rayon') {
      const mySubmissions = await CounselingRequest.count({ where: { submitter_user_id: req.user.id } });
      const myPending = await CounselingRequest.count({ where: { submitter_user_id: req.user.id, status: 'menunggu' } });
      const myAccepted = await CounselingRequest.count({ where: { submitter_user_id: req.user.id, status: { [Op.in]: ['diterima', 'dijadwalkan', 'diproses'] } } });
      const myCompleted = await CounselingRequest.count({ where: { submitter_user_id: req.user.id, status: 'selesai' } });

      return res.json({
        success: true,
        data: {
          total_siswa: totalStudents,
          total_pengajuan: mySubmissions,
          pengajuan_menunggu: myPending,
          pengajuan_diproses: myAccepted,
          pengajuan_selesai: myCompleted
        }
      });
    }

    return res.json({ success: true, data: {} });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.', error: error.message });
  }
};

module.exports = { getDashboard };
