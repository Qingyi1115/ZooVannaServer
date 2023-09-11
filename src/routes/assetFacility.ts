import express from "express";

// Controller functions
import { authMiddleware } from "../middlewares/authMiddleware";
import { addSensorToFacility, createFacility, updateFacility } from "../controllers/assetFacilityController";

const router = express.Router();

router.use(authMiddleware)

router.post("/createFacility", createFacility);
router.post("/updateFacility", updateFacility);
router.put("/addSensor", addSensorToFacility);

export default router;