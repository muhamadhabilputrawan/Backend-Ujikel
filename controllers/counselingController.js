'use strict';
const {
  CounselingRequest, CounselingSchedule, CounselingResult,
  CounselingStatusHistory, Student, User, ProblemCategory, Room, Rombel, Rayon
} = require('../models');
const { Op } = require('sequelize');

// Helper: simpan riwayat status
const saveStatusHistory = async (request_id, old_status, new_status, notes, changed_by) => {
  await CounselingStatusHistory.create({
    request_id, old_status, new_status, notes,
    changed_by, changed_at: new Date()
  });
};

// Include config untuk request
const requestInclude = [
  {
    model: Student, as: 'student',
    include: [
      { model: Rombel, as: 'rombel', attributes: ['id', 'nama_rombel', 'jurusan', 'tingkat'] },
      { model: Rayon, as: 'rayon', attributes: ['id', 'nama_rayon'] }
    ]
  },
  { model: ProblemCategory, as: 'category' },
  { model: User, as: 'submitter', attributes: ['id', 'name', 'username', 'role'] },
  { model: User, as: 'bkUser', attributes: ['id', 'name', 'username'] },
  {
    model: CounselingSchedule, as: 'schedule',
    include: [
      { model: Room, as: 'room' },
      { model: CounselingResult, as: 'result' }
    ]
  }
];

