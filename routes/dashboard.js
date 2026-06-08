'use strict';
const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');
const { isAll } = require('../middleware/roleCheck');

router.get('/', authenticate, isAll, getDashboard);

module.exports = router;
