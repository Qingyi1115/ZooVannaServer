import express from "express";

//Controller functions
import { createPromotion } from "../controllers/promotionController";

import { authMiddleware } from "../middlewares/authMiddleware";
const router = express.Router();

router.use(authMiddleware);

router.post("/createPromotion", createPromotion);

export default router;
