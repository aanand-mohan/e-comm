import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import orderRoutes from './routes/orderRoutes.js'; // [NEW]
import paymentRoutes from './routes/paymentRoutes.js';
import adminOrderRoutes from './routes/adminOrderRoutes.js';
import adminStatsRoutes from './routes/adminStatsRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import contentRoutes from './routes/contentRoutes.js';

dotenv.config();

import seedDeveloper from './utils/seeder.js'; // Import seeder

// ... 

connectDB().then(() => {
  seedDeveloper(); // Run seeder after connection
});

const app = express();

app.use(cors());

// Use JSON parser for all routes except webhook
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payment/webhook') {
    next();
  } else {
    express.json({ limit: '50mb' })(req, res, next);
  }
});

// Use raw parser specifically for webhook
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// ... (existing code)

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/summary', adminStatsRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/content', contentRoutes);
console.log('Routes registered: /api/banners');

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
