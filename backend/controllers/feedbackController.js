import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const db = require('../models/index.cjs');

const { Feedback } = db;

import BaseController from './baseController.js';

class FeedbackController extends BaseController {

    create = async (req, res) => {
        try {
            const userId = req.user.id;
            const {
                rating,
                category,
                feedback
            } = req.body;

            const data = await Feedback.create({
                userId,
                rating,
                category,
                feedback
            });

            return this.sendSuccess(
                res,
                201,
                "Feedback berhasil dikirim",
                data
            );

        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };

    getAll = async (req, res) => {
        try {

            const data = await Feedback.findAll({
                order: [['createdAt', 'DESC']]
            });

            return this.sendSuccess(
                res,
                200,
                "Berhasil mengambil feedback",
                data
            );

        } catch (error) {
            return this.sendError(res, 500, error.message);
        }
    };
}

export default new FeedbackController();