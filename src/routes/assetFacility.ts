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
  deleteEnrichmentItemByName,
  getAllHubs,
  getAllSensors,
  getSensorReading,
  updateHub,
  updateSensor,
  deleteHub,
  deleteSensor
} from "../controllers/assetFacilityController";

const router = express.Router();

router.put("/initializeHub", initializeHub);

router.use(authMiddleware);

router.put("/createFacility", createFacility);
router.post("/updateFacility/:facilityId", updateFacility);

//Assets
router.post("/createNewAnimalFeed", createNewAnimalFeed);
router.get("/getAllAnimalFeed", getAllAnimalFeed);
router.get("/getAnimalFeed/:animalFeedName", getAnimalFeedByName);
router.put("/updateAnimalFeed", updateAnimalFeed);
router.delete("/deleteAnimalFeed/:animalFeedName", deleteAnimalFeedByName);

router.post("/createNewEnrichmentItem", createNewEnrichmentItem);
router.get("/getAllEnrichmentItem", getAllEnrichmentItem);
router.get("/getEnrichmentItem/:enrichmentItemName", getEnrichmentItemByName);
router.put("/updateEnrichmentItem", updateEnrichmentItem);
router.delete("/deleteEnrichmentItem/:enrichmentItemName", deleteEnrichmentItemByName);

router.post("/createNewEnrichmentItem", createNewEnrichmentItem);
router.get("/getAllEnrichmentItem", getAllEnrichmentItem);
router.get("/getEnrichmentItem/:enrichmentItemName", getEnrichmentItemByName);
router.put("/updateEnrichmentItem", updateEnrichmentItem);
router.delete("/deleteEnrichmentItem/:enrichmentItemName", deleteEnrichmentItemByName);

router.put("/addHub", addHubToFacility);
router.put("/addSensor", addSensorToHub);
router.get("/getAllHubs", getAllHubs);
router.get("/getAllSensors", getAllSensors);
router.get("/getSensorReading/:sensorId", getSensorReading);
router.put("/updateHub/:hubId", updateHub);
router.put("/updateSensor/:sensorId", updateSensor);
router.delete("/deleteHub/:hubId", deleteHub);
router.delete("/deleteSensor/:sensorId", deleteSensor);

export default router;
