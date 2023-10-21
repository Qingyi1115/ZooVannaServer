import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
//Controller functions
import {
  getAllCustomerOrders,
  getCustomerOrderByCustomerOrderId,
  getCustomerOrderByBookingReference,
  getTotalCustomerOrder,
} from "../controllers/customerOrderController";

const router = express.Router();

router.use(authMiddleware);

router.post("/getAllCustomerOrders", getAllCustomerOrders);
router.post(
  "/getOrderById/:customerOrderId",
  getCustomerOrderByCustomerOrderId,
);
router.post(
  "/getOrderByBookingReference/:bookingReference",
  getCustomerOrderByBookingReference,
);
router.get("/getTotalCustomerOrder", getTotalCustomerOrder);

export default router;
