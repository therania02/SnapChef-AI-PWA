import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const db = require('../models/index.cjs');
const { User } = db;

import bcrypt from 'bcryptjs';

// Fungsi Register (Async/Await - Indikator 3)
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Hash password agar aman (Sangat disarankan untuk standar profesional)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Membuat data baru di database (Inheritance dari Sequelize Model - Indikator 2)
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword, // Simpan password yang sudah di-hash
            role: 'user'
        });

        res.status(201).json({
            message: "Registrasi Berhasil!",
            user: newUser
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Cari user berdasarkan email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: "Email tidak terdaftar" });
        }

        // Bandingkan password input dengan password di database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Password salah" });
        }

        res.status(200).json({
            message: "Login Berhasil!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};