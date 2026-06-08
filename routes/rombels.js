'use strict';
const express = require('express');
const router = express.Router();
const { getRombels, getRombelById, createRombel, updateRombel, deleteRombel } = require('../controllers/rombelController');
const { authenticate } = require('../middleware/auth');
const { isAdmin, isAll } = require('../middleware/roleCheck');

router.get('/', authenticate, isAll, getRombels);
router.get('/:id', authenticate, isAll, getRombelById);
router.post('/', authenticate, isAdmin, createRombel);
router.put('/:id', authenticate, isAdmin, updateRombel);
router.delete('/:id', authenticate, isAdmin, deleteRombel);

module.exports = router;
