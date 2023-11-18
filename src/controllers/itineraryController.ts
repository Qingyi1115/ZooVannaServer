import { Request, Response } from "express";
import * as CustomerService from "../services/customerService";
import { Species } from "../models/Species";
import { getSpeciesByCode } from "../services/speciesService";
import * as ItineraryService from "../services/itineraryService";

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
