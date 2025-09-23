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
import translateRoutes from './routes/translateRoutes.js'; // Import the new routes

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB();
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: 'Too many contact requests from this IP' });

app.get('/', (req, res) => res.send('API is running...'));

// Mount Routers
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/translate', translateRoutes); // Add the new translate route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

