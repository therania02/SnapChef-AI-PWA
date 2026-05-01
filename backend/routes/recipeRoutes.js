import express from 'express';
const router = express.Router();

import recipeController from '../controllers/recipeController.js';

router.post('/scan', recipeController.scanFood);
router.post('/save', recipeController.saveRecipe);
router.get('/', recipeController.getRecipes);
router.get('/:id', recipeController.getRecipeById);
router.put('/:id/rating', recipeController.rateRecipe);
router.delete('/:id', recipeController.deleteRecipe);

export default router;