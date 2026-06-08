'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('problem_categories', [
      {
        nama_kategori: 'Masalah Akademik',
        deskripsi: 'Masalah yang berkaitan dengan kegiatan belajar, nilai, atau prestasi akademik siswa',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_kategori: 'Masalah Pribadi',
        deskripsi: 'Masalah yang berkaitan dengan kondisi pribadi, emosi, atau mental siswa',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_kategori: 'Masalah Sosial',
        deskripsi: 'Masalah yang berkaitan dengan hubungan sosial, pertemanan, atau pergaulan siswa',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_kategori: 'Masalah Keluarga',
        deskripsi: 'Masalah yang berkaitan dengan kondisi keluarga atau lingkungan rumah siswa',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_kategori: 'Masalah Karir',
        deskripsi: 'Masalah yang berkaitan dengan rencana karir, pemilihan jurusan, atau masa depan siswa',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_kategori: 'Pelanggaran Disiplin',
        deskripsi: 'Masalah yang berkaitan dengan pelanggaran tata tertib sekolah',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_kategori: 'Masalah Kesehatan',
        deskripsi: 'Masalah yang berkaitan dengan kondisi kesehatan fisik atau mental siswa',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_kategori: 'Lainnya',
        deskripsi: 'Masalah lain yang tidak termasuk dalam kategori di atas',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('problem_categories', null, {});
  }
};
