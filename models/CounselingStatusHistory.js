'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CounselingStatusHistory = sequelize.define('CounselingStatusHistory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    request_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    old_status: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    new_status: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    changed_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    changed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'counseling_status_history',
    timestamps: false
  });

  return CounselingStatusHistory;
};
