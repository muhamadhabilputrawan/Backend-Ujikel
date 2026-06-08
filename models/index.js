'use strict';

const { Sequelize } = require('sequelize');
const config = require('../config/database.js');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging
  }
);

// Import semua model
const User = require('./User')(sequelize);
const Rombel = require('./Rombel')(sequelize);
const Rayon = require('./Rayon')(sequelize);
const Student = require('./Student')(sequelize);
const ProblemCategory = require('./ProblemCategory')(sequelize);
const Room = require('./Room')(sequelize);
const CounselingRequest = require('./CounselingRequest')(sequelize);
const CounselingSchedule = require('./CounselingSchedule')(sequelize);
const CounselingResult = require('./CounselingResult')(sequelize);
const CounselingStatusHistory = require('./CounselingStatusHistory')(sequelize);

// ============ RELASI ============

// Student -> Rombel (many to one)
Student.belongsTo(Rombel, { foreignKey: 'rombel_id', as: 'rombel' });
Rombel.hasMany(Student, { foreignKey: 'rombel_id', as: 'students' });

// Student -> Rayon (many to one)
Student.belongsTo(Rayon, { foreignKey: 'rayon_id', as: 'rayon' });
Rayon.hasMany(Student, { foreignKey: 'rayon_id', as: 'students' });

// CounselingRequest -> Student
CounselingRequest.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });
Student.hasMany(CounselingRequest, { foreignKey: 'student_id', as: 'counselingRequests' });

// CounselingRequest -> ProblemCategory
CounselingRequest.belongsTo(ProblemCategory, { foreignKey: 'category_id', as: 'category' });
ProblemCategory.hasMany(CounselingRequest, { foreignKey: 'category_id', as: 'counselingRequests' });

// CounselingRequest -> User (submitter / pembimbing rayon)
CounselingRequest.belongsTo(User, { foreignKey: 'submitter_user_id', as: 'submitter' });
User.hasMany(CounselingRequest, { foreignKey: 'submitter_user_id', as: 'submittedRequests' });

// CounselingRequest -> User (bk_user / guru bk)
CounselingRequest.belongsTo(User, { foreignKey: 'bk_user_id', as: 'bkUser' });
User.hasMany(CounselingRequest, { foreignKey: 'bk_user_id', as: 'handledRequests' });

// CounselingSchedule -> CounselingRequest
CounselingSchedule.belongsTo(CounselingRequest, { foreignKey: 'request_id', as: 'request' });
CounselingRequest.hasOne(CounselingSchedule, { foreignKey: 'request_id', as: 'schedule' });

// CounselingSchedule -> User (bk)
CounselingSchedule.belongsTo(User, { foreignKey: 'bk_user_id', as: 'bkUser' });

// CounselingSchedule -> Room
CounselingSchedule.belongsTo(Room, { foreignKey: 'room_id', as: 'room' });
Room.hasMany(CounselingSchedule, { foreignKey: 'room_id', as: 'schedules' });

// CounselingResult -> CounselingSchedule
CounselingResult.belongsTo(CounselingSchedule, { foreignKey: 'schedule_id', as: 'schedule' });
CounselingSchedule.hasOne(CounselingResult, { foreignKey: 'schedule_id', as: 'result' });

// CounselingStatusHistory -> CounselingRequest
CounselingStatusHistory.belongsTo(CounselingRequest, { foreignKey: 'request_id', as: 'request' });
CounselingRequest.hasMany(CounselingStatusHistory, { foreignKey: 'request_id', as: 'statusHistories' });

// CounselingStatusHistory -> User (changed_by)
CounselingStatusHistory.belongsTo(User, { foreignKey: 'changed_by', as: 'changedBy' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Rombel,
  Rayon,
  Student,
  ProblemCategory,
  Room,
  CounselingRequest,
  CounselingSchedule,
  CounselingResult,
  CounselingStatusHistory
};
