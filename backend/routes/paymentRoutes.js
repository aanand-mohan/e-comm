import express from 'express';
import { createCheckoutSession, handleWebhook, verifyPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/verify', protect, verifyPayment);
router.post('/webhook', handleWebhook);

export default router;
