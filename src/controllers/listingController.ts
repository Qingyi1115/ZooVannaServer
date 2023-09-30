import {
  createListing,
  disableListing,
  editListingDetails,
  enableListing,
  getAllListings,
  getListing,
} from "../services/listing";
import { Request, Response } from "express";

export async function createNewListingController(req: Request, res: Response) {
  try {
    const { name, description, price, listingType } = req.body;

    if ([name, description, price, listingType].includes(undefined)) {
      console.log("Missing field(s): ", {
        name,
        description,
        price,
        listingType,
      });
      return res.status(400).json({ error: "missing information" });
    }

    let listing = await createListing(name, description, price, listingType);
    return res.status(200).json({ result: listing });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function editListingDetailsController(
  req: Request,
  res: Response,
) {
  try {
    const { name, description, price, listingType, listingStatus } = req.body;
    if (name && description && price && listingType && listingStatus) {
      const { listingId } = req.params;
      editListingDetails(
        Number(listingId),
        name,
        description,
        price,
        listingType,
        listingStatus,
      );
      return res.status(200).json({ result: "Listing has been updated!" });
    } else {
      return res.status(400).json({ result: "missing information" });
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function disableListingController(req: Request, res: Response) {
  try {
    const { listingId } = req.params;
    await disableListing(Number(listingId));
    return res.status(200).json({ result: "Listing has been disabled" });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function enableListingController(req: Request, res: Response) {
  try {
    const { listingId } = req.params;
    await enableListing(Number(listingId));
    return res.status(200).json({ result: "Listing has been enabled" });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getListingController(req: Request, res: Response) {
  try {
    const { listingId } = req.params;
    let result = await getListing(Number(listingId));
    return res.status(200).json({ result: result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getAllListingsController(req: Request, res: Response) {
  try {
    let result = await getAllListings();
    return res.status(200).json({ result: result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
