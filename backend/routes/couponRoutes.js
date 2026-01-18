import express from 'express';
import {
    createCoupon,
    getCoupons,
    updateCoupon,
    disableCoupon,
    applyCoupon
} from '../controllers/couponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Routes
router.route('/')
    .post(protect, admin, createCoupon)
    .get(protect, admin, getCoupons);

router.route('/:id')
    .put(protect, admin, updateCoupon)
    .delete(protect, admin, disableCoupon);

// User Routes
router.post('/apply', protect, applyCoupon);

export default router;
