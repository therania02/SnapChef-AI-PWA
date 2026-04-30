import express from 'express';
import ingredientController from '../controllers/ingredientController.js';
const router = express.Router();

router.post('/', ingredientController.create);
router.get('/', ingredientController.getAll);
router.get('/:id', ingredientController.getById);
router.put('/:id', ingredientController.update);
router.delete('/:id', ingredientController.delete);

export default router;