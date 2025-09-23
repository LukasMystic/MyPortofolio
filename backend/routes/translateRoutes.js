import express from 'express';
import { translateText } from '../controllers/translateController.js';

const router = express.Router();

router.route('/').post(translateText);

export default router;

