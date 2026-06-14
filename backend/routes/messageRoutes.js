import express from 'express';
import messageController from '../controllers/messageController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware); // Apply authentication middleware to all routes

router.get('/chats', messageController.getChats);
router.post('/upload', messageController.uploadMock); // Mengatasi error 404 file upload
router.get('/:chatId', messageController.getMessages);
router.post('/:chatId', messageController.sendMessage);

export default router;