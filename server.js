'use strict';
require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT    = process.env.PORT     || 3000;
const HOST    = '0.0.0.0'; // Listen di semua interface agar bisa diakses dari device mobile
const SERVER_IP = process.env.SERVER_IP || 'localhost';

const startServer = async () => {
  try {
    // Test koneksi database
    await sequelize.authenticate();
    console.log('✅ Koneksi database berhasil.');

    app.listen(PORT, HOST, () => {
      console.log('');
      console.log('🚀 MGKONSEL Backend berjalan!');
      console.log(`   Local    : http://localhost:${PORT}`);
      console.log(`   Network  : http://${SERVER_IP}:${PORT}`);
      console.log(`   API Docs : http://${SERVER_IP}:${PORT}/api/health`);
      console.log('');
      console.log('📱 Konfigurasi Flutter:');
      console.log(`   baseUrl  = "http://${SERVER_IP}:${PORT}/api"`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Gagal memulai server:', error.message);
    process.exit(1);
  }
};

startServer();
