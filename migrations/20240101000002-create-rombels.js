'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rombels', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nama_rombel: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      jurusan: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      tingkat: {
        type: Sequelize.ENUM('X', 'XI', 'XII'),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('rombels');
  }
};
