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
  deleteFacilityLogController,
  updateSensorMaintenanceLogController,
  deleteSensorMaintenanceLogController,
  getFacilityLogByIdController,
  getSensorMaintenanceLogController,
  createNewZoneController,
  getAllZoneController,
  getZoneByIdController,
  updateZoneController,
  deleteZoneController,
  completeRepairTicketController,
  getAllFacilityCustomer,
  createCustomerReportController,
  getAllCustomerReportsController,
  updateCustomerReportController,
} from "../controllers/assetFacilityController";

const router = express.Router();

// IP device API
router.put("/initializeHub", initializeHubController);
router.post("/pushSensorReadings/:processorName", pushSensorReadingsController);
router.post("/getAllFacilityCustomer", getAllFacilityCustomer);
// Customer Report
router.post("/createCustomerReportLog/:facilityId", createCustomerReportController);

router.use(authMiddleware);

// Zone
router.post("/createNewZone", createNewZoneController);
router.get("/getAllZone", getAllZoneController);
router.get("/getZone/:zoneId", getZoneByIdController);
router.put("/updateZone/:zoneId", updateZoneController);
router.delete("/deleteZone/:zoneId", deleteZoneController);

// Facilities
router.post("/createFacility", createFacilityController);
router.post("/getAllFacility", getAllFacilityController);
router.get("/getMyOperationFacility", getMyOperationFacilityController);
router.get("/getMyMaintainedFacility", getMyMaintainedFacilityController);
router.post("/getFacility/:facilityId", getFacilityController);
router.get(
  "/getFacilityMaintenanceSuggestions",
  getFacilityMaintenanceSuggestionsController,
);
router.get(
  "/getFacilityMaintenancePredictionValues/:facilityId",
  getFacilityMaintenancePredictionValuesController,
);
router.put("/updateFacility/:facilityId", updateFacilityController);
router.delete("/deleteFacility/:facilityId", deleteFacilityController);
router.get(
  "/getAssignedMaintenanceStaffOfFacility/:facilityId",
  getAssignedMaintenanceStaffOfFacilityController,
);
router.get("/getAllMaintenanceStaff", getAllMaintenanceStaffController);
router.put(
  "/assignMaintenanceStaffToFacility/:facilityId",
  assignMaintenanceStaffToFacilityController,
);
router.delete(
  "/removeMaintenanceStaffFromFacility/:facilityId",
  removeMaintenanceStaffFromFacilityController,
);
router.put(
  "/assignOperationStaffToFacility/:facilityId",
  assignOperationStaffToFacilityController,
);
router.delete(
  "/removeOperationStaffFromFacility/:facilityId",
  removeOperationStaffFromFacilityController,
);

router.get("/getAllCustomerReportLogs", getAllCustomerReportsController);
router.put("/updateCustomerReportLogs", updateCustomerReportController);

//Facility Logs
router.post("/createFacilityLog/:facilityId", createFacilityLogController);
router.post(
  "/createFacilityMaintenanceLog/:facilityId",
  createFacilityMaintenanceLogController,
);
router.get("/getFacilityLogs/:facilityId", getFacilityLogsController);
router.post("/getFacilityLog/:facilityLogId", getFacilityLogByIdController);
router.put("/updateFacilityLog/:facilityLogId", updateFacilityLogController);
router.get(
  "/completeRepairTicket/:facilityLogId",
  completeRepairTicketController,
);
router.delete("/deleteFacilityLog/:facilityLogId", deleteFacilityLogController);

//Animal Feed
router.post("/createNewAnimalFeed", createNewAnimalFeedController);
router.get("/getAllAnimalFeed", getAllAnimalFeedController);
router.get("/getAnimalFeed/:animalFeedName", getAnimalFeedByNameController);
router.get("/getAnimalFeedById/:animalFeedId", getAnimalFeedByIdController);
router.put("/updateAnimalFeed", updateAnimalFeedController);
router.put("/updateAnimalFeedImage", updateAnimalFeedImageController); // dont use
router.delete(
  "/deleteAnimalFeed/:animalFeedName",
  deleteAnimalFeedByNameController,
);

// Enrichment Items
router.post("/createNewEnrichmentItem", createNewEnrichmentItemController);
router.get("/getAllEnrichmentItem", getAllEnrichmentItemController);
router.get(
  "/getEnrichmentItem/:enrichmentItemId",
  getEnrichmentItemByIdController,
);
router.put("/updateEnrichmentItem", updateEnrichmentItemController);
router.put("/updateEnrichmentItemImage", updateEnrichmentItemImageController);
router.delete(
  "/deleteEnrichmentItem/:enrichmentItemName",
  deleteEnrichmentItemByNameController,
);

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
router.get(
  "/getSensorMaintenanceSuggestions",
  getSensorMaintenanceSuggestionsController,
);
router.get(
  "/getSensorMaintenancePredictionValues/:sensorId",
  getSensorMaintenancePredictionValuesController,
);
// router.get("/getAssignedMaintenanceStaffOfSensor/:sensorId", getAssignedMaintenanceStaffOfSensorController);
router.put(
  "/assignMaintenanceStaffToSensor/:sensorId",
  assignMaintenanceStaffToSensorController,
);
router.put(
  "/removeMaintenanceStaffFromSensor/:sensorId",
  removeMaintenanceStaffFromSensorController,
);
router.put("/updateSensor/:sensorId", updateSensorController);
router.delete("/deleteSensor/:sensorId", deleteSensorController);

router.post(
  "/createSensorMaintenanceLog/:sensorId",
  createSensorMaintenanceLogController,
);
router.get(
  "/getSensorMaintenanceLog/:sensorMaintenanceLogId",
  getSensorMaintenanceLogController,
);
router.post(
  "/getAllSensorMaintenanceLogs/:sensorId",
  getAllSensorMaintenanceLogsController,
);
router.put(
  "/updateSensorMaintenanceLog/:sensorMaintenanceLogId",
  updateSensorMaintenanceLogController,
);
router.delete(
  "/deleteSensorMaintenanceLog/:sensorMaintenanceLogId",
  deleteSensorMaintenanceLogController,
);

router.get(
  "/getAuthorizationForCamera/:sensorId",
  getAuthorizationForCameraController,
);

export default router;
