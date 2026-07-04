import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const db = require('../models/index.cjs');
const { Ingredient, Sequelize } = db;
const { Op } = Sequelize;

import BaseController from './baseController.js';

class IngredientController extends BaseController {
    // C - Create
    create = async (req, res) => {
        try {
            const { name, nameEn, amount, unit } = req.body;
            const userId = req.user.id;
            const newIngredient = await Ingredient.create({ name, nameEn, amount, unit, userId });
            return this.sendSuccess(res, 201, "Bahan berhasil ditambahkan", newIngredient);
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
            const language = req.query.language === 'en' ? 'en' : 'id';

            const ingredients = await Ingredient.findAndCountAll({
                where: {
                    userId: req.user.id,
                    name: { [Op.like]: `%${search}%` }
                },
                limit: limit,
                offset: offset
            });

            const formattedData = ingredients.rows.map((item) => ({
                ...item.toJSON(),
                displayName: language === 'en' ? (item.nameEn || item.name) : (item.name || item.nameEn)
            }));

            return this.sendSuccess(res, 200, "Berhasil mengambil bahan", {
                totalData: ingredients.count,
                totalPages: Math.ceil(ingredients.count / limit),
                currentPage: page,
                data: formattedData
            });
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };

    // R - Read One by ID
    getById = async (req, res) => {
        try {
            const ingredient = await Ingredient.findByPk(req.params.id);
            if (!ingredient) return this.sendError(res, 404, "Bahan tidak ditemukan");
            const language = req.query.language === 'en' ? 'en' : 'id';
            return this.sendSuccess(res, 200, "Berhasil", {
                ...ingredient.toJSON(),
                displayName: language === 'en' ? (ingredient.nameEn || ingredient.name) : (ingredient.name || ingredient.nameEn)
            });
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };

    // U - Update
    update = async (req, res) => {
        try {
            const ingredient = await Ingredient.findByPk(req.params.id);
            if (!ingredient) return this.sendError(res, 404, "Bahan tidak ditemukan");

            if (String(ingredient.userId) != String(req.user.id)) {
                return this.sendError(res, 403, "Anda tidak memiliki izin untuk mengedit bahan")
            }

            const payload = req.body;
            await ingredient.update({
                ...(payload.name ? { name: payload.name } : {}),
                ...(payload.nameEn ? { nameEn: payload.nameEn } : {}),
                ...(payload.amount !== undefined ? { amount: payload.amount } : {}),
                ...(payload.unit !== undefined ? { unit: payload.unit } : {})
            });
            return this.sendSuccess(res, 200, "Bahan berhasil diupdate", ingredient);
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };

    // D - Delete
    delete = async (req, res) => {
        try {
            const ingredient = await Ingredient.findByPk(req.params.id);
            if (!ingredient) return this.sendError(res, 404, "Bahan tidak ditemukan");

            if (String(ingredient.userId) != String(req.user.id)) {
                return this.sendError(res, 403, "Anda tidak memiliki izin untuk menghapus bahan")
            }

            await ingredient.destroy();
            return this.sendSuccess(res, 200, "Bahan berhasil dihapus");
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };
}

export default new IngredientController();