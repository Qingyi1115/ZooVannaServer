import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
//Controller functions
import {
  getAllCustomerOrders,
  getCustomerOrderByCustomerOrderId,
  getCustomerOrderByBookingReference,
  getAllUpcomingCustomerOrderByCustomer,
  getPastCustomerOrderByCustomer,
  getTotalCustomerOrder,
  getRevenueByMonth,
  getRevenueByDay,
  getNumberOfOrdersPerMonth,
  getNumberOfOrdersPerDay,
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

//for chart
//no. of tickets grouped by listing id &/ month
router.post("/getTotalCustomerOrder", getTotalCustomerOrder);
//revenue by month / day
router.post("/getRevenueByMonth", getRevenueByMonth);
router.post("/getRevenueByDay", getRevenueByDay);
//num of customer orders by month / day
router.post("/getNumberOfOrdersPerMonth", getNumberOfOrdersPerMonth);
router.post("/getNumberOfOrdersPerDay", getNumberOfOrdersPerDay);

router.get(
  "/getAllUpcomingCustomerOrderByCustomer",
  getAllUpcomingCustomerOrderByCustomer,
);

router.get(
  "/getPastCustomerOrderByCustomer",
  getPastCustomerOrderByCustomer,
);

export default router;
