'use strict';
const express = require('express');
const router = express.Router();
const { getRooms, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const { authenticate } = require('../middleware/auth');
const { isAdmin, isAll } = require('../middleware/roleCheck');

router.get('/', authenticate, isAll, getRooms);
router.post('/', authenticate, isAdmin, createRoom);
router.put('/:id', authenticate, isAdmin, updateRoom);
router.delete('/:id', authenticate, isAdmin, deleteRoom);

module.exports = router;
