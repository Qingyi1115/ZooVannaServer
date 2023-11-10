import express from "express";
import {
  getAllListingsController,
  getListingController,
  getLocalListingController,
  getForeignerListingController,
} from "../controllers/listingController";

const router = express.Router();

router.get("/getListing/:listingId", getListingController);
router.get("/getAllListings", getAllListingsController);
router.get("/getLocalListings", getLocalListingController);
//,
router.get("/getForeignerListings", getForeignerListingController);

export default router;
