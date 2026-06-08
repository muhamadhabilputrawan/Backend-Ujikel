'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CounselingSchedule = sequelize.define('CounselingSchedule', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    request_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bk_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    schedule_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'counseling_schedules',
    timestamps: true
  });

  return CounselingSchedule;
};
