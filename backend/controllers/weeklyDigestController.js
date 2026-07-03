import { createRequire } from "module";

const require = createRequire(import.meta.url);
const db = require("../models/index.cjs");

const { Scan, Recipe, CookingHistory } = db;

class WeeklyDigestController {
    getStats = async (req, res) => {
        try {
            if (String(req.user.id) !== String(req.params.userId)) {
                return res.status(403).json({
                    message: "Tidak memiliki akses"
                });
            }
            const userId = req.user.id;

            const now = new Date();

            const startOfWeek = new Date(now);
            startOfWeek.setHours(0, 0, 0, 0);
            startOfWeek.setDate(now.getDate() - 6);

            const startOfLastWeek = new Date(now);
            startOfLastWeek.setHours(0, 0, 0, 0);
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
                        [db.Sequelize.Op.gte]: startOfLastWeek,
                        [db.Sequelize.Op.lt]: startOfWeek
                    }
                }
            });

            const weeklyScans = await Scan.findAll({
                where: {
                    userId,
                    createdAt: {
                        [db.Sequelize.Op.gte]: startOfWeek
                    }
                }
            });

            let recipesThisWeek = 0;

            weeklyScans.forEach(scan => {

                try {

                    const recipes =
                        JSON.parse(
                            scan.rawRecipes || "[]"
                        );

                    recipesThisWeek += recipes.length;

                } catch {}

            });

            const lastWeekScans = await Scan.findAll({
                where: {
                    userId,
                    createdAt: {
                        [db.Sequelize.Op.gte]: startOfLastWeek,
                        [db.Sequelize.Op.lt]: startOfWeek
                    }
                }
            });

            let recipesLastWeek = 0;
            lastWeekScans.forEach(scan => {
                try {
                    const recipes = JSON.parse(scan.rawRecipes || '[]');
                    recipesLastWeek += recipes.length;
                } catch {}
            });

            const cookingsThisWeek =
            await CookingHistory.count({
                where: {
                    userId,
                    createdAt: {
                        [db.Sequelize.Op.gte]: startOfWeek
                    }
                }
            });

            const cookingsLastWeek =
            await CookingHistory.count({
                where: {
                    userId,
                    createdAt: {
                        [db.Sequelize.Op.gte]: startOfLastWeek,
                        [db.Sequelize.Op.lt]: startOfWeek
                    }
                }
            });

            const cookingHistory =
            await CookingHistory.findAll({
                where: {
                    userId,
                    createdAt: {
                        [db.Sequelize.Op.gte]: startOfWeek
                    }
                }
            });

            const ingredientCounter = {};
            cookingHistory.forEach(item => {
                const ingredients =
                    item.ingredients || [];

                ingredients.forEach(ingredient => {
                    const name =
                        ingredient.name
                            ?.toLowerCase()
                            ?.trim();

                    if (!name) return;

                    ingredientCounter[name] =
                        (ingredientCounter[name] || 0) + 1;

                });

            });

            const favoriteIngredient =
            Object.entries(
                ingredientCounter
            )
            .sort(
                (a,b) => b[1] - a[1]
            )[0];

            const savedRecipes = await Recipe.count({
                where: {
                    userId,
                    createdAt: {
                        [db.Sequelize.Op.gte]: startOfWeek
                    }
                }
            });

            const savedRecipesLastWeek = await Recipe.count({
                where: {
                    userId,
                    createdAt: {
                        [db.Sequelize.Op.gte]: startOfLastWeek,
                        [db.Sequelize.Op.lt]: startOfWeek
                    }
                }
            });

            const achievements = [];

            if(cookingsThisWeek >= 5) {
                achievements.push({
                    icon: "📚",
                    title: "Kolektor Resep"
                });
            }

            if(recipesThisWeek >= 50) {
                achievements.push({
                    icon: "🤖",
                    title: "AI Explorer"
                })
            }

            const calculateChange = (currentValue, previousValue) => {
                if (previousValue === 0) {
                    return currentValue === 0 ? 0 : 100;
                }

                return Math.round(((currentValue - previousValue) / previousValue) * 100);
            };

            const scanChange = calculateChange(scansThisWeek, scansLastWeek);
            const recipeChange = calculateChange(recipesThisWeek, recipesLastWeek);
            const cookingChange = calculateChange(cookingsThisWeek, cookingsLastWeek);
            const savedRecipeChange = calculateChange(savedRecipes, savedRecipesLastWeek);

            res.json({
                scans: scansThisWeek,
                recipes: recipesThisWeek,
                cookings: cookingsThisWeek,
                savedRecipes,
                scanChange,
                recipeChange,
                cookingChange,
                savedRecipeChange,
                favoriteIngredient: favoriteIngredient ? { name: favoriteIngredient[0], count: favoriteIngredient[1] } : null,
                achievements
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