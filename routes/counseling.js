'use strict';
const express = require('express');
const router = express.Router();
const {
  getRequests, getRequestById, createRequest,
  acceptRequest, rejectRequest, rescheduleRequest,
  createSchedule, getSchedules,
  createResult, processRequest, getResult
} = require('../controllers/counselingController');
const { authenticate } = require('../middleware/auth');
const { isAll, isGurubk, isRayon, isAdminOrBk } = require('../middleware/roleCheck');

// Requests
router.get('/requests', authenticate, isAll, getRequests);
router.get('/requests/:id', authenticate, isAll, getRequestById);
router.post('/requests', authenticate, isRayon, createRequest);
router.put('/requests/:id/accept', authenticate, isGurubk, acceptRequest);
router.put('/requests/:id/reject', authenticate, isGurubk, rejectRequest);
router.put('/requests/:id/reschedule', authenticate, isGurubk, rescheduleRequest);
router.put('/requests/:id/process', authenticate, isGurubk, processRequest);

// Schedules
router.get('/schedules', authenticate, isAll, getSchedules);
router.post('/schedules', authenticate, isGurubk, createSchedule);

// Results
router.get('/results/:schedule_id', authenticate, isAll, getResult);
router.post('/results', authenticate, isGurubk, createResult);

module.exports = router;
