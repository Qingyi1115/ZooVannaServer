import express from "express";

// Controller functions
import {
  login,
  // loginWithUsername,
  createCustomer,
  retrieveCustomerAccountDetails,
  updateCustomerAccount,
  retrieveAllCustomerDetails,
} from "../controllers/customerController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// sign up/create account
router.post("/createCustomer", createCustomer);

// log in
router.post("/login", login);

router.use(authMiddleware);

router.put("/retrieveCustomerAccountDetails", retrieveCustomerAccountDetails);
router.put("/updateCustomerAccount", updateCustomerAccount);
router.put("/retrieveAllCustomerDetails", retrieveAllCustomerDetails);

export default router;
