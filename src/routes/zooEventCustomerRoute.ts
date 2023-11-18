import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import {
  getAllPublishedPublicZooEvents,
  getPublishedPublicZooEvent,
  getAllPublicEvents,
  getPublicEventById,
  getAllUniquePublicZooEventsToday,
} from "../controllers/zooEventCustomerController";

const router = express.Router();

router.get("/getAllPublishedPublicZooEvents", getAllPublishedPublicZooEvents);
router.get(
  "/getPublishedPublicZooEvent/:zooEventId",
  getPublishedPublicZooEvent,
);
router.get("/getAllPublicEvents", getAllPublicEvents);
router.get("/getPublicEventById/:publicEventId", getPublicEventById);

router.post(
  "/getAllUniquePublicZooEventsToday",
  getAllUniquePublicZooEventsToday,
);

router.use(authMiddleware);

// Public Events
//router.get("/getAllPublicEvents", getAllPublicEvents);
//router.get("/getPublicEventById/:publicEventId", getPublicEventById);

// PublicEventSession
//router.get("/getAllPublicEventSessions", getAllPublicEventSessions);
/*router.get(
  "/getAllPublicEventSessionsByPublicEventId/:publicEventId",
  getAllPublicEventSessionsByPublicEventId,
);
router.get(
  "/getPublicEventSessionById/:publicEventSessionId",
  getPublicEventSessionById,
);*/

export default router;
