import express from 'express';
const router = express.Router();

import authController from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/upgrade-premium', authMiddleware, authController.upgradePremium);

router.get('/users', authController.getAll);           // READ ALL
router.get('/users/:id', authController.getById);      // READ ONE
router.put('/users/:id', authController.update);       // UPDATE
router.delete('/users/:id', authController.delete);    // DELETE

export default router;