import express from 'express';
const router = express.Router();
import * as recipeController from '../controllers/recipeController.js';

// Route untuk fitur scan AI
router.post('/scan', recipeController.scanFood);
router.post('/save', recipeController.saveRecipe);
router.get('/', recipeController.getRecipes);


export default router;