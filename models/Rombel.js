'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Rombel = sequelize.define('Rombel', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama_rombel: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    jurusan: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tingkat: {
      type: DataTypes.ENUM('X', 'XI', 'XII'),
      allowNull: false
    }
  }, {
    tableName: 'rombels',
    timestamps: true
  });

  return Rombel;
};
