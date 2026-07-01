import express from 'express';
import commentController from '../controllers/commentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', authMiddleware, commentController.create);
router.get('/', authMiddleware, commentController.getAll);
router.get('/:id', commentController.getById);
router.put('/:id', authMiddleware, commentController.update);
router.delete('/:id', authMiddleware, commentController.delete);

export default router;