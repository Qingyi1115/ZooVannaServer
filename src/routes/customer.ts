import express from "express";

// Controller functions
import {
  login,
  // loginWithUsername,
  createCustomer,
  deleteCustomer,
  getCustomerByCustomerId,
  getCustomerByEmail,
  updateCustomer,
  updatePassword,
  sendForgetPasswordLink,
  resetForgottenPasswordController,
} from "../controllers/customerController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/sendForgetPasswordLink/:email", sendForgetPasswordLink); //reset password by account manager (sent to employee's email)
router.put("/resetForgottenPassword/:token", resetForgottenPasswordController); //Reset from the customer side using email
// sign up/create account
router.post("/createCustomer", createCustomer);

// log in
router.post("/login", login);

router.use(authMiddleware);

router.delete("/deleteCustomer/:customerId", deleteCustomer);
// router.get("/getCustomer/:customerId", getCustomerByCustomerId);
router.get("/getCustomer", getCustomerByEmail);
router.put("/updateCustomer/:customerId", updateCustomer);
router.put("/updatePassword/:customerId", updatePassword);

export default router;
