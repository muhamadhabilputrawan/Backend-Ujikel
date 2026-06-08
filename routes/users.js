'use strict';
const express = require('express');
const router = express.Router();
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

router.get('/', authenticate, isAdmin, getUsers);
router.get('/:id', authenticate, isAdmin, getUserById);
router.post('/', authenticate, isAdmin, createUser);
router.put('/:id', authenticate, isAdmin, updateUser);
router.delete('/:id', authenticate, isAdmin, deleteUser);

module.exports = router;
