import express from 'express';
import { scanImage } from '../controllers/aiController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/scan', optionalAuth, scanImage);

export default router;

