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
  getAnimalFeedById,
  createNewEnrichmentItem,
  getAllEnrichmentItem,
  getEnrichmentItemById,
  updateEnrichmentItemImage,
  updateEnrichmentItem,
  deleteEnrichmentItemByName,
  getAllHubs,
  getHubProcessor,
  getAllSensors,
  getSensorReading,
  updateHub,
  updateSensor,
  deleteHub,
  deleteSensor,
  getAuthorizationForCamera,
  getAllFacility,
  deleteFacility,
  assignMaintenanceStaffToSensor,
  removeMaintenanceStaffFromSensor,
  assignMaintenanceStaffToFacility,
  removeMaintenanceStaffFromFacility,
  assignOperationStaffToFacility,
  removeOperationStaffFromFacility,
  getFacilityMaintenanceSuggestions,
  getSensorMaintenanceSuggestions,
  updateAnimalFeedImage,
  getFacility,
  getAssignedMaintenanceStaffOfFacility,
  getAllMaintenanceStaff,
  createSensorMaintenanceLog,
  getAllSensorMaintenanceLogs,
  getMyOperationFacility,
  getMyMaintainedFacility,
  getFacilityLogs,
  createFacilityLog,
  getSensor,
  createFacilityMaintenanceLog,
  pushSensorReadings,
  getSensorMaintenancePredictionValues,
  getFacilityMaintenancePredictionValues,
  updateFacilityLog,
  deleteFacilityLog,
  updateSensorMaintenanceLog,
  deleteSensorMaintenanceLog,
  getFacilityLogById,
  getSensorMaintenanceLog,
  createNewZone,
  getAllZone,
  getZoneById,
  updateZone,
  deleteZone,
  completeRepairTicket,
  getAllFacilityCustomer,
  getFacilityCustomer,
  createCustomerReport,
  getAllCustomerReports,
  updateCustomerReport,
  updateFacilityImage,
  getCustomerReportLog,
  getAllNonViewedCustomerReportLogs,
  markCustomerReportLogsViewed,
  deleteCustomerReportLog,
  getAllCustomerReportLogsByFacilityId,
  crowdLevelByFacilityId,
  getCrowdLevelOfAllFacility,
  getAuthorizationForCameraByFacilityId,
} from "../controllers/assetFacilityController";

const router = express.Router();

// IP device API
router.put("/initializeHub", initializeHub);
router.post("/pushSensorReadings/:processorName", pushSensorReadings);
router.post("/getAllFacilityCustomer", getAllFacilityCustomer);
router.post("/getFacilityCustomer/:facilityId", getFacilityCustomer);
router.get("/crowdLevelByFacilityId/:facilityId", crowdLevelByFacilityId);

// Customer Report
router.post("/createCustomerReportLog/:facilityId", createCustomerReport);

router.use(authMiddleware);

// Zone
router.post("/createNewZone", createNewZone);
router.get("/getAllZone", getAllZone);
router.get("/getZone/:zoneId", getZoneById);
router.put("/updateZone/:zoneId", updateZone);
router.delete("/deleteZone/:zoneId", deleteZone);

// Facilities
router.post("/createFacility", createFacility);
router.post("/getAllFacility", getAllFacility);
router.get("/getCrowdLevelOfAllFacility", getCrowdLevelOfAllFacility);
router.get("/getMyOperationFacility", getMyOperationFacility);
router.get("/getMyMaintainedFacility", getMyMaintainedFacility);
router.post("/getFacility/:facilityId", getFacility);
router.get(
  "/getFacilityMaintenanceSuggestions",
  getFacilityMaintenanceSuggestions,
);
router.get(
  "/getFacilityMaintenancePredictionValues/:facilityId",
  getFacilityMaintenancePredictionValues,
);
router.put("/updateFacility/:facilityId", updateFacility);
router.put("/updateFacilityImage/:facilityId", updateFacilityImage);
router.delete("/deleteFacility/:facilityId", deleteFacility);
router.get(
  "/getAssignedMaintenanceStaffOfFacility/:facilityId",
  getAssignedMaintenanceStaffOfFacility,
);
router.get("/getAllMaintenanceStaff", getAllMaintenanceStaff);
router.put(
  "/assignMaintenanceStaffToFacility/:facilityId",
  assignMaintenanceStaffToFacility,
);
router.delete(
  "/removeMaintenanceStaffFromFacility/:facilityId",
  removeMaintenanceStaffFromFacility,
);
router.put(
  "/assignOperationStaffToFacility/:facilityId",
  assignOperationStaffToFacility,
);
router.delete(
  "/removeOperationStaffFromFacility/:facilityId",
  removeOperationStaffFromFacility,
);

