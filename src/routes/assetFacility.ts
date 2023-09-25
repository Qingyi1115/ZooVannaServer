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
  getAnimalFeedById,
  createNewEnrichmentItem,
  getAllEnrichmentItem,
  getEnrichmentItemByIdController,
  updateEnrichmentItemImageController,
  updateEnrichmentItemController,
  deleteEnrichmentItemByName,
  getAllHubs,
  getHubProcessorController,
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
  getAllMaintenanceStaffController,
  createSensorMaintenanceLogController,
  getAllSensorMaintenanceLogsController,
  getMyOperationFacilityController,
  getMyMaintainedFacilityController,
  getFacilityLogsController,
  createFacilityLogController
} from "../controllers/assetFacilityController";

const router = express.Router();

// IP device API
router.put("/initializeHub", initializeHub);

router.use(authMiddleware);

// Facilities
router.post("/createFacility", createFacility);
router.post("/getAllFacility", getAllFacilityController);
router.get("/getMyOperationFacility", getMyOperationFacilityController);
router.get("/getMyMaintainedFacility", getMyMaintainedFacilityController);
router.post("/getFacility/:facilityId", getFacilityController);
router.get("/getFacilityMaintenanceSuggestions", getFacilityMaintenanceSuggestions);
router.put("/updateFacility/:facilityId", updateFacility);
router.delete("/deleteFacility/:facilityId", deleteFacility);
router.get("/getAssignedMaintenanceStaffOfFacility/:facilityId", getAssignedMaintenanceStaffOfFacilityController);
router.get("/getAllMaintenanceStaff/", getAllMaintenanceStaffController);
router.put("/assignMaintenanceStaffToFacility/:facilityId", assignMaintenanceStaffToFacility);
router.put("/removeMaintenanceStaffFromFacility/:facilityId", removeMaintenanceStaffFromFacility);
router.put("/assignOperationStaffToFacility/:facilityId", assignOperationStaffToFacility);
router.put("/removeOperationStaffFromFacility/:facilityId", removeOperationStaffFromFacility);
router.put("/getFacilityLogs/:facilityId", getFacilityLogsController);
router.put("/createFacilityLog/:facilityId", createFacilityLogController);

//Animal Feed
router.post("/createNewAnimalFeed", createNewAnimalFeed);
router.get("/getAllAnimalFeed", getAllAnimalFeed);
router.get("/getAnimalFeed/:animalFeedName", getAnimalFeedByName);
router.get("/getAnimalFeedById/:animalFeedId", getAnimalFeedById);
router.put("/updateAnimalFeed", updateAnimalFeedController);
router.put("/updateAnimalFeedImage", updateAnimalFeedImageController); // dont use
router.delete("/deleteAnimalFeed/:animalFeedName", deleteAnimalFeedByName);

// Enrichment Items
router.post("/createNewEnrichmentItem", createNewEnrichmentItem);
router.get("/getAllEnrichmentItem", getAllEnrichmentItem);
router.get("/getEnrichmentItem/:enrichmentItemId", getEnrichmentItemByIdController);
router.put("/updateEnrichmentItem", updateEnrichmentItemController);
router.put("/updateEnrichmentItemImage", updateEnrichmentItemImageController);
router.delete("/deleteEnrichmentItem/:enrichmentItemName", deleteEnrichmentItemByName);

// Hubs and Sensors
router.post("/addHub", addHubToFacility);
router.get("/getAllHubs", getAllHubs);
router.post("/getHub/:hubProcessorId", getHubProcessorController);
router.put("/updateHub/:hubProcessorId", updateHub);
router.delete("/deleteHub/:hubProcessorId", deleteHub);

router.post("/addSensor", addSensorToHub);
router.get("/getAllSensors", getAllSensors);
router.get("/getSensorReading/:sensorId", getSensorReading);
router.get("/getSensorMaintenanceSuggestions", getSensorMaintenanceSuggestions);
router.put("/assignMaintenanceStaffToSensor/:sensorId", assignMaintenanceStaffToSensor);
router.put("/removeMaintenanceStaffFromSensor/:sensorId", removeMaintenanceStaffFromSensor);
router.put("/updateSensor/:sensorId", updateSensor);
router.delete("/deleteSensor/:sensorId", deleteSensor);
router.post("/createSensorMaintenanceLog/:sensorId", createSensorMaintenanceLogController);
router.get("/getAllSensorMaintenanceLogsController/:sensorId", getAllSensorMaintenanceLogsController);

router.get("/getAuthorizationForCamera", getAuthorizationForCamera);

export default router;
