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
  deleteCustomerByEmail,
  purchaseTicketController,
  createCustomerOrderForCustomerController,
  completePaymentForCustomerController,
  createCustomerOrderForGuestController,
  completePaymentForGuestController,
  sendEmailVerification,
} from "../controllers/customerController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

//forgot password
router.post("/sendForgetPasswordLink/:email", sendForgetPasswordLink); //send reset password link to customer email
router.put("/resetForgottenPassword/:token", resetForgottenPasswordController); //reset from the customer side using email

//verify email before signup
router.get("/sendEmailVerification/:email", sendEmailVerification); //send reset password link to customer email

// sign up/create account
router.post("/createCustomer/:token", createCustomer);

// log in
router.post("/login", login);

router.post("/createTicket/:customerId", purchaseTicketController);
router.post(
  "/createCustomerOrderForGuest",
  createCustomerOrderForGuestController,
);
router.post(
  "/completePaymentForGuest/:customerOrderId",
  completePaymentForGuestController,
);

router.use(authMiddleware);

router.delete("/deleteCustomer/:customerId", deleteCustomer);
// router.get("/getCustomer/:customerId", getCustomerByCustomerId);
router.get("/getCustomer", getCustomerByEmail);
router.put("/updateCustomer/:customerId", updateCustomer);
router.put("/updatePassword/:customerId", updatePassword);
router.delete("/deleteCustomer", deleteCustomerByEmail);

router.post(
  "/createCustomerOrderForCustomer",
  createCustomerOrderForCustomerController,
);

router.post(
  "/completePaymentForCustomer/:customerOrderId",
  completePaymentForCustomerController,
);

export default router;
