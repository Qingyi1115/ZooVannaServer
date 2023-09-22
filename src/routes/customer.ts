import express from "express";

// Controller functions
import {
  login,
  // loginWithUsername,
  createCustomer,
  retrieveCustomerAccountDetails,
  updateCustomerAccount,
  retrieveAllCustomerDetails,
  deleteCustomerByEmail,
} from "../controllers/customerController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// sign up/create account

// log in
router.post("/login", login);
// router.post("/loginWithUsername", loginWithUsername);

router.use(authMiddleware);

router.put("/createCustomer", createCustomer);
router.put("/retrieveCustomerAccountDetails", retrieveCustomerAccountDetails);
router.put("/updateCustomerAccount", updateCustomerAccount);
router.put("/retrieveAllCustomerDetails", retrieveAllCustomerDetails);
router.delete("/deleteCustomer", deleteCustomerByEmail);

export default router;
