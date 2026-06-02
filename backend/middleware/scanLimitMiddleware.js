// backend/middlewares/scanLimitMiddleware.js
import db from '../models/index.cjs';

const { User } = db;

const checkAndResetScanLimit = async (req, res, next) => {
  try {
    // 1. Pastikan user sudah login dari authMiddleware sebelumnya
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized. Silakan login terlebih dahulu." });
    }

    // 2. Ambil data user dari database
    const userInstance = await User.findByPk(req.user.id);
    if (!userInstance) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan." });
    }

    if (userInstance.role === 'premium') {
      if (userInstance.premiumExpiresAt && new Date(userInstance.premiumExpiresAt) <= new Date()) {
        await userInstance.update({ role: 'user', premiumExpiresAt: null });
        userInstance.role = 'user';
        userInstance.premiumExpiresAt = null;
      }

      req.userInstance = userInstance;
      return next();
    }

    // 3. Logika pengecekan tanggal berbasis Waktu Lokal (WIB)
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localToday = new Date(today.getTime() - (offset * 60 * 1000));
    const todayStr = localToday.toISOString().split('T')[0]; // Hasil format: YYYY-MM-DD

    if (userInstance.lastScanDate !== todayStr) {
      // Jika hari sudah berganti, kembalikan limit ke default (misal: 3)
      userInstance.scanLimit = 3; 
      userInstance.lastScanDate = todayStr;
      await userInstance.save();
    }

    // 4. Cek apakah limit harian sudah habis
    if (userInstance.scanLimit <= 0) {
      return res.status(403).json({ 
        success: false, 
        message: "Limit scan harian Anda habis! Silakan coba lagi esok hari." 
      });
    }

    // 5. Teruskan instance user ter-update ke object `req` agar dapat langsung digunakan di Controller
    req.userInstance = userInstance;
    next();
  } catch (error) {
    console.error("Error pada scanLimitMiddleware:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan sistem pada pengecekan limit." });
  }
};

export default checkAndResetScanLimit;