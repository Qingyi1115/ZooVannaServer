import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import { optimizeItineraryRoute } from "../controllers/itineraryController";

const router = express.Router();

router.use(authMiddleware);

router.post("/optimizeItineraryRoute", optimizeItineraryRoute);

export default router;
