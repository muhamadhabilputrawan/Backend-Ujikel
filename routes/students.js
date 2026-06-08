'use strict';
const express = require('express');
const router = express.Router();
const { getStudents, getStudentById, createStudent, updateStudent, deleteStudent, getStudentHistory } = require('../controllers/studentController');
const { authenticate } = require('../middleware/auth');
const { isAdmin, isAll, isAdminOrRayon } = require('../middleware/roleCheck');

router.get('/', authenticate, isAll, getStudents);
router.get('/:id', authenticate, isAll, getStudentById);
router.get('/:id/history', authenticate, isAll, getStudentHistory);
router.post('/', authenticate, isAdminOrRayon, createStudent);
router.put('/:id', authenticate, isAdminOrRayon, updateStudent);
router.delete('/:id', authenticate, isAdmin, deleteStudent);

module.exports = router;
