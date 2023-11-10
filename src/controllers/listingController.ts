import * as ListingService from "../services/listingService";
import { Request, Response } from "express";

export async function createNewListing(req: Request, res: Response) {
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

    let listing = await ListingService.createListing(name, description, price, listingType);
    return res.status(200).json({ result: listing });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function editListingDetails(
  req: Request,
  res: Response,
) {
  try {
    const { name, description, price, listingType, listingStatus } = req.body;
    if (name && description && price && listingType && listingStatus) {
      const { listingId } = req.params;
      ListingService.editListingDetails(
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

export async function disableListing(req: Request, res: Response) {
  try {
    const { listingId } = req.params;
    await ListingService.disableListing(Number(listingId));
    return res.status(200).json({ result: "Listing has been disabled" });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function enableListing(req: Request, res: Response) {
  try {
    const { listingId } = req.params;
    await ListingService.enableListing(Number(listingId));
    return res.status(200).json({ result: "Listing has been enabled" });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getListing(req: Request, res: Response) {
  try {
    const { listingId } = req.params;
    let result = await ListingService.getListing(Number(listingId));
    return res.status(200).json({ result: result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getAllListings(req: Request, res: Response) {
  try {
    let result = await ListingService.getAllListings();
    return res.status(200).json({ result: result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getLocalListing(req: Request, res: Response) {
  try {
    const result = await ListingService.getLocalListing();
    return res.status(200).json({ result: result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getForeignerListing(
  req: Request,
  res: Response,
) {
  try {
    const result = await ListingService.getForeignerListing();
    return res.status(200).json({ result: result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
