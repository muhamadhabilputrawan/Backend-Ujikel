'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Seed Rombels
    await queryInterface.bulkInsert('rombels', [
      { nama_rombel: 'X RPL 1', jurusan: 'Rekayasa Perangkat Lunak', tingkat: 'X', createdAt: new Date(), updatedAt: new Date() },
      { nama_rombel: 'X RPL 2', jurusan: 'Rekayasa Perangkat Lunak', tingkat: 'X', createdAt: new Date(), updatedAt: new Date() },
      { nama_rombel: 'X TKJ 1', jurusan: 'Teknik Komputer dan Jaringan', tingkat: 'X', createdAt: new Date(), updatedAt: new Date() },
      { nama_rombel: 'X TKJ 2', jurusan: 'Teknik Komputer dan Jaringan', tingkat: 'X', createdAt: new Date(), updatedAt: new Date() },
      { nama_rombel: 'XI RPL 1', jurusan: 'Rekayasa Perangkat Lunak', tingkat: 'XI', createdAt: new Date(), updatedAt: new Date() },
      { nama_rombel: 'XI RPL 2', jurusan: 'Rekayasa Perangkat Lunak', tingkat: 'XI', createdAt: new Date(), updatedAt: new Date() },
      { nama_rombel: 'XI TKJ 1', jurusan: 'Teknik Komputer dan Jaringan', tingkat: 'XI', createdAt: new Date(), updatedAt: new Date() },
      { nama_rombel: 'XII RPL 1', jurusan: 'Rekayasa Perangkat Lunak', tingkat: 'XII', createdAt: new Date(), updatedAt: new Date() },
      { nama_rombel: 'XII TKJ 1', jurusan: 'Teknik Komputer dan Jaringan', tingkat: 'XII', createdAt: new Date(), updatedAt: new Date() },
      { nama_rombel: 'XII MM 1', jurusan: 'Multimedia', tingkat: 'XII', createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // Seed Rayons
    await queryInterface.bulkInsert('rayons', [
      { nama_rayon: 'Rayon A', createdAt: new Date(), updatedAt: new Date() },
      { nama_rayon: 'Rayon B', createdAt: new Date(), updatedAt: new Date() },
      { nama_rayon: 'Rayon C', createdAt: new Date(), updatedAt: new Date() },
      { nama_rayon: 'Rayon D', createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // Seed Rooms
    await queryInterface.bulkInsert('rooms', [
      { room_name: 'Ruang BK 1', location: 'Gedung A Lantai 1', createdAt: new Date(), updatedAt: new Date() },
      { room_name: 'Ruang BK 2', location: 'Gedung A Lantai 1', createdAt: new Date(), updatedAt: new Date() },
      { room_name: 'Ruang Konsultasi', location: 'Gedung B Lantai 2', createdAt: new Date(), updatedAt: new Date() },
      { room_name: 'Ruang Pertemuan', location: 'Gedung C Lantai 1', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('rooms', null, {});
    await queryInterface.bulkDelete('rayons', null, {});
    await queryInterface.bulkDelete('rombels', null, {});
  }
};
