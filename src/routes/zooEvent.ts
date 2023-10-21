import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import { 
    deleteZooEvent, 
    getAllZooEvents, 
    getZooEventById, 
    updateZooEventIncludeFuture, 
    updateZooEventSingle,
 } from "../controllers/zooEventController";
const router = express.Router();

router.use(authMiddleware);

//species basic
router.get("/getAllZooEvents", getAllZooEvents);
router.get("/getZooEventById/:zooEventId", getZooEventById);
router.put("/updateZooEventSingle/:zooEventId", updateZooEventSingle);
router.put("/updateZooEventIncludeFuture/:zooEventId", updateZooEventIncludeFuture);
router.delete("/deleteZooEvent/:zooEventId", deleteZooEvent);
