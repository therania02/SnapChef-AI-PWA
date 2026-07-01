import express from 'express';
const router = express.Router();

import recipeController from '../controllers/recipeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

router.post('/scan', authMiddleware, recipeController.scanFood);
router.post('/save', authMiddleware, recipeController.saveRecipe);
router.get('/', recipeController.getRecipes);
router.get('/:id', recipeController.getRecipeById);
router.put('/:id/rating', authMiddleware, recipeController.rateRecipe);
router.delete('/:id', authMiddleware, recipeController.deleteRecipe);

export default router;