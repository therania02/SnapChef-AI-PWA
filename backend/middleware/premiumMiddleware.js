import db from '../models/index.cjs';

const { User } = db;

export const premiumMiddleware = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: 'Akses ditolak. Silakan login kembali.'
            });
        }

        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan.'
            });
        }

        if (user.role === 'premium' && user.premiumExpiresAt && new Date(user.premiumExpiresAt) <= new Date()) {
            await user.update({ role: 'user', premiumExpiresAt: null });
            user.role = 'user';
            user.premiumExpiresAt = null;
        }

        if (user.role !== 'premium') {
            return res.status(403).json({
                success: false,
                message: 'Fitur ini hanya untuk pengguna Premium.'
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat validasi premium.'
        });
    }
};