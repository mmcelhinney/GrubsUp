import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  validateRegister,
  validateLogin
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.get('/me', authenticateToken, getMe);

export default router;

