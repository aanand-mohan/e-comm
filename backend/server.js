import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
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

const allowedOrigins = [
  'https://e-comm-2adg.vercel.app',
  'http://localhost:3000',
  'http://localhost:5000',
  'https://ecommapi.ddns.net'
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log('CORS Origin Check:', origin); // Debug log for EC2
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS Blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

// Use JSON parser for all routes except webhook
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/payment/webhook')) {
    next();
  } else {
    express.json({ limit: '50mb' })(req, res, next);
  }
});

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Test Route to check if server is responsive
app.get('/test', (req, res) => {
  res.json({ message: 'API is running successfully' });
});

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
console.log('Force Restart: Payment Logic Updated');

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
