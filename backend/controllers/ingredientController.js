import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const db = require('../models/index.cjs');
const { Ingredient, Sequelize } = db;
const { Op } = Sequelize;

import BaseController from './basecontroller.js';

class IngredientController extends BaseController {
    // C - Create
    create = async (req, res) => {
        try {
            const { name, amount, unit, userId } = req.body;
            const newIngredient = await Ingredient.create({ name, amount, unit, userId });
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

            const ingredients = await Ingredient.findAndCountAll({
                where: {
                    name: { [Op.like]: `%${search}%` }
                },
                limit: limit,
                offset: offset
            });

            return this.sendSuccess(res, 200, "Berhasil mengambil bahan", {
                totalData: ingredients.count,
                totalPages: Math.ceil(ingredients.count / limit),
                currentPage: page,
                data: ingredients.rows
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
            return this.sendSuccess(res, 200, "Berhasil", ingredient);
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };

    // U - Update
    update = async (req, res) => {
        try {
            const ingredient = await Ingredient.findByPk(req.params.id);
            if (!ingredient) return this.sendError(res, 404, "Bahan tidak ditemukan");

            await ingredient.update(req.body);
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

            await ingredient.destroy();
            return this.sendSuccess(res, 200, "Bahan berhasil dihapus");
        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };
}

export default new IngredientController();