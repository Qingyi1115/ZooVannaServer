import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createItinerary,
  editItinerary,
  getFacilitiesInOrder,
  getItineraryById,
  optimizeItineraryRoute,
  removeItineraryById,
} from "../controllers/itineraryController";

const router = express.Router();

router.use(authMiddleware);

router.post("/optimizeItineraryRoute", optimizeItineraryRoute);
router.post("/createItinerary", createItinerary);
router.get("/getItineraryById/:itineraryId", getItineraryById);
router.delete("/deleteItinerary/:itineraryId", removeItineraryById);
router.put("/editItinerary/:itineraryId", editItinerary);
router.get("/getFacilitiesInOrder/:itineraryId", getFacilitiesInOrder);

export default router;
