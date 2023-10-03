import express from "express";
import {
  createNewListingController,
  disableListingController,
  editListingDetailsController,
  enableListingController,
  getAllListingsController,
  getListingController,
} from "../controllers/listingController";

const router = express.Router();

router.get("/getListing/:listingId", getListingController);
router.get("/getAllListings", getAllListingsController);

export default router;
