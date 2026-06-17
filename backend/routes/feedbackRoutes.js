import express from 'express';

const router = express.Router();

import feedbackController from '../controllers/feedbackController.js';

router.post('/', feedbackController.create);
router.get('/', feedbackController.getAll);

export default router;