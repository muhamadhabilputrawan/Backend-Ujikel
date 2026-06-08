'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ambil ID rombel dan rayon yang ada di database (tidak hardcode)
    const [rombels] = await queryInterface.sequelize.query(
      'SELECT id FROM rombels ORDER BY id ASC LIMIT 10'
    );
    const [rayons] = await queryInterface.sequelize.query(
      'SELECT id FROM rayons ORDER BY id ASC LIMIT 4'
    );

    if (rombels.length === 0 || rayons.length === 0) {
      console.log('SKIP: rombels atau rayons kosong, skip seed students');
      return;
    }

    // Helper ambil ID berdasarkan index
    const r = (i) => rombels[Math.min(i, rombels.length - 1)].id;
    const y = (i) => rayons[Math.min(i, rayons.length - 1)].id;

    await queryInterface.bulkInsert('students', [
      { nis: '2024001', nama: 'Ahmad Rizki Pratama', gender: 'L', alamat: 'Jl. Merdeka No. 1',        telepon: '08111000001', rombel_id: r(0), rayon_id: y(0), createdAt: new Date(), updatedAt: new Date() },
      { nis: '2024002', nama: 'Bella Safitri',        gender: 'P', alamat: 'Jl. Sudirman No. 2',       telepon: '08111000002', rombel_id: r(0), rayon_id: y(0), createdAt: new Date(), updatedAt: new Date() },
      { nis: '2024003', nama: 'Cahyo Nugroho',        gender: 'L', alamat: 'Jl. Gatot Subroto No. 3', telepon: '08111000003', rombel_id: r(1), rayon_id: y(0), createdAt: new Date(), updatedAt: new Date() },
      { nis: '2024004', nama: 'Dewi Anggraini',       gender: 'P', alamat: 'Jl. Diponegoro No. 4',    telepon: '08111000004', rombel_id: r(1), rayon_id: y(1), createdAt: new Date(), updatedAt: new Date() },
      { nis: '2024005', nama: 'Eko Wahyudi',          gender: 'L', alamat: 'Jl. Ahmad Yani No. 5',    telepon: '08111000005', rombel_id: r(2), rayon_id: y(1), createdAt: new Date(), updatedAt: new Date() },
      { nis: '2024006', nama: 'Fitri Handayani',      gender: 'P', alamat: 'Jl. Pahlawan No. 6',      telepon: '08111000006', rombel_id: r(2), rayon_id: y(1), createdAt: new Date(), updatedAt: new Date() },
      { nis: '2024007', nama: 'Galih Purnomo',        gender: 'L', alamat: 'Jl. Hayam Wuruk No. 7',   telepon: '08111000007', rombel_id: r(3), rayon_id: y(2), createdAt: new Date(), updatedAt: new Date() },
      { nis: '2024008', nama: 'Hana Permata',         gender: 'P', alamat: 'Jl. Veteran No. 8',       telepon: '08111000008', rombel_id: r(3), rayon_id: y(2), createdAt: new Date(), updatedAt: new Date() },
      { nis: '2024009', nama: 'Ivan Setiawan',        gender: 'L', alamat: 'Jl. Pemuda No. 9',        telepon: '08111000009', rombel_id: r(4), rayon_id: y(2), createdAt: new Date(), updatedAt: new Date() },
      { nis: '2024010', nama: 'Julia Maharani',       gender: 'P', alamat: 'Jl. Raya No. 10',         telepon: '08111000010', rombel_id: r(4), rayon_id: y(3), createdAt: new Date(), updatedAt: new Date() },
      { nis: '2024011', nama: 'Kevin Ardiansyah',     gender: 'L', alamat: 'Jl. Kesehatan No. 11',    telepon: '08111000011', rombel_id: r(5), rayon_id: y(3), createdAt: new Date(), updatedAt: new Date() },
      { nis: '2024012', nama: 'Lina Rahmawati',       gender: 'P', alamat: 'Jl. Pendidikan No. 12',   telepon: '08111000012', rombel_id: r(5), rayon_id: y(3), createdAt: new Date(), updatedAt: new Date() },
      { nis: '2024013', nama: 'Muhammad Faisal',      gender: 'L', alamat: 'Jl. Cendrawasih No. 13',  telepon: '08111000013', rombel_id: r(6), rayon_id: y(0), createdAt: new Date(), updatedAt: new Date() },
      { nis: '2024014', nama: 'Nadia Kusuma',         gender: 'P', alamat: 'Jl. Mawar No. 14',        telepon: '08111000014', rombel_id: r(6), rayon_id: y(1), createdAt: new Date(), updatedAt: new Date() },
      { nis: '2024015', nama: 'Oscar Firmansyah',     gender: 'L', alamat: 'Jl. Melati No. 15',       telepon: '08111000015', rombel_id: r(7), rayon_id: y(2), createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('students', null, {});
  }
};
