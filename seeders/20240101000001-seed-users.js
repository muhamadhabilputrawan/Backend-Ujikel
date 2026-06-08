'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedAdmin = await bcrypt.hash('admin123', 10);
    const hashedBK = await bcrypt.hash('bk12345', 10);
    const hashedRayon = await bcrypt.hash('rayon123', 10);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Administrator',
        username: 'admin',
        email: 'admin@mgkonsel.com',
        password: hashedAdmin,
        role: 'admin',
        phone: '081234567890',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Guru BK Utama',
        username: 'gurubk',
        email: 'bk@mgkonsel.com',
        password: hashedBK,
        role: 'guru_bk',
        phone: '081234567891',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pembimbing Rayon 1',
        username: 'rayon1',
        email: 'rayon@mgkonsel.com',
        password: hashedRayon,
        role: 'pembimbing_rayon',
        phone: '081234567892',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Budi Santoso',
        username: 'budi_bk',
        email: 'budi@mgkonsel.com',
        password: await bcrypt.hash('budi123', 10),
        role: 'guru_bk',
        phone: '081234567893',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sari Dewi',
        username: 'sari_rayon',
        email: 'sari@mgkonsel.com',
        password: await bcrypt.hash('sari123', 10),
        role: 'pembimbing_rayon',
        phone: '081234567894',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
