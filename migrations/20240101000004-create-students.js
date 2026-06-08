'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('students', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nis: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      nama: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      gender: {
        type: Sequelize.ENUM('L', 'P'),
        allowNull: false
      },
      alamat: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      telepon: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      rombel_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'rombels',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      rayon_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'rayons',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.dropTable('students');
  }
};
