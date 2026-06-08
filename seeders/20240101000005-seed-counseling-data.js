'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const today = new Date();
    const lastMonth    = new Date(today.getFullYear(), today.getMonth() - 1, 15);
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 10);

    // Ambil ID yang ada di database (dynamic)
    const [users]    = await queryInterface.sequelize.query('SELECT id, role FROM users ORDER BY id ASC');
    const [students] = await queryInterface.sequelize.query('SELECT id FROM students ORDER BY id ASC LIMIT 10');
    const [cats]     = await queryInterface.sequelize.query('SELECT id FROM problem_categories ORDER BY id ASC LIMIT 8');
    const [rooms]    = await queryInterface.sequelize.query('SELECT id FROM rooms ORDER BY id ASC LIMIT 4');

    if (!students.length || !cats.length || !rooms.length || !users.length) {
      console.log('SKIP: data pendukung belum ada, skip seed counseling data');
      return;
    }

    const adminUser  = users.find(u => u.role === 'admin')             || users[0];
    const bkUser     = users.find(u => u.role === 'guru_bk')           || users[0];
    const bkUser2    = users.filter(u => u.role === 'guru_bk')[1]      || bkUser;
    const rayonUser  = users.find(u => u.role === 'pembimbing_rayon')  || users[0];
    const rayonUser2 = users.filter(u => u.role === 'pembimbing_rayon')[1] || rayonUser;

    const s = (i) => students[Math.min(i, students.length - 1)].id;
    const c = (i) => cats[Math.min(i, cats.length - 1)].id;
    const room = (i) => rooms[Math.min(i, rooms.length - 1)].id;

    // Seed counseling_requests
    await queryInterface.bulkInsert('counseling_requests', [
      {
        student_id: s(0), category_id: c(0),
        submitter_user_id: rayonUser.id, bk_user_id: bkUser.id,
        keluhan: 'Siswa mengalami kesulitan dalam mengikuti pelajaran matematika dan sering tidak mengerjakan PR.',
        status: 'selesai', tanggal_pengajuan: twoMonthsAgo,
        reschedule_reason: null, createdAt: twoMonthsAgo, updatedAt: twoMonthsAgo,
      },
      {
        student_id: s(1), category_id: c(2),
        submitter_user_id: rayonUser.id, bk_user_id: bkUser.id,
        keluhan: 'Siswa sering berkonflik dengan teman sekelas dan tidak mau mengikuti kegiatan kelompok.',
        status: 'selesai', tanggal_pengajuan: lastMonth,
        reschedule_reason: null, createdAt: lastMonth, updatedAt: lastMonth,
      },
      {
        student_id: s(2), category_id: c(5),
        submitter_user_id: rayonUser2.id, bk_user_id: bkUser.id,
        keluhan: 'Siswa sering terlambat dan membolos pelajaran tanpa izin.',
        status: 'dijadwalkan',
        tanggal_pengajuan: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
        reschedule_reason: null,
        createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
        updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
      },
      {
        student_id: s(3), category_id: c(1),
        submitter_user_id: rayonUser2.id, bk_user_id: null,
        keluhan: 'Siswa terlihat murung dan tidak bersemangat dalam belajar.',
        status: 'menunggu',
        tanggal_pengajuan: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
        reschedule_reason: null,
        createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
        updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
      },
      {
        student_id: s(4), category_id: c(3),
        submitter_user_id: rayonUser.id, bk_user_id: bkUser2.id,
        keluhan: 'Siswa mengalami masalah di rumah yang berdampak pada konsentrasi belajar.',
        status: 'diterima',
        tanggal_pengajuan: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
        reschedule_reason: null,
        createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
        updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
      },
    ], {});

    // Ambil ID request yang baru dibuat
    const [requests] = await queryInterface.sequelize.query(
      'SELECT id FROM counseling_requests ORDER BY id ASC LIMIT 5'
    );
    if (!requests.length) return;

    const req = (i) => requests[Math.min(i, requests.length - 1)].id;

    // Seed counseling_schedules untuk request 0, 1, 2
    await queryInterface.bulkInsert('counseling_schedules', [
      {
        request_id: req(0), bk_user_id: bkUser.id, room_id: room(0),
        schedule_date: twoMonthsAgo, start_time: '09:00:00', end_time: '10:00:00',
        note: 'Konseling pertama untuk masalah akademik',
        createdAt: twoMonthsAgo, updatedAt: twoMonthsAgo,
      },
      {
        request_id: req(1), bk_user_id: bkUser.id, room_id: room(0),
        schedule_date: lastMonth, start_time: '10:00:00', end_time: '11:00:00',
        note: 'Konseling masalah sosial',
        createdAt: lastMonth, updatedAt: lastMonth,
      },
      {
        request_id: req(2), bk_user_id: bkUser.id, room_id: room(1),
        schedule_date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
        start_time: '08:00:00', end_time: '09:00:00',
        note: 'Konseling pelanggaran disiplin',
        createdAt: new Date(), updatedAt: new Date(),
      },
    ], {});

    // Ambil ID schedule
    const [schedules] = await queryInterface.sequelize.query(
      'SELECT id FROM counseling_schedules ORDER BY id ASC LIMIT 3'
    );
    if (!schedules.length) return;

    const sch = (i) => schedules[Math.min(i, schedules.length - 1)].id;

    // Seed counseling_results untuk schedule 0 dan 1
    await queryInterface.bulkInsert('counseling_results', [
      {
        schedule_id: sch(0),
        problem_summary: 'Siswa mengalami kesulitan memahami materi matematika karena kurang fokus saat pembelajaran.',
        solution: 'Diberikan bimbingan belajar tambahan dan pendampingan khusus dari wali kelas.',
        follow_up: 'Monitoring nilai selama 1 bulan ke depan',
        teacher_notes: 'Siswa sudah menunjukkan perbaikan setelah bimbingan',
        createdAt: twoMonthsAgo, updatedAt: twoMonthsAgo,
      },
      {
        schedule_id: sch(1),
        problem_summary: 'Siswa memiliki kesulitan berinteraksi sosial dan cenderung bersikap defensif.',
        solution: 'Diberikan pemahaman tentang komunikasi efektif dan mediasi dengan teman-teman sekelas.',
        follow_up: 'Observasi perilaku sosial selama 2 minggu',
        teacher_notes: 'Perlu tindak lanjut dari wali kelas dan orang tua',
        createdAt: lastMonth, updatedAt: lastMonth,
      },
    ], {});

    // Seed status history
    await queryInterface.bulkInsert('counseling_status_history', [
      { request_id: req(0), old_status: null,        new_status: 'menunggu',    notes: 'Pengajuan baru', changed_by: rayonUser.id, changed_at: twoMonthsAgo },
      { request_id: req(0), old_status: 'menunggu',  new_status: 'diterima',    notes: 'Diterima BK',    changed_by: bkUser.id,    changed_at: twoMonthsAgo },
      { request_id: req(0), old_status: 'diterima',  new_status: 'dijadwalkan', notes: 'Jadwal dibuat',  changed_by: bkUser.id,    changed_at: twoMonthsAgo },
      { request_id: req(0), old_status: 'dijadwalkan', new_status: 'selesai',   notes: 'Konseling selesai', changed_by: bkUser.id, changed_at: twoMonthsAgo },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('counseling_status_history', null, {});
    await queryInterface.bulkDelete('counseling_results', null, {});
    await queryInterface.bulkDelete('counseling_schedules', null, {});
    await queryInterface.bulkDelete('counseling_requests', null, {});
  }
};
