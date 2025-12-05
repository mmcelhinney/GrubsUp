import express from 'express';
import { upload, uploadFridgeImage } from '../controllers/uploadController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/fridge-image', optionalAuth, upload.single('image'), uploadFridgeImage);

export default router;

