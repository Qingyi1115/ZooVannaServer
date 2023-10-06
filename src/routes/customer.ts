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
} from "../controllers/customerController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/sendForgetPasswordLink/:email", sendForgetPasswordLink); //reset password by account manager (sent to employee's email)
router.put("/resetForgottenPassword/:token", resetForgottenPasswordController); //Reset from the customer side using email
// sign up/create account
router.post("/createCustomer", createCustomer);

// log in
router.post("/login", login);
router.post("/createTicket/:customerId", purchaseTicketController);
router.post("/getCustomer", getCustomerByEmail);
router.post(
  "/createCustomerOrderForGuest",
  createCustomerOrderForGuestController,
);
router.post(
  "/completePaymentForGuest/:customerOrderId",
  completePaymentForGuestController,
);
router.post(
  "/createCustomerOrderForCustomer",
  createCustomerOrderForCustomerController,
);
router.post(
  "/completePaymentForCustomer/:customerOrderId",
  completePaymentForGuestController,
);

router.use(authMiddleware);

router.delete("/deleteCustomer/:customerId", deleteCustomer);
// router.get("/getCustomer/:customerId", getCustomerByCustomerId);
router.put("/updateCustomer/:customerId", updateCustomer);
router.put("/updatePassword/:customerId", updatePassword);
router.delete("/deleteCustomer", deleteCustomerByEmail);

export default router;
