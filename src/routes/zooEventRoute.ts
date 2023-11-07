import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import {
    assignZooEventKeeper,
    autoAssignKeeperToZooEvent,
    createEmployeeAbsence,
    createPublicEvent,
    deleteZooEvent,
    getAllEmployeeAbsence,
    getAllPublicEvents,
    getAllZooEvents,
    getKeepersForZooEvent,
    getPublicEventById,
    getZooEventById,
    removeKeeperfromZooEvent,
    updatePublicEventById,
    updatePublicEventImageById,
    updateZooEventIncludeFuture,
    updateZooEventSingle,
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
router.get("/autoAssignKeeperToZooEvent", autoAssignKeeperToZooEvent);
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
router.put("/updatePublicEventImageById/:publicEventId", updatePublicEventImageById);


export default router;