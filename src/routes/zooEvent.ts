import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import { 
    createNewInternalZooEvent, 
    deleteZooEvent, 
    getAllZooEvents, 
    getZooEvent, 
    updateZooEventDetails,
 } from "../controllers/zooEventController";
const router = express.Router();

router.use(authMiddleware);

//species basic
router.get("/getAllZooEvents", getAllZooEvents);
router.get("/getZooEvent/:zooEventId", getZooEvent);
router.post("/createNewInternalZooEvent", createNewInternalZooEvent);
router.put("/updateZooEventDetails/:zooEventId", updateZooEventDetails);
router.delete("/deleteZooEvent/:zooEventId", deleteZooEvent);
