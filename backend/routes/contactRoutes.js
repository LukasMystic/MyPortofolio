import express from 'express';
import rateLimit from 'express-rate-limit';
import { sendMessage, getMessages, deleteMessage } from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Rate Limiter for the Public Contact Form ---
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 submissions per 15 minutes
    message: 'Too many contact requests from this IP, please try again after 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply the limiter ONLY to the public POST route
router.route('/').post(contactLimiter, sendMessage);

// The protected admin routes do NOT have the public rate limiter
router.route('/').get(protect, getMessages);
router.route('/:id').delete(protect, deleteMessage);

export default router;

