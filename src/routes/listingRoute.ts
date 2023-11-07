import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createNewListingController,
  disableListingController,
  editListingDetailsController,
  enableListingController,
  getAllListingsController,
  getListingController,
} from "../controllers/listingController";

const router = express.Router();

router.use(authMiddleware);

router.post("/createNewListing", createNewListingController);
router.put("/editListing/:listingId", editListingDetailsController);

router.delete("/disableListing/:listingId", disableListingController);
router.delete("/enableListing/:listingId", enableListingController);

router.get("/getListing/:listingId", getListingController);
router.get("/getAllListings", getAllListingsController);

export default router;
