import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getProfile,
  updateProfile,
  updatePassword
} from '../controllers/profileController.js';
import { body } from 'express-validator';

const router = express.Router();

// Validation middleware
const validateUpdateProfile = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
];

const validateUpdatePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

// All routes require authentication
router.use(authenticateToken);

router.get('/', getProfile);
router.put('/', validateUpdateProfile, updateProfile);
router.put('/password', validateUpdatePassword, updatePassword);

export default router;

