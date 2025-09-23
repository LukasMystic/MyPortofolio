import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';
import projectRoutes from './routes/projectRoutes.js';
import cvRoutes from './routes/cvRoutes.js';
import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import translateRoutes from './routes/translateRoutes.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB();
const app = express();

// --- [START] CORS CONFIGURATION CHANGE ---

// 1. Define the list of allowed origins (your frontends)
const allowedOrigins = [
  'http://localhost:5173',
  'https://stanleypt.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    // The 'origin' is the URL of the frontend making the request
    // We allow the request if the origin is in our allowed list or if there's no origin (like for Postman/API tools)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // This allows cookies to be sent
};

// 2. Replace the default app.use(cors()) with your new configuration
app.use(cors(corsOptions));

// --- [END] CORS CONFIGURATION CHANGE ---

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: 'Too many contact requests from this IP' });

app.get('/', (req, res) => res.send('API is running...'));

// Mount Routers
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/translate', translateRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));