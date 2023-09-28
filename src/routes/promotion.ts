import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
//Controller functions
import {
  createPromotion,
  getAllPromotions,
  getPromotionByPromotionId,
} from "../controllers/promotionController";

const router = express.Router();

router.use(authMiddleware);

router.post("/createPromotion", createPromotion);
router.get("/getAllPromotions", getAllPromotions);
router.get("/getPromotion/:promotionId", getPromotionByPromotionId);

export default router;
