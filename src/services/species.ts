import { Request } from "express";
import { validationErrorHandler } from "../helpers/errorHandler";
import { Species } from "../models/species";

export async function createNewSpecies(commonName: string,
    scientificName: string,
    aliasName: string,
    conservationStatus: string,
    domain: string,
    kingdom: string,
    phylum: string,
    speciesClass: string,
    order: string,
    family: string,
    genus: string,
    nativeContinent: string,
    selectedBiomes: string,
    groupSexualDynamic: string,
    habitatOrExhibit: string,
    generalDietPreference: string,
    imageUrl: string) {

    let newSpecies = {
        speciesCode: await Species.getNextSpeciesCode(),
        commonName: commonName,
        scientificName: scientificName,
        aliasName: aliasName,
        conservationStatus: conservationStatus,
        domain: domain,
        kingdom: kingdom,
        phylum: phylum,
        speciesClass: speciesClass,
        order: order,
        family: family,
        genus: genus,
        educationalDescription: "lol go to school kid",
        nativeContinent: nativeContinent,
        nativeBiomes: selectedBiomes,
        groupSexualDynamic: groupSexualDynamic,
        habitatOrExhibit: habitatOrExhibit,
        generalDietPreference: generalDietPreference,
        imageUrl: imageUrl,
    } as any;

    console.log(newSpecies)

    try {
        return Species.create(newSpecies)
        // return newSpecies;
    } catch (error: any) {
        throw validationErrorHandler(error);
        // console.log("error!");
        // console.log(error);
    }
}
