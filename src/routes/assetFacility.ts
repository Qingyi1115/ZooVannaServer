import express from "express";

// Controller functions
import { authMiddleware } from "../middlewares/authMiddleware";
import { createFacility } from "controllers/assetFacilityController";

const router = express.Router();

router.use(authMiddleware)

router.post("/createFacility", createFacility);

export default router;