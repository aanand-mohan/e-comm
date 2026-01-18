import express from 'express';
import {
    createCategory,
    getCategories,
    getAdminCategories,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getCategories) // Public list
    .post(protect, admin, createCategory);

router.route('/admin')
    .get(protect, admin, getAdminCategories);

router.route('/:id')
    .put(protect, admin, updateCategory)
    .delete(protect, admin, deleteCategory);

export default router;
