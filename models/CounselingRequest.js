'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CounselingRequest = sequelize.define('CounselingRequest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    submitter_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bk_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    keluhan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(
        'menunggu',
        'diterima',
        'reschedule',
        'dijadwalkan',
        'diproses',
        'selesai',
        'ditolak'
      ),
      allowNull: false,
      defaultValue: 'menunggu'
    },
    tanggal_pengajuan: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    reschedule_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'counseling_requests',
    timestamps: true
  });

  return CounselingRequest;
};
