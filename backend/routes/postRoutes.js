import express from 'express';
import postController from '../controllers/postController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

// Middleware optional untuk get - user bisa melihat posts public tanpa login
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const jwt = require('jsonwebtoken');
            req.user = jwt.verify(token, process.env.JWT_SECRET);
        }
        next();
    } catch (error) {
        next();
    }
};

router.post('/', authMiddleware, postController.create);
router.get('/', optionalAuth, postController.getAll);
router.get('/:id', optionalAuth, postController.getById);
router.put('/:id', authMiddleware, postController.update);
router.delete('/:id', authMiddleware, postController.delete);

export default router;