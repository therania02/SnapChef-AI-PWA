import express from "express";
import cookingController from "../controllers/cookingController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/start", authMiddleware, cookingController.startCooking);

export default router;