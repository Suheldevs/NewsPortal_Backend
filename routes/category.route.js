import express from 'express';
import {
  createCategory,
  getActiveCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../controller/category.controller.js';

const router = express.Router();

router.post('/', createCategory);
router.get('/', getActiveCategories);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
