import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
//Controller functions
import {
  createPromotion,
  getAllPromotions,
  getPromotionByPromotionId,
  updatePromotion,
  deletePromotion,
} from "../controllers/promotionController";

const router = express.Router();

router.use(authMiddleware);

router.post("/createPromotion", createPromotion);
router.get("/getAllPromotions", getAllPromotions);
router.get("/getPromotion/:promotionId", getPromotionByPromotionId);
router.put("/updatePromotion/:promotionId", updatePromotion);
router.delete("/deletePromotion/:promotionId", deletePromotion);

export default router;
