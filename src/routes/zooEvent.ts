import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import { 
    assignZooEventKeeper,
    autoAssignKeeperToZooEvent,
    deleteZooEvent, 
    getAllZooEvents, 
    getZooEventById, 
    removeKeeperfromZooEvent, 
    updateZooEventIncludeFuture, 
    updateZooEventSingle,
 } from "../controllers/zooEventController";

const router = express.Router();

router.use(authMiddleware);

//species basic
router.post("/getAllZooEvents", getAllZooEvents);
router.get("/getZooEventById/:zooEventId", getZooEventById);
router.put("/updateZooEventSingle/:zooEventId", updateZooEventSingle);
router.put("/updateZooEventIncludeFuture/:zooEventId", updateZooEventIncludeFuture);
router.put("/assignZooEventKeeper", assignZooEventKeeper);
router.put("/removeKeeperfromZooEvent", removeKeeperfromZooEvent);
router.get("/autoAssignKeeperToZooEvent", autoAssignKeeperToZooEvent);
router.delete("/deleteZooEvent/:zooEventId", deleteZooEvent);

export default router;