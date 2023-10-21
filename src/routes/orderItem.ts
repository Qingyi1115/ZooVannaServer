import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getDateOrderCountController } from "../controllers/orderItemController";

const router = express.Router();

router.get("/getDateOrderCount", getDateOrderCountController);

export default router;
