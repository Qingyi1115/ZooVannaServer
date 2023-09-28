import { Request } from "express";
import { Op } from "Sequelize";
import { validationErrorHandler } from "../helpers/errorHandler";
import { Animal } from "../models/animal";
import { Species } from "../models/species";
import { SpeciesEnclosureNeed } from "../models/speciesEnclosureNeed";
import { PhysiologicalReferenceNorms } from "../models/physiologicalReferenceNorms";
import { AnimalGrowthStage } from "../models/enumerated";
import { SpeciesDietNeed } from "../models/speciesDietNeed";
import { Compatibility } from "../models/compatibility";

//getSpeciesbyAnimalCode(speciesCode: string)

export async function getAllAnimals(includes: string[]) {
  //   try {
  //     const allSpecies = await Species.findAll({ include: includes });
  //     return allSpecies;
  //   } catch (error: any) {
  //     throw validationErrorHandler(error);
  //   }
}
