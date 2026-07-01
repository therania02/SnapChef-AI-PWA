import express from "express";
import weeklyDigestController from "../controllers/weeklyDigestController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { premiumMiddleware } from "../middleware/premiumMiddleware.js";

const router = express.Router();

router.get("/:userId", authMiddleware, premiumMiddleware, weeklyDigestController.getStats);

export default router;