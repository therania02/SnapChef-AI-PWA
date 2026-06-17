import { createRequire } from "module";

const require = createRequire(import.meta.url);
const db = require("../models/index.cjs");

const { Scan, Recipe, Post } = db;

class WeeklyDigestController {
    getStats = async (req, res) => {
        try {

            const { userId } = req.params;

            const now = new Date();

            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - 7);

            const startOfLastWeek = new Date(now);
            startOfLastWeek.setDate(now.getDate() - 14);

            const scansThisWeek = await Scan.count({
                where: {
                    userId,
                    createdAt: {
                        [db.Sequelize.Op.gte]: startOfWeek
                    }
                }
            });

            const scansLastWeek = await Scan.count({
                where: {
                    userId,
                    createdAt: {
                        [db.Sequelize.Op.between]: [
                            startOfLastWeek,
                            startOfWeek
                        ]
                    }
                }
            });

            const recipesThisWeek = await Recipe.count({
                where: {
                    userId
                }
            });

            const cookingsThisWeek = await Post.count({
                where: {
                    userId
                }
            });

            const savedRecipes = recipesThisWeek;

            const scanChange =
                scansLastWeek === 0
                    ? 100
                    : Math.round(
                        ((scansThisWeek - scansLastWeek) /
                            scansLastWeek) *
                        100
                    );

            res.json({
                scans: scansThisWeek,
                recipes: recipesThisWeek,
                cookings: cookingsThisWeek,
                savedRecipes,
                scanChange
            });

        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: error.message
            });
        }
    };
}

export default new WeeklyDigestController();