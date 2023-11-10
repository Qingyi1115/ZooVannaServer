import express from "express";
import {
  getAllListings,
  getListing,
  getLocalListing,
  getForeignerListing,
} from "../controllers/listingController";

const router = express.Router();

router.get("/getListing/:listingId", getListing);
router.get("/getAllListings", getAllListings);
router.get("/getLocalListings", getLocalListing);
//,
router.get("/getForeignerListings", getForeignerListing);

export default router;
