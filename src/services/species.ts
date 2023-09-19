import { Request } from "express";
import { validationErrorHandler } from "../helpers/errorHandler";
import { Species } from "../models/species";

export async function getAllSpecies() {
    try {
        const allSpecies = await Species.findAll();
        return allSpecies;
    } catch (error: any) {
        throw validationErrorHandler(error);
    }
}

export async function getSpeciesByCode(speciesCode: string) {
    let result = await Species.findOne({
        where: { speciesCode: speciesCode },
    });
    if (result) {
        return result;
    }
    throw { error: "Invalid Species Code!" };
}

export async function createNewSpecies(
    commonName: string,
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
    educationalDescription: string,
    nativeContinent: string,
    nativeBiomes: string,
    groupSexualDynamic: string,
    habitatOrExhibit: string,
    generalDietPreference: string,
    imageUrl: string,
    lifeExpectancyYears: number,
    // foodRemark: string,
) {
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
        educationalDescription: educationalDescription,
        nativeContinent: nativeContinent,
        nativeBiomes: nativeBiomes,
        groupSexualDynamic: groupSexualDynamic,
        habitatOrExhibit: habitatOrExhibit,
        generalDietPreference: generalDietPreference,
        imageUrl: imageUrl,
        lifeExpectancyYears,
        // foodRemark nullable now
    } as any;

    console.log(newSpecies);

    try {
        return Species.create(newSpecies);
    } catch (error: any) {
        console.log(error);
        throw validationErrorHandler(error);
    }
}

export async function updateSpecies(
    speciesCode: string,
    commonName: string,
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
    educationalDescription: string,
    nativeContinent: string,
    selectedBiomes: string,
    groupSexualDynamic: string,
    habitatOrExhibit: string,
    generalDietPreference: string,
    imageUrl: string,
    lifeExpectancyYears: number,
) {
    let updatedSpecies = {
        speciesCode: speciesCode,
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
        educationalDescription: educationalDescription,
        nativeContinent: nativeContinent,
        nativeBiomes: selectedBiomes,
        groupSexualDynamic: groupSexualDynamic,
        habitatOrExhibit: habitatOrExhibit,
        generalDietPreference: generalDietPreference,
        imageUrl: imageUrl,
        lifeExpectancyYears: lifeExpectancyYears,
    } as any;

    console.log(updatedSpecies);

    try {
        let species = await Species.update(updatedSpecies, {
            where: { speciesCode: speciesCode },
        });
    } catch (error: any) {
        throw validationErrorHandler(error);
    }
}

export async function updateSpeciesEduDesc(
    speciesCode: string,
    educationalDescription: string,
) {
    let updatedSpecies = {
        educationalDescription: educationalDescription,
    } as any;

    console.log(updatedSpecies);

    try {
        let species = await Species.update(updatedSpecies, {
            where: { speciesCode: speciesCode },
        });
    } catch (error: any) {
        throw validationErrorHandler(error);
    }
}

export async function deleteSpeciesByCode(speciesCode: string) {
    let result = await Species.destroy({
        where: { speciesCode: speciesCode },
    });
    if (result) {
        return result;
    }
    throw { error: "Invalid Species Code!" };
}
