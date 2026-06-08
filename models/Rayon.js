'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Rayon = sequelize.define('Rayon', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama_rayon: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'rayons',
    timestamps: true
  });

  return Rayon;
};
