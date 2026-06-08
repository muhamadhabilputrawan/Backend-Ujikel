'use strict';
const { ProblemCategory } = require('../models');

const getCategories = async (req, res) => {
  try {
    const categories = await ProblemCategory.findAll({ order: [['nama_kategori', 'ASC']] });
    return res.json({ success: true, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const cat = await ProblemCategory.findByPk(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
    return res.json({ success: true, data: cat });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { nama_kategori, deskripsi } = req.body;
    const cat = await ProblemCategory.create({ nama_kategori, deskripsi });
    return res.status(201).json({ success: true, message: 'Kategori berhasil dibuat.', data: cat });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const cat = await ProblemCategory.findByPk(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
    await cat.update({ nama_kategori: req.body.nama_kategori, deskripsi: req.body.deskripsi });
    return res.json({ success: true, message: 'Kategori berhasil diperbarui.', data: cat });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const cat = await ProblemCategory.findByPk(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
    await cat.destroy();
    return res.json({ success: true, message: 'Kategori berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
