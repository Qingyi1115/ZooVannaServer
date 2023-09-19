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
  resetForgottenPassword,
  unsetAccountManager,
} from "../controllers/employeeController";
import {
  addEnclosureToKeeper,
  removeEnclosureFromKeeper,
} from "../controllers/keeperController";
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
router.put("/setAccountManager/:employeeId", setAccountManager);
router.put("/unsetAccountManager/:employeeId", unsetAccountManager);

router.get("/retrieveAllEmployees", retrieveAllEmployees);
router.put("/resetPassword/:employeeId", resetPasswords );
router.put("/disableEmployee/:employeeId", disableEmployee);

router.put("resetForgottenPassword/:token", resetForgottenPassword);

//Update Employee Role Details
//Update Keeper Role --> Assign more enclosures or delete the enclosures
router.put("retrieveEmployee/:employeeId/addEnclosure/:enclosureId", addEnclosureToKeeper);
router.put("retrieveEmployee/:employeeId/removeEnclosure/:enclosureId", removeEnclosureFromKeeper);

//router.put("/changeSpecializationType/:employeeId", ) --> change specialization type for planning and keeper staff

export default router;
