import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const db = require('../models/index.cjs');
const { Comment, Sequelize } = db;
const { Op } = Sequelize;

import BaseController from './basecontroller.js';

class CommentController extends BaseController {
    create = async (req, res) => {
        try {
            const { text, postId, userId } = req.body;
            const newComment = await Comment.create({ text, postId, userId });
            return this.sendSuccess(res, 201, "Komentar berhasil ditambahkan", newComment);
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };

    getAll = async (req, res) => {
        try {
            // Bisa filter berdasarkan postId melalui URL query: ?postId=1&page=1
            const postId = req.query.postId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const whereClause = postId ? { postId: postId } : {};

            const comments = await Comment.findAndCountAll({
                where: whereClause,
                limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']]
            });

            return this.sendSuccess(res, 200, "Berhasil mengambil komentar", {
                totalData: comments.count,
                totalPages: Math.ceil(comments.count / limit),
                currentPage: page,
                data: comments.rows
            });
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };

    getById = async (req, res) => {
        try {
            const comment = await Comment.findByPk(req.params.id);
            if (!comment) return this.sendError(res, 404, "Komentar tidak ditemukan");
            return this.sendSuccess(res, 200, "Berhasil", comment);
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };

    update = async (req, res) => {
        try {
            const comment = await Comment.findByPk(req.params.id);
            if (!comment) return this.sendError(res, 404, "Komentar tidak ditemukan");

            await comment.update(req.body);
            return this.sendSuccess(res, 200, "Komentar berhasil diupdate", comment);
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };

    delete = async (req, res) => {
        try {
            const comment = await Comment.findByPk(req.params.id);
            if (!comment) return this.sendError(res, 404, "Komentar tidak ditemukan");

            await comment.destroy();
            return this.sendSuccess(res, 200, "Komentar berhasil dihapus");
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };
}

export default new CommentController();