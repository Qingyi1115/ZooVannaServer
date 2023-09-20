import express from "express";

// Controller functions
import {
  login,
  createEmployeeController,
  getEmployeeController,
  setAccountManagerController,
  getAllEmployeesController,
  resetPasswordController,
  disableEmployeeAccountController,
  resetForgottenPasswordController,
  unsetAccountManagerController,
  enableRoleController,
  disableRoleController,
  updateGeneralStaffTypeController,
  updatePlanningStaffTypeController,
} from "../controllers/employeeController";
import {
  addEnclosureToKeeperController,
  removeEnclosureFromKeeperController,
  updateKeeperTypeController,
} from "../controllers/keeperController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// sign up/create account

// log in
router.post("/login", login);
router.put("resetForgottenPassword/:token", resetForgottenPasswordController); //Reset from the employee side using email

router.use(authMiddleware);

router.post("/createEmployee", createEmployeeController);
router.get("/getEmployee/:employeeId", getEmployeeController);
router.put("/setAccountManager/:employeeId", setAccountManagerController);
router.put("/unsetAccountManager/:employeeId", unsetAccountManagerController);

router.post("/getAllEmployees", getAllEmployeesController);
router.put("/resetPassword/:employeeId", resetPasswordController ); //reset password by account manager (sent to employee's email)
router.put("/disableEmployee/:employeeId", disableEmployeeAccountController);

//Enable and disable role (can be Keeper, General Staff or Planning Staff)
router.put("/getEmployee/:employeeId/enableRole", enableRoleController);
router.put("/getEmployee/:employeeId/disableRole", disableRoleController);


//Update Employee Role Details
//Update Keeper Role --> Assign more enclosures or delete the enclosures --> for future use if needed
router.put("getEmployee/:employeeId/addEnclosure/:enclosureId", addEnclosureToKeeperController);
router.put("getEmployee/:employeeId/removeEnclosure/:enclosureId", removeEnclosureFromKeeperController);

router.put("getEmployee/:employeeId/updateKeeperType", updateKeeperTypeController);
router.put("getEmployee/:employeeId/updateGeneralStaffType", updateGeneralStaffTypeController);
router.put("getEmployee/:employeeId/updatePlanningStaffType", updatePlanningStaffTypeController);

//router.put("/changeSpecializationType/:employeeId", ) --> change specialization type for planning and keeper staff

export default router;
