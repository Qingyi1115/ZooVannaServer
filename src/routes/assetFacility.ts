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
  updateAnimalFeedController,
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
  deleteSensor,
  getAuthorizationForCamera,
  getAllFacilityController,
  deleteFacility,
  assignMaintenanceStaffToSensor,
  removeMaintenanceStaffFromSensor,
  assignMaintenanceStaffToFacility,
  removeMaintenanceStaffFromFacility,
  assignOperationStaffToFacility,
  removeOperationStaffFromFacility,
  getFacilityMaintenanceSuggestions,
  getSensorMaintenanceSuggestions,
  updateAnimalFeedImageController,
  getFacilityController,
  getAssignedMaintenanceStaffOfFacilityController,
  getAllMaintenanceStaffController
} from "../controllers/assetFacilityController";

const router = express.Router();

// IP device API
router.put("/initializeHub", initializeHub);

router.use(authMiddleware);

// Facilities
router.post("/createFacility", createFacility);
router.post("/getAllFacility", getAllFacilityController);
router.post("/getFacility/:facilityId", getFacilityController);
router.get("/getFacilityMaintenanceSuggestions", getFacilityMaintenanceSuggestions);
router.put("/updateFacility/:facilityId", updateFacility);
router.delete("/deleteFacility/:facilityId", deleteFacility);
router.get("/getAssignedMaintenanceStaffOfFacility/:facilityId", getAssignedMaintenanceStaffOfFacilityController);
router.get("/getAllMaintenanceStaff/", getAllMaintenanceStaffController);
router.get("/assignMaintenanceStaffToFacility/:facilityId", assignMaintenanceStaffToFacility);
router.put("/removeMaintenanceStaffFromFacility/:facilityId", removeMaintenanceStaffFromFacility);
router.get("/assignOperationStaffToFacility/:facilityId", assignOperationStaffToFacility);
router.get("/removeOperationStaffFromFacility/:facilityId", removeOperationStaffFromFacility);

//Animal Feed
router.post("/createNewAnimalFeed", createNewAnimalFeed);
router.get("/getAllAnimalFeed", getAllAnimalFeed);
router.get("/getAnimalFeed/:animalFeedName", getAnimalFeedByName);
router.put("/updateAnimalFeed", updateAnimalFeedController);
router.put("/updateAnimalFeedImage", updateAnimalFeedImageController);
router.delete("/deleteAnimalFeed/:animalFeedName", deleteAnimalFeedByName);

// Enrichment Items
router.post("/createNewEnrichmentItem", createNewEnrichmentItem);
router.get("/getAllEnrichmentItem", getAllEnrichmentItem);
router.get("/getEnrichmentItem/:enrichmentItemName", getEnrichmentItemByName);
router.put("/updateEnrichmentItem", updateEnrichmentItem);
router.delete("/deleteEnrichmentItem/:enrichmentItemName", deleteEnrichmentItemByName);

// Hubs and Sensors
router.post("/addHub", addHubToFacility);
router.get("/getAllHubs", getAllHubs);
router.put("/updateHub/:hubId", updateHub);
router.delete("/deleteHub/:hubId", deleteHub);

router.post("/addSensor", addSensorToHub);
router.get("/getAllSensors", getAllSensors);
router.get("/getSensorReading/:sensorId", getSensorReading);
router.get("/getSensorMaintenanceSuggestions", getSensorMaintenanceSuggestions);
router.get("/assignMaintenanceStaffToSensor/:sensorId", assignMaintenanceStaffToSensor);
router.get("/removeMaintenanceStaffFromSensor/:sensorId", removeMaintenanceStaffFromSensor);
router.put("/updateSensor/:sensorId", updateSensor);
router.delete("/deleteSensor/:sensorId", deleteSensor);

router.get("/getAuthorizationForCamera", getAuthorizationForCamera);

export default router;
