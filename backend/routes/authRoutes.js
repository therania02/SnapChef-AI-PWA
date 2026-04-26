import express from 'express';
const router = express.Router();
import * as authController from '../controllers/authController.js'; // Pakai .js

router.post('/register', authController.register);
router.post('/login', authController.login);

export default router; // Gunakan export default