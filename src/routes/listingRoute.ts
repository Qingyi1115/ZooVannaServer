import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createNewListing,
  disableListing,
  editListingDetails,
  enableListing,
  getAllListings,
  getListing,
} from "../controllers/listingController";

const router = express.Router();

router.use(authMiddleware);

router.post("/createNewListing", createNewListing);
router.put("/editListing/:listingId", editListingDetails);

router.delete("/disableListing/:listingId", disableListing);
router.delete("/enableListing/:listingId", enableListing);

router.get("/getListing/:listingId", getListing);
router.get("/getAllListings", getAllListings);

export default router;
