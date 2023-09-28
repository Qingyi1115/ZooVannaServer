import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
//Controller functions
import { createPromotion } from "../controllers/promotionController";

const router = express.Router();

router.use(authMiddleware);

router.post("/createPromotion", createPromotion);

export default router;
