import express from "express";

// Controller functions
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  addHubToFacilityController,
  createFacilityController,
  updateFacilityController,
  addSensorToHubController,
  initializeHubController,
  createNewAnimalFeedController,
  getAllAnimalFeedController,
  getAnimalFeedByNameController,
  updateAnimalFeedController,
  deleteAnimalFeedByNameController,
  getAnimalFeedByIdController,
  createNewEnrichmentItemController,
  getAllEnrichmentItemController,
  getEnrichmentItemByIdController,
  updateEnrichmentItemImageController,
  updateEnrichmentItemController,
  deleteEnrichmentItemByNameController,
  getAllHubsController,
  getHubProcessorController,
  getAllSensorsController,
  getSensorReadingController,
  updateHubController,
  updateSensorController,
  deleteHubController,
  deleteSensorController,
  getAuthorizationForCameraController,
  getAllFacilityController,
  deleteFacilityController,
  assignMaintenanceStaffToSensorController,
  removeMaintenanceStaffFromSensorController,
  assignMaintenanceStaffToFacilityController,
  removeMaintenanceStaffFromFacilityController,
  assignOperationStaffToFacilityController,
  removeOperationStaffFromFacilityController,
  getFacilityMaintenanceSuggestionsController,
  getSensorMaintenanceSuggestionsController,
  updateAnimalFeedImageController,
  getFacilityController,
  getAssignedMaintenanceStaffOfFacilityController,
  getAllMaintenanceStaffController,
  createSensorMaintenanceLogController,
  getAllSensorMaintenanceLogsController,
  getMyOperationFacilityController,
  getMyMaintainedFacilityController,
  getFacilityLogsController,
  createFacilityLogController,
  getSensorController,
  createFacilityMaintenanceLogController,
  pushSensorReadingsController,
  getSensorMaintenancePredictionValuesController,
  getFacilityMaintenancePredictionValuesController,
  updateFacilityLogController,
  deleteFacilityLogController
} from "../controllers/assetFacilityController";

const router = express.Router();

// IP device API
router.put("/initializeHub", initializeHubController);
router.post("/pushSensorReadings/:processorName", pushSensorReadingsController);

router.use(authMiddleware);

// Facilities
router.post("/createFacility", createFacilityController);
router.post("/getAllFacility", getAllFacilityController);
router.get("/getMyOperationFacility", getMyOperationFacilityController);
router.get("/getMyMaintainedFacility", getMyMaintainedFacilityController);
router.post("/getFacility/:facilityId", getFacilityController);
router.get("/getFacilityMaintenanceSuggestions", getFacilityMaintenanceSuggestionsController);
router.get("/getFacilityMaintenancePredictionValues/:facilityId", getFacilityMaintenancePredictionValuesController);
router.put("/updateFacility/:facilityId", updateFacilityController);
router.delete("/deleteFacility/:facilityId", deleteFacilityController);
router.get("/getAssignedMaintenanceStaffOfFacility/:facilityId", getAssignedMaintenanceStaffOfFacilityController);
router.get("/getAllMaintenanceStaff/", getAllMaintenanceStaffController);
router.put("/assignMaintenanceStaffToFacility/:facilityId", assignMaintenanceStaffToFacilityController);
router.delete("/removeMaintenanceStaffFromFacility/:facilityId", removeMaintenanceStaffFromFacilityController);
router.put("/assignOperationStaffToFacility/:facilityId", assignOperationStaffToFacilityController);
router.delete("/removeOperationStaffFromFacility/:facilityId", removeOperationStaffFromFacilityController);

router.get("/getFacilityLogs/:facilityId", getFacilityLogsController);
router.post("/createFacilityLog/:facilityId", createFacilityLogController);
router.post("/createFacilityMaintenanceLog/:facilityId", createFacilityMaintenanceLogController);
router.put("/updateFacilityLog/:facilityLogId", updateFacilityLogController);
router.delete("/deleteFacilityLog/:facilityId", deleteFacilityLogController);

//Animal Feed
router.post("/createNewAnimalFeed", createNewAnimalFeedController);
router.get("/getAllAnimalFeed", getAllAnimalFeedController);
router.get("/getAnimalFeed/:animalFeedName", getAnimalFeedByNameController);
router.get("/getAnimalFeedById/:animalFeedId", getAnimalFeedByIdController);
router.put("/updateAnimalFeed", updateAnimalFeedController);
router.put("/updateAnimalFeedImage", updateAnimalFeedImageController); // dont use
router.delete("/deleteAnimalFeed/:animalFeedName", deleteAnimalFeedByNameController);

// Enrichment Items
router.post("/createNewEnrichmentItem", createNewEnrichmentItemController);
router.get("/getAllEnrichmentItem", getAllEnrichmentItemController);
router.get("/getEnrichmentItem/:enrichmentItemId", getEnrichmentItemByIdController);
router.put("/updateEnrichmentItem", updateEnrichmentItemController);
router.put("/updateEnrichmentItemImage", updateEnrichmentItemImageController);
router.delete("/deleteEnrichmentItem/:enrichmentItemName", deleteEnrichmentItemByNameController);

// Hubs and Sensors
router.post("/addHub", addHubToFacilityController);
router.get("/getAllHubs", getAllHubsController);
router.post("/getHub/:hubProcessorId", getHubProcessorController);
router.put("/updateHub/:hubProcessorId", updateHubController);
router.delete("/deleteHub/:hubProcessorId", deleteHubController);

router.post("/addSensor", addSensorToHubController);
router.get("/getAllSensors", getAllSensorsController);
router.post("/getSensor/:sensorId", getSensorController);
router.post("/getSensorReading/:sensorId", getSensorReadingController);
router.get("/getSensorMaintenanceSuggestions", getSensorMaintenanceSuggestionsController);
router.get("/getSensorMaintenancePredictionValues/:sensorId", getSensorMaintenancePredictionValuesController);
// router.get("/getAssignedMaintenanceStaffOfSensor/:sensorId", getAssignedMaintenanceStaffOfSensorController);
router.put("/assignMaintenanceStaffToSensor/:sensorId", assignMaintenanceStaffToSensorController);
router.put("/removeMaintenanceStaffFromSensor/:sensorId", removeMaintenanceStaffFromSensorController);
router.put("/updateSensor/:sensorId", updateSensorController);
router.delete("/deleteSensor/:sensorId", deleteSensorController);

router.post("/createSensorMaintenanceLog/:sensorId", createSensorMaintenanceLogController);
router.post("/getAllSensorMaintenanceLogsController/:sensorId", getAllSensorMaintenanceLogsController);

router.post("/getAuthorizationForCamera", getAuthorizationForCameraController);

export default router;
