import express from "express";

// Controller functions
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  addHubToFacility,
  createFacility,
  updateFacility,
  addSensorToHub,
  initializeHub
} from "../controllers/assetFacilityController";

const router = express.Router();

router.put("/initializeHub", initializeHub);

router.use(authMiddleware);

router.put("/createFacility", createFacility);
router.post("/updateFacility", updateFacility);
router.put("/addHub", addHubToFacility);
router.put("/addSensor", addSensorToHub);

export default router;
