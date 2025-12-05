import express from 'express';
import {
  getSuggestions,
  saveRecipe,
  getSavedRecipes
} from '../controllers/recipeController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/suggestions', optionalAuth, getSuggestions);
router.post('/save', authenticateToken, saveRecipe);
router.get('/saved', authenticateToken, getSavedRecipes);

export default router;

