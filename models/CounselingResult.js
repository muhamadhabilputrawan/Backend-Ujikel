'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CounselingResult = sequelize.define('CounselingResult', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    schedule_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    problem_summary: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    solution: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    follow_up: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    teacher_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'counseling_results',
    timestamps: true
  });

  return CounselingResult;
};
