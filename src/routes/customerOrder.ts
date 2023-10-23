import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
//Controller functions
import {
  getAllCustomerOrders,
  getCustomerOrderByCustomerOrderId,
  getCustomerOrderByBookingReference,
  getAllUpcomingCustomerOrderByCustomerController,
  getPastCustomerOrderByCustomerController,
} from "../controllers/customerOrderController";

const router = express.Router();

router.use(authMiddleware);

router.get("/getAllCustomerOrders", getAllCustomerOrders);
router.get("/getOrderById/:customerOrderId", getCustomerOrderByCustomerOrderId);
router.get(
  "/getOrderByBookingReference/:bookingReference",
  getCustomerOrderByBookingReference,
);

router.get(
  "/getAllUpcomingCustomerOrderByCustomer",
  getAllUpcomingCustomerOrderByCustomerController,
);

router.get(
  "/getPastCustomerOrderByCustomer",
  getPastCustomerOrderByCustomerController,
);

export default router;
