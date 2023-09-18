import express from "express";

// Controller functions
import {
  login,
  createEmployee,
  retrieveEmployee,
  updateEmployeeAccount,
  setAccountManager,
  retrieveAllEmployees,
  resetPasswords,
  disableEmployee,
  resetForgottenPassword
} from "../controllers/employeeController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// sign up/create account

// log in
router.post("/login", login);

router.use(authMiddleware);

router.post("/createEmployee", createEmployee);
router.get("/retrieveEmployee/:employeeId", retrieveEmployee);
router.put("/updateEmployeeAccount", updateEmployeeAccount);
router.post("/createEmployee", createEmployee);
router.put("/setAccountManager", setAccountManager);
router.get("/retrieveAllEmployees", retrieveAllEmployees);
router.put("/resetPassword/:employeeId", resetPasswords );
router.put("/disableEmployee/:employeeId", disableEmployee);

router.put("resetForgottenPassword/:token", resetForgottenPassword);

export default router;
