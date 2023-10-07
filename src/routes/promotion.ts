import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
//Controller functions
import {
  createPromotion,
  getAllPromotions,
  getPromotionByPromotionId,
  updatePromotion,
  deletePromotion,
  verifyPromotionCode,
  // usePromotionCode,
  cancelUsePromotionCode,
  getAllActivePromotions,
  getAllPublishedPromotions,
} from "../controllers/promotionController";

const router = express.Router();

router.get("/getAllPublishedPromotions", getAllPublishedPromotions);
router.get("/getAllActivePromotions", getAllActivePromotions);
router.get("/getPromotion/:promotionId", getPromotionByPromotionId);
router.put("/verifyPromotionCode/:promotionCode", verifyPromotionCode);
// router.put("/usePromotionCode/:promotionCode", usePromotionCode);
router.put("/cancelUsePromotionCode/:promotionCode", cancelUsePromotionCode);

router.use(authMiddleware);

router.post("/createPromotion", createPromotion);
router.get("/getAllPromotions", getAllPromotions);
router.put("/updatePromotion/:promotionId", updatePromotion);
router.delete("/deletePromotion/:promotionId", deletePromotion);

export default router;
