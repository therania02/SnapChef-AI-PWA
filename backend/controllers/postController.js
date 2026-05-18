import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const db = require('../models/index.cjs');
const { Post, User, Comment, Sequelize } = db;
const { Op } = Sequelize;

import BaseController from './basecontroller.js';

class PostController extends BaseController {
    create = async (req, res) => {
        try {
            const { recipeName, description, image, privacy, userId } = req.body;
            const newPost = await Post.create({ recipeName, description, image, privacy, likes: 0, userId });
            return this.sendSuccess(res, 201, "Postingan berhasil dibuat", newPost);
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };

    getAll = async (req, res) => {
        try {
            const search = req.query.q || '';
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const posts = await Post.findAndCountAll({
                where: {
                    recipeName: { [Op.like]: `%${search}%` }
                },
                // PENTING: Tambahkan atribut virtual untuk menghitung komentar
                attributes: {
                    include: [
                        [
                            Sequelize.literal(`(SELECT COUNT(*) FROM Comments WHERE Comments.postId = Post.id)`),
                            'commentCount'
                        ]
                    ]
                },
                // PENTING: Join ke tabel User untuk mengambil nama
                include: [
                    {
                        model: User,
                        attributes: ['name'] 
                    }
                ],
                limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']]
            });

            // Map data agar userName tersedia langsung di root object
            const formattedData = posts.rows.map(post => {
                const p = post.toJSON();
                return {
                    ...p,
                    userName: p.User?.name || "Guest", // Mengambil hasil join
                    comments: parseInt(p.commentCount) || 0 // Mengambil hasil hitung subquery
                };
            });

            return this.sendSuccess(res, 200, "Berhasil mengambil postingan", {
                totalData: posts.count,
                totalPages: Math.ceil(posts.count / limit),
                currentPage: page,
                data: formattedData
            });
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };

    // Terapkan include yang sama pada getById agar saat buka detail data juga lengkap
    getById = async (req, res) => {
        try {
            const post = await Post.findByPk(req.params.id, {
                include: [{ model: User, attributes: ['name'] }],
                attributes: {
                    include: [
                        [Sequelize.literal(`(SELECT COUNT(*) FROM Comments WHERE Comments.postId = Post.id)`), 'commentCount']
                    ]
                }
            });

            if (!post) return this.sendError(res, 404, "Postingan tidak ditemukan");

            const p = post.toJSON();
            const formatted = {
                ...p,
                userName: p.User?.name || "Guest",
                comments: parseInt(p.commentCount) || 0
            };

            return this.sendSuccess(res, 200, "Berhasil", formatted);
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };

    update = async (req, res) => {
        try {
            const post = await Post.findByPk(req.params.id);
            if (!post) return this.sendError(res, 404, "Postingan tidak ditemukan");

            await post.update(req.body);
            return this.sendSuccess(res, 200, "Postingan berhasil diupdate", post);
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };

    delete = async (req, res) => {
        try {
            const post = await Post.findByPk(req.params.id);
            if (!post) return this.sendError(res, 404, "Postingan tidak ditemukan");

            await post.destroy();
            return this.sendSuccess(res, 200, "Postingan berhasil dihapus");
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };
}

export default new PostController();