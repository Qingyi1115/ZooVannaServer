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
  resetForgottenPassword,
  deleteCustomerByEmail,
  purchaseTicket,
  createCustomerOrderForCustomer,
  completePaymentForCustomer,
  createCustomerOrderForGuest,
  completePaymentForGuest,
  sendEmailVerification,
  verifyToken,
} from "../controllers/customerController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

//forgot password
router.post("/sendForgetPasswordLink/:email", sendForgetPasswordLink); //send reset password link to customer email
router.put("/resetForgottenPassword/:token", resetForgottenPassword); //reset from the customer side using email
//verify token
router.get("/verifyToken/:token", verifyToken);

//verify email before signup
router.get("/sendEmailVerification/:email", sendEmailVerification); //send reset password link to customer email

// sign up/create account
router.post("/createCustomer/:token", createCustomer);

// log in
router.post("/login", login);

router.post("/createTicket/:customerId", purchaseTicket);
router.post("/createCustomerOrderForGuest", createCustomerOrderForGuest);
router.post(
  "/completePaymentForGuest/:customerOrderId",
  completePaymentForGuest,
);

router.use(authMiddleware);

router.delete("/deleteCustomer/:customerId", deleteCustomer);
// router.get("/getCustomer/:customerId", getCustomerByCustomerId);
router.get("/getCustomer", getCustomerByEmail);
router.put("/updateCustomer/:customerId", updateCustomer);
router.put("/updatePassword/:customerId", updatePassword);
router.delete("/deleteCustomer", deleteCustomerByEmail);

router.post("/createCustomerOrderForCustomer", createCustomerOrderForCustomer);

router.post(
  "/completePaymentForCustomer/:customerOrderId",
  completePaymentForCustomer,
);

export default router;
