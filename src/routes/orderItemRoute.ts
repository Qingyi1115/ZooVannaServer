import express from "express";
import {
  getDateOrderCount,
  getOrderByVerificationCode,
} from "../controllers/orderItemController";

const router = express.Router();

router.get("/getDateOrderCount", getDateOrderCount);
router.get(
  "/getOrderItemByVerificationCode/:verificationCode",
  getOrderByVerificationCode,
);

export default router;
