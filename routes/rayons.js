'use strict';
const express = require('express');
const router = express.Router();
const { getRayons, getRayonById, createRayon, updateRayon, deleteRayon } = require('../controllers/rayonController');
const { authenticate } = require('../middleware/auth');
const { isAdmin, isAll } = require('../middleware/roleCheck');

router.get('/', authenticate, isAll, getRayons);
router.get('/:id', authenticate, isAll, getRayonById);
router.post('/', authenticate, isAdmin, createRayon);
router.put('/:id', authenticate, isAdmin, updateRayon);
router.delete('/:id', authenticate, isAdmin, deleteRayon);

module.exports = router;
