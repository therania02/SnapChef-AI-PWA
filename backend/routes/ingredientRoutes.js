import express from 'express';
import ingredientController from '../controllers/ingredientController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', authMiddleware, ingredientController.create);
router.get('/', authMiddleware, ingredientController.getAll);
router.get('/:id', ingredientController.getById);
router.put('/:id', authMiddleware, ingredientController.update);
router.delete('/:id', authMiddleware, ingredientController.delete);

export default router;