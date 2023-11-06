import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
//Controller functions
import {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementByAnnouncementId,
  updateAnnouncement,
  deleteAnnouncement,
  getAllPublishedAnnouncements,
  togglePublishAnnouncement,
} from "../controllers/announcementController";

const router = express.Router();

router.get("/getAllPublishedAnnouncements", getAllPublishedAnnouncements);
router.get("/getAnnouncement/:announcementId", getAnnouncementByAnnouncementId);

router.use(authMiddleware);

router.post("/createAnnouncement", createAnnouncement);
router.get("/getAllAnnouncements", getAllAnnouncements);
router.put("/updateAnnouncement/:announcementId", updateAnnouncement);
router.delete(
  "/togglePublishAnnouncement/:announcementId",
  togglePublishAnnouncement,
);
router.delete("/deleteAnnouncement/:announcementId", deleteAnnouncement);

export default router;
