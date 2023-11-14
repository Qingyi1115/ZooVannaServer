import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import {
  assignZooEventKeeper,
  autoAssignKeeperToZooEvent,
  createEmployeeAbsence,
  createPublicEvent,
  createPublicEventSession,
  deletePublicEventById,
  deleteZooEvent,
  getAllEmployeeAbsence,
  getAllPublicEventSessions,
  getAllPublicEventSessionsByPublicEventId,
  getAllPublicEvents,
  getAllZooEvents,
  getKeepersForZooEvent,
  getPublicEventById,
  getPublicEventSessionById,
  getZooEventById,
  removeKeeperfromZooEvent,
  updatePublicEventById,
  updatePublicEventImageById,
  updatePublicEventSessionById,
  updateZooEventIncludeFuture,
  updateZooEventSingle,
  deletePublicEventSessionById,
  enablePublicEventById,
  disablePublicEventById
} from "../controllers/zooEventController";

const router = express.Router();

router.use(authMiddleware);

// Zoo events
router.post("/getAllZooEvents", getAllZooEvents);
router.get("/getZooEventById/:zooEventId", getZooEventById);
router.put("/updateZooEventSingle/:zooEventId", updateZooEventSingle);
router.put("/updateZooEventIncludeFuture/:zooEventId", updateZooEventIncludeFuture);
router.put("/assignZooEventKeeper", assignZooEventKeeper);
router.put("/removeKeeperfromZooEvent", removeKeeperfromZooEvent);
router.post("/autoAssignKeeperToZooEvent", autoAssignKeeperToZooEvent);
router.delete("/deleteZooEvent/:zooEventId", deleteZooEvent);
router.get("/getKeepersForZooEvent/:zooEventId", getKeepersForZooEvent);

// Employee Absence
router.put("/createEmployeeAbsence/:employeeId", createEmployeeAbsence);
router.get("/getAllEmployeeAbsence", getAllEmployeeAbsence);

// Public Events
router.post("/createPublicEvent", createPublicEvent);
router.get("/getAllPublicEvents", getAllPublicEvents);
router.get("/getPublicEventById/:publicEventId", getPublicEventById);
router.put("/updatePublicEventById/:publicEventId", updatePublicEventById);
router.put("/enablePublicEventById/:publicEventId", enablePublicEventById);
router.put("/disablePublicEventById/:publicEventId", disablePublicEventById);
router.put("/updatePublicEventImageById/:publicEventId", updatePublicEventImageById);
router.delete("/deletePublicEventById/:publicEventId", deletePublicEventById);

// PublicEventSession
router.post("/createPublicEventSession/:publicEventId", createPublicEventSession);
router.get("/getAllPublicEventSessions", getAllPublicEventSessions);
router.get("/getAllPublicEventSessionsByPublicEventId/:publicEventId", getAllPublicEventSessionsByPublicEventId);
router.get("/getPublicEventSessionById/:publicEventSessionId", getPublicEventSessionById);
router.put("/updatePublicEventSessionById/:publicEventSessionId", updatePublicEventSessionById);
router.delete("/deletePublicEventSessionById/:publicEventSessionId", deletePublicEventSessionById);


export default router;