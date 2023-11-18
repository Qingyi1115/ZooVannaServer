import { Request, Response } from "express";
import * as CustomerService from "../services/customerService";
import { Species } from "../models/Species";
import { getSpeciesByCode } from "../services/speciesService";
import * as ItineraryService from "../services/itineraryService";
import { Facility } from "../models/Facility";
import { getFacilityById } from "../services/assetFacilityService";

export async function optimizeItineraryRoute(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    if (email) {
      const customer = await CustomerService.findCustomerByEmail(email);
      if (!customer)
        return res.status(400).json({ message: "Customer not found!" });
      else {
        const speciesData = req.body;
        let speciesArray: Species[] = [];

        for (const _speciesData of speciesData) {
          speciesArray.push(
            await getSpeciesByCode(_speciesData.speciesCode, []),
          );
        }

        const result =
          await ItineraryService.optimizeItineraryRoute(speciesArray);
        console.log("in itinerary controller " + result);
        if (result) {
          return res.status(200).json({ result: result });
        }
      }
    } else {
      return res.status(400).json({ message: "Email not found" });
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function createItinerary(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    if (email) {
      const customer = await CustomerService.findCustomerByEmail(email);
      if (!customer)
        return res.status(400).json({ message: "Customer not found!" });
      else {
        const { itineraryName, datePlannedVisit, facilityData, speciesData } =
          req.body;
        let facilityArray: Facility[] = [];
        let speciesArray: Species[] = [];

        for (const _facilityData of facilityData) {
          facilityArray.push(
            await getFacilityById(_facilityData.facilityId, []),
          );
        }

        for (const _speciesData of speciesData) {
          speciesArray.push(
            await getSpeciesByCode(_speciesData.speciesCode, []),
          );
        }

        console.log("it is already here");

        const result = await ItineraryService.createItinerary(
          customer,
          itineraryName,
          new Date(datePlannedVisit),
          facilityArray,
          speciesArray,
        );

        console.log("in itinerary controller " + result);
        if (result) {
          return res.status(200).json({ result: result });
        }
      }
    } else {
      return res.status(400).json({ message: "Email not found" });
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function editItinerary(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    if (email) {
      const customer = await CustomerService.findCustomerByEmail(email);
      if (!customer)
        return res.status(400).json({ error: "Customer not found!" });
      else {
        const { itineraryName, datePlannedVisit, facilityData, speciesData } =
          req.body;
        if (
          [itineraryName, datePlannedVisit, facilityData, speciesData].includes(
            undefined,
          )
        ) {
          console.log("Missing field(s): ", {
            itineraryName,
            datePlannedVisit,
            facilityData,
            speciesData,
          });
          return res.status(400).json({ error: "Missing information!" });
        }

        console.log(facilityData);

        const { itineraryId } = req.params;
        let facilityArray: Facility[] = [];
        let speciesArray: Species[] = [];

        for (const _facilityData of facilityData) {
          facilityArray.push(
            await getFacilityById(_facilityData.facilityId, []),
          );
        }

        for (const _speciesData of speciesData) {
          speciesArray.push(
            await getSpeciesByCode(_speciesData.speciesCode, []),
          );
        }

        const itinerary = await ItineraryService.getItineraryById(
          Number(itineraryId),
        );

        const result = await ItineraryService.editItinerary(
          itineraryName,
          datePlannedVisit,
          itinerary,
          facilityArray,
          speciesArray,
        );

        console.log("in itinerary controller " + result);
        if (result) {
          return res.status(200).json({ result: result });
        }
      }
    } else {
      return res.status(400).json({ message: "Email not found" });
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getItineraryById(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const { itineraryId } = req.params;
    if (email) {
      const customer = await CustomerService.findCustomerByEmail(email);
      if (!customer)
        return res.status(400).json({ message: "Customer not found!" });
      else {
        if (itineraryId) {
          const result = await ItineraryService.getItineraryById(
            Number(itineraryId),
          );
          return res.status(200).json({ result: result });
        } else {
          return res.status(400).json({ message: "Itinerary Id not found" });
        }
      }
    } else {
      return res.status(400).json({ message: "Email not found" });
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getFacilitiesInOrder(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const { itineraryId } = req.params;
    if (email) {
      const customer = await CustomerService.findCustomerByEmail(email);
      if (!customer)
        return res.status(400).json({ message: "Customer not found!" });
      else {
        if (itineraryId) {
          const result = await ItineraryService.getFacilitiesInOrder(
            Number(itineraryId),
          );
          return res.status(200).json({ result: result });
        } else {
          return res.status(400).json({ message: "Itinerary Id not found" });
        }
      }
    } else {
      return res.status(400).json({ message: "Email not found" });
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function removeItineraryById(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const { itineraryId } = req.params;
    if (email) {
      const customer = await CustomerService.findCustomerByEmail(email);
      if (!customer)
        return res.status(400).json({ message: "Customer not found!" });
      else {
        if (itineraryId) {
          await ItineraryService.removeItineraryById(Number(itineraryId));
          return res
            .status(200)
            .json({ message: "Itinerary is successfully deleted" });
        } else {
          return res.status(400).json({ message: "Itinerary Id not found" });
        }
      }
    } else {
      return res.status(400).json({ message: "Email not found" });
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
