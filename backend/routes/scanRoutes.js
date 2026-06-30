import express from 'express';
import scanController from '../controllers/scanController.js';
import checkAndResetScanLimit from '../middleware/scanLimitMiddleware.js';
import { authMiddleware as verifyToken } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Route untuk Proses Utama Scan (Memakai verifikasi Limit)
router.post('/scan', verifyToken, checkAndResetScanLimit, scanController.processImageScan);

// Route untuk Operasi Pengelolaan Riwayat Database
router.get('/history', verifyToken, scanController.getScanHistory);
router.get('/stats', verifyToken, scanController.getStats);
router.delete('/history/:id', verifyToken, scanController.deleteScan);
router.delete('/history', verifyToken, scanController.deleteAllScans);

export default router;