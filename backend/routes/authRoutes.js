import express from 'express';
const router = express.Router();

import authController from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);
router.post('/upgrade-premium', authMiddleware, authController.upgradePremium);
router.put('/diet-preferences', authMiddleware, authController.saveDietPreferences);

router.get('/users', authMiddleware, authController.getAll);           // READ ALL
router.get('/users/:id', authMiddleware, authController.getById);      // READ ONE
router.put('/users/:id', authMiddleware, authController.update);       // UPDATE
router.delete('/users/:id', authMiddleware, authController.delete);    // DELETE

export default router;