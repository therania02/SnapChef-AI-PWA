import express from "express";
import weeklyDigestController from "../controllers/weeklyDigestController.js";

const router = express.Router();

router.get("/:userId", weeklyDigestController.getStats);

export default router;