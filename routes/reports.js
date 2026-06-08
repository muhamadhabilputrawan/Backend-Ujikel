'use strict';
const express = require('express');
const router  = express.Router();
const { getMonthlyReport, getAnnualReport, getStudentReport, getRombelReport, getRayonReport } = require('../controllers/reportController');
const { authenticate }  = require('../middleware/auth');
const { isAdminOrBk, isAll } = require('../middleware/roleCheck');

router.get('/monthly',              authenticate, isAdminOrBk, getMonthlyReport);
router.get('/annual',               authenticate, isAdminOrBk, getAnnualReport);
router.get('/by-student/:student_id', authenticate, isAll,    getStudentReport);
router.get('/by-rombel/:rombel_id', authenticate, isAdminOrBk, getRombelReport);
router.get('/by-rayon/:rayon_id',   authenticate, isAdminOrBk, getRayonReport);

module.exports = router;
