import express from "express";

// Controller functions
import {
  login,
  createEmployee,
  retrieveEmployeeAccountDetails,
  updateEmployeeAccount,
  retrieveAllEmployeeDetails,
  setAccountManager,
  allEmployees,
} from "../controllers/employeeController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// sign up/create account

// log in
router.post("/login", login);

router.use(authMiddleware);

router.put("/createEmployee", createEmployee);
router.put("/retrieveEmployeeAccountDetails", retrieveEmployeeAccountDetails);
router.put("/updateEmployeeAccount", updateEmployeeAccount);
router.put("/retrieveAllEmployeeDetails", retrieveAllEmployeeDetails);
router.put("/createEmployee", createEmployee);
router.put("/setAccountManager", setAccountManager);
router.put("/allEmployees", allEmployees);
export default router;
