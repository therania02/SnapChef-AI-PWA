import BaseController from "./baseController.js";
import db from "../models/index.cjs";

const { User, CookingHistory } = db;

class CookingController extends BaseController {
  startCooking = async (req, res) => {
    try {

        const {
        recipeName,
        ingredients
        } = req.body;

        const user = await User.findByPk(
        req.user.id
        );

        if (!user) {
        return this.sendError(
            res,
            404,
            "User tidak ditemukan"
        );
        }

        await CookingHistory.create({
        recipeName,
        ingredients,
        userId: user.id
        });

        user.cookingCount += 1;

        await user.save();

        return this.sendSuccess(
        res,
        200,
        "Cooking berhasil dicatat",
        {
            cookingCount: user.cookingCount
        }
        );

    } catch (error) {

        console.error(error);

        return this.sendError(
        res,
        500,
        error.message
        );

    }
  };
}

export default new CookingController();