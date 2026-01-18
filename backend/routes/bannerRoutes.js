import express from 'express';
import {
    createBanner,
    getBanners,
    getAdminBanners,
    updateBanner,
    deleteBanner
} from '../controllers/bannerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getBanners) // Public list (query param: position)
    .post(protect, admin, (req, res, next) => {
        console.log('POST /api/banners hit');
        next();
    }, createBanner);

router.route('/admin')
    .get(protect, admin, getAdminBanners);

router.route('/:id')
    .put(protect, admin, updateBanner)
    .delete(protect, admin, deleteBanner);

export default router;
