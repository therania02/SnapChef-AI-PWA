import express from 'express';

const router = express.Router();

import feedbackController from '../controllers/feedbackController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

router.post('/', authMiddleware, feedbackController.create);
router.get('/', feedbackController.getAll);

export default router;