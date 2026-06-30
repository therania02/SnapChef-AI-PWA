import jwt from 'jsonwebtoken';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export const authMiddleware = (req, res, next) => {
    // console.log("URL:", req.originalUrl);
    // console.log("METHOD:", req.method);
    // console.log("HEADERS:", req.headers);
    // console.log("AUTH:", req.headers.authorization);
    if (req.method === 'OPTIONS') {
        return next();
    }
    
    try {
        // console.log("AUTH HEADER:", req.headers.authorization);

        // Ambil token dari header Authorization (Format: "Bearer <token>")
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Akses ditolak. Token tidak ditemukan atau format salah."
            });
        }

        // Pisahkan kata "Bearer" dan ambil tokennya
        const token = authHeader.split(' ')[1];
        // console.log("TOKEN:", token);
        // Verifikasi token (Pastikan JWT_SECRET ada di file .env)
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET tidak ditemukan di environment");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("DECODED TOKEN:", decoded);
        // Simpan payload user ke dalam request agar bisa diakses oleh controller
        req.user = decoded;

        // Lanjut ke proses (controller) berikutnya
        next();
    } catch (error) {
        // console.error("JWT Error:", error);
        return res.status(401).json({
            success: false,
            message: "Akses ditolak. Token tidak valid atau sudah kedaluwarsa."
        });
    }
};