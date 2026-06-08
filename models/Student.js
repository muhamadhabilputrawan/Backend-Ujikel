'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Student = sequelize.define('Student', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nis: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('L', 'P'),
      allowNull: false
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    telepon: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    rombel_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rayon_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'students',
    timestamps: true
  });

  return Student;
};
