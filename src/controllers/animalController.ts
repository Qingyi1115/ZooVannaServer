import { Request, Response } from "express";
import * as AnimalService from "../services/animal";
import { handleFileUpload } from "../helpers/multerProcessFile";

export async function getAllAnimals(req: Request, res: Response) {
  //   const { includes = "" } = req.body;
  //   const _includes: string[] = [];
  //   for (const role of [
  //     "speciesDietNeed",
  //     "speciesEnclosureNeed",
  //     "physiologicalReferenceNorms",
  //   ]) {
  //     if (includes.includes(role)) _includes.push(role);
  //   }
  //   try {
  //     const allSpecies = await SpeciesService.getAllSpecies(_includes);
  //     return res.status(200).json(allSpecies);
  //   } catch (error: any) {
  //     res.status(400).json({ error: error.message });
  //   }
}
