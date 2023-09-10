import express from "express";

// Controller functions
import { authMiddleware } from "../middlewares/authMiddleware";
import { createFacility, updateFacility } from "../controllers/assetFacilityController";

const router = express.Router();

router.use(authMiddleware)

router.post("/createFacility", createFacility);
router.post("/updateFacility", updateFacility);

export default router;