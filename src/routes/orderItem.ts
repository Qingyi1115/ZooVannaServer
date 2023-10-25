import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  getDateOrderCountController,
  getOrderByVerificationCodeController,
} from "../controllers/orderItemController";

const router = express.Router();

router.get("/getDateOrderCount", getDateOrderCountController);
router.get(
  "/getOrderItemByVerificationCode/:verificationCode",
  getOrderByVerificationCodeController,
);

export default router;
