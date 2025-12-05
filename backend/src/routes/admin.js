import express from 'express';
import {
  getUsers,
  deleteUser,
  getLogs
} from '../controllers/adminController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

router.get('/users', getUsers);
router.delete('/user/:id', deleteUser);
router.get('/logs', getLogs);

export default router;

