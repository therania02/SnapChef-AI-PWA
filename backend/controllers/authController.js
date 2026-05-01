import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const db = require('../models/index.cjs');
const { User, Sequelize } = db;
const { Op } = Sequelize;
import bcrypt from 'bcryptjs';

// Import BaseController untuk Inheritance
import BaseController from './baseController.js';

// AuthController mewarisi BaseController
class AuthController extends BaseController {

    // Gunakan arrow function (=>) agar konteks 'this' tetap mengikat ke class ini
    register = async (req, res) => {
        try {
            const { name, email, password } = req.body;

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Membuat data baru di database
            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
                role: 'user'
            });

            // Menggunakan method dari class induk (BaseController)
            return this.sendSuccess(res, 201, "Registrasi Berhasil!", newUser);
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };

    login = async (req, res) => {
        try {
            const { email, password } = req.body;

            // Cari user berdasarkan email
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return this.sendError(res, 401, "Email tidak terdaftar");
            }

            // Bandingkan password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return this.sendError(res, 401, "Password salah");
            }

            const userData = {
                id: user.id,
                name: user.name,
                email: user.email
            };

            // Menggunakan method dari class induk
            return this.sendSuccess(res, 200, "Login Berhasil!", { user: userData });
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };

    // R - Read All (Dengan Filter & Pagination)
    getAll = async (req, res) => {
        try {
            const search = req.query.q || '';
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const users = await User.findAndCountAll({
                where: {
                    name: { [Op.like]: `%${search}%` }
                },
                // PENTING: Jangan tampilkan password di response JSON!
                attributes: { exclude: ['password'] },
                limit: limit,
                offset: offset
            });

            return this.sendSuccess(res, 200, "Berhasil mengambil data pengguna", {
                totalData: users.count,
                totalPages: Math.ceil(users.count / limit),
                currentPage: page,
                data: users.rows
            });
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };

    // R - Read One by ID
    getById = async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id, {
                attributes: { exclude: ['password'] }
            });
            if (!user) return this.sendError(res, 404, "Pengguna tidak ditemukan");

            return this.sendSuccess(res, 200, "Berhasil", user);
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };

    // U - Update
    update = async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) return this.sendError(res, 404, "Pengguna tidak ditemukan");

            // Hanya update nama (jangan update email/password lewat sini untuk keamanan)
            const { name, role } = req.body;
            await user.update({ name, role });

            // Hapus password dari objek sebelum dikembalikan ke client
            const updatedUser = user.toJSON();
            delete updatedUser.password;

            return this.sendSuccess(res, 200, "Pengguna berhasil diupdate", updatedUser);
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };

    // D - Delete
    delete = async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) return this.sendError(res, 404, "Pengguna tidak ditemukan");

            await user.destroy();
            return this.sendSuccess(res, 200, "Pengguna berhasil dihapus");
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };
}
// Export instance dari class
export default new AuthController();