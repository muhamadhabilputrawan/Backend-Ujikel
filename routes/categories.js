'use strict';
const express = require('express');
const router = express.Router();
const { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { authenticate } = require('../middleware/auth');
const { isAdmin, isAll } = require('../middleware/roleCheck');

router.get('/', authenticate, isAll, getCategories);
router.get('/:id', authenticate, isAll, getCategoryById);
router.post('/', authenticate, isAdmin, createCategory);
router.put('/:id', authenticate, isAdmin, updateCategory);
router.delete('/:id', authenticate, isAdmin, deleteCategory);

module.exports = router;