//Facility Logs
router.post("/createFacilityLog/:facilityId", createFacilityLog);
router.post(
  "/createFacilityMaintenanceLog/:facilityId",
  createFacilityMaintenanceLog,
);
router.get("/getFacilityLogs/:facilityId", getFacilityLogs);
router.post("/getFacilityLog/:facilityLogId", getFacilityLogById);
router.put("/updateFacilityLog/:facilityLogId", updateFacilityLog);
router.get(
  "/completeRepairTicket/:facilityLogId",
  completeRepairTicket,
);
router.delete("/deleteFacilityLog/:facilityLogId", deleteFacilityLog);

// Customer Report
router.get("/getAllCustomerReportLogs", getAllCustomerReports);
router.get("/getCustomerReportLog/:customerReportLogId", getCustomerReportLog);
router.get("/getAllNonViewedCustomerReportLogs", getAllNonViewedCustomerReportLogs);
router.get("/getAllCustomerReportLogsByFacilityId/:facilityId", getAllCustomerReportLogsByFacilityId);
router.put("/updateCustomerReportLogs", updateCustomerReport);
router.put("/markCustomerReportLogsViewed", markCustomerReportLogsViewed);
router.delete("/deleteCustomerReportLog/:customerReportLogId", deleteCustomerReportLog);

//Animal Feed
router.post("/createNewAnimalFeed", createNewAnimalFeed);
router.get("/getAllAnimalFeed", getAllAnimalFeed);
router.get("/getAnimalFeed/:animalFeedName", getAnimalFeedByName);
router.get("/getAnimalFeedById/:animalFeedId", getAnimalFeedById);
router.put("/updateAnimalFeed", updateAnimalFeed);
router.put("/updateAnimalFeedImage", updateAnimalFeedImage); // dont use
router.delete(
  "/deleteAnimalFeed/:animalFeedName",
  deleteAnimalFeedByName,
);

// Enrichment Items
router.post("/createNewEnrichmentItem", createNewEnrichmentItem);
router.get("/getAllEnrichmentItem", getAllEnrichmentItem);
router.get(
  "/getEnrichmentItem/:enrichmentItemId",
  getEnrichmentItemById,
);
router.put("/updateEnrichmentItem", updateEnrichmentItem);
router.put("/updateEnrichmentItemImage", updateEnrichmentItemImage);
router.delete(
  "/deleteEnrichmentItem/:enrichmentItemName",
  deleteEnrichmentItemByName,
);

// Hubs and Sensors
router.post("/addHub", addHubToFacility);
router.get("/getAllHubs", getAllHubs);
router.post("/getHub/:hubProcessorId", getHubProcessor);
router.put("/updateHub/:hubProcessorId", updateHub);
router.delete("/deleteHub/:hubProcessorId", deleteHub);

router.post("/addSensor", addSensorToHub);
router.get("/getAllSensors", getAllSensors);
router.post("/getSensor/:sensorId", getSensor);
router.post("/getSensorReading/:sensorId", getSensorReading);
router.get(
  "/getSensorMaintenanceSuggestions",
  getSensorMaintenanceSuggestions,
);
router.get(
  "/getSensorMaintenancePredictionValues/:sensorId",
  getSensorMaintenancePredictionValues,
);
// router.get("/getAssignedMaintenanceStaffOfSensor/:sensorId", getAssignedMaintenanceStaffOfSensor);
router.put(
  "/assignMaintenanceStaffToSensor/:sensorId",
  assignMaintenanceStaffToSensor,
);
router.put(
  "/removeMaintenanceStaffFromSensor/:sensorId",
  removeMaintenanceStaffFromSensor,
);
router.put("/updateSensor/:sensorId", updateSensor);
router.delete("/deleteSensor/:sensorId", deleteSensor);
router.post(
  "/createSensorMaintenanceLog/:sensorId",
  createSensorMaintenanceLog,
);
router.get(
  "/getSensorMaintenanceLog/:sensorMaintenanceLogId",
  getSensorMaintenanceLog,
);
router.post(
  "/getAllSensorMaintenanceLogs/:sensorId",
  getAllSensorMaintenanceLogs,
);
router.put(
  "/updateSensorMaintenanceLog/:sensorMaintenanceLogId",
  updateSensorMaintenanceLog,
);
router.delete(
  "/deleteSensorMaintenanceLog/:sensorMaintenanceLogId",
  deleteSensorMaintenanceLog,
);
router.get(
  "/getAuthorizationForCamera/:sensorId",
  getAuthorizationForCamera,
);
router.get(
  "/getAuthorizationForCameraByFacilityId/:facilityId",
  getAuthorizationForCameraByFacilityId,
);
export default router;
