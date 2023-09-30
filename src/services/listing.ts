import { Listing } from "../models/listing";
import { validationErrorHandler } from "../helpers/errorHandler";
import { ListingStatus } from "../models/enumerated";

export async function createListing(
  name: string,
  description: string,
  price: number,
  listingType: string,
) {
  try {
    const listingDetails: any = {
      name: name,
      description: description,
      price: price,
      listingType: listingType,
      listingStatus: ListingStatus.ACTIVE,
    };

    let result = await Listing.create(listingDetails);
    return result;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function editListingDetails(
  listingId: number,
  name: string,
  description: string,
  price: number,
  listingType: string,
  listingStatus: string,
) {
  try {
    let listingDetails: any = {
      name: name,
      description: description,
      price: price,
      listingType: listingType,
      listingStatus: listingStatus,
    };

    await Listing.update(listingDetails, {
      where: { listingId: listingId },
    });
  } catch (error: any) {
    throw { error: "Listing does not exist" };
  }
}

export async function disableListing(listingId: number) {
  try {
    let listing = await Listing.findOne({
      where: { listingId: listingId },
    });

    if (listing) {
      listing.setDisabled();
    }
  } catch (error: any) {
    throw { error: "Listing does not exist" };
  }
}

export async function enableListing(listingId: number) {
  try {
    let listing = await Listing.findOne({
      where: { listingId: listingId },
    });

    if (listing) {
      listing.setEnabled();
    }
  } catch (error: any) {
    throw { error: "Listing does not exist" };
  }
}

export async function getListing(listingId: number) {
  try {
    let listing = await Listing.findOne({
      where: { listingId: listingId },
      include: ["orderItems"],
    });

    return listing;
  } catch (error: any) {
    throw { error: "Listing does not exist" };
  }
}

export async function getAllListings() {
  try {
    let listing = await Listing.findAll({
      include: ["orderItems"],
    });
    return listing;
  } catch (error: any) {
    throw { error: "Listings do not exist" };
  }
}