// GET /api/counseling/requests
const getRequests = async (req, res) => {
  try {
    const { status, rayon_id, rombel_id, search, page = 1, limit = 10 } = req.query;
    const where = {};

    if (status) where.status = status;

    // Filter role
    if (req.user.role === 'guru_bk') {
      where[Op.or] = [
        { bk_user_id: req.user.id },
        { bk_user_id: null, status: 'menunggu' }
      ];
    } else if (req.user.role === 'pembimbing_rayon') {
      where.submitter_user_id = req.user.id;
    }

    const studentWhere = {};
    if (rayon_id) studentWhere.rayon_id = rayon_id;
    if (rombel_id) studentWhere.rombel_id = rombel_id;
    if (search) studentWhere.nama = { [Op.like]: `%${search}%` };

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build include dengan filter student jika ada
    const studentInclude = {
      model: Student, as: 'student',
      required: Object.keys(studentWhere).length > 0, // INNER JOIN jika ada filter
      where: Object.keys(studentWhere).length > 0 ? studentWhere : undefined,
      include: [
        { model: Rombel, as: 'rombel', attributes: ['id', 'nama_rombel', 'jurusan', 'tingkat'] },
        { model: Rayon, as: 'rayon', attributes: ['id', 'nama_rayon'] }
      ]
    };

    const includeWithFilter = [
      studentInclude,
      { model: ProblemCategory, as: 'category' },
      { model: User, as: 'submitter', attributes: ['id', 'name', 'username', 'role'] },
      { model: User, as: 'bkUser', attributes: ['id', 'name', 'username'] },
      {
        model: CounselingSchedule, as: 'schedule',
        include: [
          { model: Room, as: 'room' },
          { model: CounselingResult, as: 'result' }
        ]
      }
    ];

    const { count, rows } = await CounselingRequest.findAndCountAll({
      where,
      include: includeWithFilter,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
      distinct: true
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

// GET /api/counseling/requests/:id
const getRequestById = async (req, res) => {
  try {
    const request = await CounselingRequest.findByPk(req.params.id, {
      include: [
        ...requestInclude,
        { model: CounselingStatusHistory, as: 'statusHistories',
          include: [{ model: User, as: 'changedBy', attributes: ['id', 'name'] }],
          order: [['changed_at', 'DESC']]
        }
      ]
    });
    if (!request) return res.status(404).json({ success: false, message: 'Pengajuan tidak ditemukan.' });
    return res.json({ success: true, data: request });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.', error: error.message });
  }
};

// POST /api/counseling/requests — Pembimbing Rayon buat pengajuan
const createRequest = async (req, res) => {
  try {
    const { student_id, category_id, keluhan, tanggal_pengajuan } = req.body;

    const student = await Student.findByPk(student_id);
    if (!student) return res.status(404).json({ success: false, message: 'Siswa tidak ditemukan.' });

    const request = await CounselingRequest.create({
      student_id,
      category_id,
      submitter_user_id: req.user.id,
      keluhan,
      tanggal_pengajuan: tanggal_pengajuan || new Date(),
      status: 'menunggu'
    });

    await saveStatusHistory(request.id, null, 'menunggu', 'Pengajuan baru dibuat', req.user.id);

    return res.status(201).json({ success: true, message: 'Pengajuan konseling berhasil dibuat.', data: request });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.', error: error.message });
  }
};

// PUT /api/counseling/requests/:id/accept — Guru BK terima pengajuan
const acceptRequest = async (req, res) => {
  try {
    const request = await CounselingRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Pengajuan tidak ditemukan.' });
    if (request.status !== 'menunggu') {
      return res.status(400).json({ success: false, message: `Pengajuan dengan status '${request.status}' tidak dapat diterima.` });
    }

    const old_status = request.status;
    await request.update({ status: 'diterima', bk_user_id: req.user.id });
    await saveStatusHistory(request.id, old_status, 'diterima', req.body.notes || 'Pengajuan diterima', req.user.id);

    return res.json({ success: true, message: 'Pengajuan berhasil diterima.', data: request });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// PUT /api/counseling/requests/:id/reject — Guru BK tolak pengajuan
const rejectRequest = async (req, res) => {
  try {
    const request = await CounselingRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Pengajuan tidak ditemukan.' });

    const old_status = request.status;
    await request.update({ status: 'ditolak', bk_user_id: req.user.id });
    await saveStatusHistory(request.id, old_status, 'ditolak', req.body.notes || 'Pengajuan ditolak', req.user.id);

    return res.json({ success: true, message: 'Pengajuan berhasil ditolak.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// PUT /api/counseling/requests/:id/reschedule
const rescheduleRequest = async (req, res) => {
  try {
    const { reschedule_reason } = req.body;
    const request = await CounselingRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Pengajuan tidak ditemukan.' });

    const old_status = request.status;
    await request.update({ status: 'reschedule', reschedule_reason });
    await saveStatusHistory(request.id, old_status, 'reschedule', reschedule_reason, req.user.id);

    return res.json({ success: true, message: 'Jadwal berhasil direschedule.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// POST /api/counseling/schedules — Guru BK buat jadwal
const createSchedule = async (req, res) => {
  try {
    const { request_id, room_id, schedule_date, start_time, end_time, note } = req.body;

    const request = await CounselingRequest.findByPk(request_id);
    if (!request) return res.status(404).json({ success: false, message: 'Pengajuan tidak ditemukan.' });

    // Cek apakah sudah ada jadwal
    const existingSchedule = await CounselingSchedule.findOne({ where: { request_id } });
    if (existingSchedule) {
      // Update jadwal yang ada
      await existingSchedule.update({ room_id, schedule_date, start_time, end_time, note, bk_user_id: req.user.id });
      const old_status = request.status;
      await request.update({ status: 'dijadwalkan' });
      await saveStatusHistory(request_id, old_status, 'dijadwalkan', 'Jadwal konseling diperbarui', req.user.id);
      return res.json({ success: true, message: 'Jadwal berhasil diperbarui.', data: existingSchedule });
    }

    const schedule = await CounselingSchedule.create({
      request_id, bk_user_id: req.user.id, room_id, schedule_date, start_time, end_time, note
    });

    const old_status = request.status;
    await request.update({ status: 'dijadwalkan' });
    await saveStatusHistory(request_id, old_status, 'dijadwalkan', 'Jadwal konseling dibuat', req.user.id);

    return res.status(201).json({ success: true, message: 'Jadwal konseling berhasil dibuat.', data: schedule });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.', error: error.message });
  }
};

// GET /api/counseling/schedules
const getSchedules = async (req, res) => {
  try {
    const where = {};
    if (req.user.role === 'guru_bk') where.bk_user_id = req.user.id;

    const schedules = await CounselingSchedule.findAll({
      where,
      include: [
        {
          model: CounselingRequest, as: 'request',
          include: [
            { model: Student, as: 'student' },
            { model: ProblemCategory, as: 'category' }
          ]
        },
        { model: Room, as: 'room' },
        { model: CounselingResult, as: 'result' }
      ],
      order: [['schedule_date', 'ASC'], ['start_time', 'ASC']]
    });

    return res.json({ success: true, data: schedules });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.', error: error.message });
  }
};

// POST /api/counseling/results — Guru BK input hasil konseling
const createResult = async (req, res) => {
  try {
    const { schedule_id, problem_summary, solution, follow_up, teacher_notes } = req.body;

    const schedule = await CounselingSchedule.findByPk(schedule_id);
    if (!schedule) return res.status(404).json({ success: false, message: 'Jadwal tidak ditemukan.' });

    const existing = await CounselingResult.findOne({ where: { schedule_id } });
    if (existing) {
      await existing.update({ problem_summary, solution, follow_up, teacher_notes });
      // Update status ke selesai
      const request = await CounselingRequest.findByPk(schedule.request_id);
      if (request && request.status !== 'selesai') {
        const old_status = request.status;
        await request.update({ status: 'selesai' });
        await saveStatusHistory(schedule.request_id, old_status, 'selesai', 'Hasil konseling diinput', req.user.id);
      }
      return res.json({ success: true, message: 'Hasil konseling berhasil diperbarui.', data: existing });
    }

    const result = await CounselingResult.create({ schedule_id, problem_summary, solution, follow_up, teacher_notes });

    // Update status request ke selesai
    const request = await CounselingRequest.findByPk(schedule.request_id);
    if (request) {
      const old_status = request.status;
      await request.update({ status: 'selesai' });
      await saveStatusHistory(schedule.request_id, old_status, 'selesai', 'Hasil konseling diinput', req.user.id);
    }

    return res.status(201).json({ success: true, message: 'Hasil konseling berhasil disimpan.', data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.', error: error.message });
  }
};

// PUT /api/counseling/requests/:id/process — Set ke diproses
const processRequest = async (req, res) => {
  try {
    const request = await CounselingRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Pengajuan tidak ditemukan.' });

    const old_status = request.status;
    await request.update({ status: 'diproses' });
    await saveStatusHistory(request.id, old_status, 'diproses', 'Konseling sedang diproses', req.user.id);

    return res.json({ success: true, message: 'Status diperbarui ke diproses.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// GET /api/counseling/results/:schedule_id
const getResult = async (req, res) => {
  try {
    const result = await CounselingResult.findOne({
      where: { schedule_id: req.params.schedule_id },
      include: [{
        model: CounselingSchedule, as: 'schedule',
        include: [{
          model: CounselingRequest, as: 'request',
          include: [
            { model: Student, as: 'student' },
            { model: ProblemCategory, as: 'category' }
          ]
        }]
      }]
    });
    if (!result) return res.status(404).json({ success: false, message: 'Hasil konseling tidak ditemukan.' });
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

module.exports = {
  getRequests, getRequestById, createRequest,
  acceptRequest, rejectRequest, rescheduleRequest,
  createSchedule, getSchedules,
  createResult, processRequest, getResult
};
