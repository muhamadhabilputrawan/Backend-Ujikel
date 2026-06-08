'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProblemCategory = sequelize.define('ProblemCategory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama_kategori: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'problem_categories',
    timestamps: true
  });

  return ProblemCategory;
};
