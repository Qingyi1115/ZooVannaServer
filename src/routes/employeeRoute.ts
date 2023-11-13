import express from "express";

// Controller functions
import {
  login,
  createEmployee,
  getEmployee,
  setAccountManager,
  getAllEmployees,
  resetPassword,
  disableEmployeeAccount,
  resetForgottenPassword,
  unsetAccountManager,
  enableRole,
  disableRole,
  // updateGeneralStaffType,
  // updatePlanningStaffType,
  updateEmployeeAccount,
  updateEmployeePassword,
  getSelf,
  updateRoleType,
  updateSpecializationType,
  getAllGeneralStaffs,
  verifyToken,
} from "../controllers/employeeController";
import {
  addEnclosureToKeeper,
  getAllKeepers,
  removeEnclosureFromKeeper,
  // updateKeeperType,
} from "../controllers/keeperController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// sign up/create account

// log in
router.post("/login", login);
router.put("/resetForgottenPassword/:token", resetForgottenPassword); //Reset from the employee side using email
router.get("/verifyToken/:token", verifyToken);

router.use(authMiddleware);

// Employee common infra : employee self use only (No role required)
router.put("/updateEmployeePassword", updateEmployeePassword);
router.get("/getEmployee", getSelf);
router.post("/createEmployee", createEmployee);
router.get("/getEmployee/:employeeId", getEmployee);
router.put("/updateEmployeeAccount", updateEmployeeAccount);
router.put("/setAccountManager/:employeeId", setAccountManager);
router.put("/unsetAccountManager/:employeeId", unsetAccountManager);

router.post("/getAllEmployees", getAllEmployees);
router.post("/getAllGeneralStaffs", getAllGeneralStaffs);
router.put("/resetPassword/:employeeId", resetPassword); //reset password by account manager (sent to employee's email)
router.put("/disableEmployee/:employeeId", disableEmployeeAccount);

//Enable and disable role (can be Keeper, General Staff or Planning Staff)
router.put("/getEmployee/:employeeId/enableRole", enableRole);
router.put("/getEmployee/:employeeId/disableRole", disableRole);

router.put("/getEmployee/:employeeId/updateRoleType", updateRoleType);
router.put(
  "/getEmployee/:employeeId/updateSpecializationType",
  updateSpecializationType,
);

//Update Employee Role Details
//Update Keeper Role --> Assign more enclosures or delete the enclosures --> for future use if needed
router.put("/getEmployee/:employeeId/addEnclosure", addEnclosureToKeeper);
router.put(
  "/getEmployee/:employeeId/removeEnclosure",
  removeEnclosureFromKeeper,
);

router.get("/getAllKeepers", getAllKeepers);
// router.put("getEmployee/:employeeId/updateKeeperType", updateKeeperType);
// router.put("getEmployee/:employeeId/updateGeneralStaffType", updateGeneralStaffType);
// router.put("getEmployee/:employeeId/updatePlanningStaffType", updatePlanningStaffType);

//router.put("/changeSpecializationType/:employeeId", ) --> change specialization type for planning and keeper staff

export default router;
