import express from "express";

// Controller functions
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  addHubToFacility,
  createFacility,
  updateFacility,
  addSensorToHub,
  initializeHub,
  createNewAnimalFeed,
  getAllAnimalFeed,
  getAnimalFeedByName,
  updateAnimalFeed,
  deleteAnimalFeedByName,
  createNewEnrichmentItem,
  getAllEnrichmentItem,
  getEnrichmentItemByName,
  updateEnrichmentItem,
  deleteEnrichmentItemByName
} from "../controllers/assetFacilityController";

const router = express.Router();

router.put("/initializeHub", initializeHub);

router.use(authMiddleware);

router.put("/createFacility", createFacility);
router.post("/updateFacility", updateFacility);
router.put("/addHub", addHubToFacility);
router.put("/addSensor", addSensorToHub);

//Assets
router.put("/createNewAnimalFeed", createNewAnimalFeed);
router.get("/getAllAnimalFeed", getAllAnimalFeed);
router.get("/getAnimalFeed/:animalFeedName", getAnimalFeedByName);
router.post("/updateAnimalFeed", updateAnimalFeed);
router.post("/deleteAnimalFeed/:animalFeedName", deleteAnimalFeedByName);

router.put("/createNewEnrichmentItem", createNewEnrichmentItem);
router.get("/getAllEnrichmentItem", getAllEnrichmentItem);
router.get("/getEnrichmentItem/:enrichmentItemName", getEnrichmentItemByName);
router.post("/updateEnrichmentItem", updateEnrichmentItem);
router.post("/deleteEnrichmentItem/:enrichmentItemName", deleteEnrichmentItemByName);

export default router;
