import { Request } from "express";
import { validationErrorHandler } from "../helpers/errorHandler";
import { Species } from "../models/species";
import { SpeciesEnclosureNeed } from "../models/speciesEnclosureNeed";
import { PhysiologicalReferenceNorms } from "../models/physiologicalReferenceNorms";
import { AnimalGrowthStage } from "../models/enumerated";
import { SpeciesDietNeed } from "../models/speciesDietNeed";

export async function getAllSpecies(includes: string[]) {
  try {
    const allSpecies = await Species.findAll({ include: includes });
    return allSpecies;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getSpeciesByCode(
  speciesCode: string,
  includes: string[],
) {
  let result = await Species.findOne({
    where: { speciesCode: speciesCode },
    include: includes,
  });
  if (result) {
    return result;
  }
  throw { error: "Invalid Species Code!" };
}

export async function getSpeciesIdByCode(speciesCode: string) {
  let result = await Species.findOne({
    where: { speciesCode: speciesCode },
  });
  if (result) {
    return result.getSpeciesId();
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

  // console.log(newSpecies);

  try {
    return await Species.create(newSpecies);
  } catch (error: any) {
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

export async function createEnclosureNeeds(
  speciesCode: string,
  smallExhibitHeightRequired: number,
  minLandAreaRequired: number,
  minWaterAreaRequired: number,
  acceptableTempMin: number,
  acceptableTempMax: number,
  acceptableHumidityMin: number,
  acceptableHumidityMax: number,
  recommendedStandOffBarrierDistMetres: number,
  plantationCoveragePercentMin: number,
  plantationCoveragePercentMax: number,
  longGrassPercentMin: number,
  longGrassPercentMax: number,
  shortGrassPercentMin: number,
  shortGrassPercentMax: number,
  rockPercentMin: number,
  rockPercentMax: number,
  sandPercentMin: number,
  sandPercentMax: number,
  snowPercentMin: number,
  snowPercentMax: number,
  soilPercenMin: number,
  soilPercenMax: number,
) {
  let newEnclosureNeed = {
    smallExhibitHeightRequired: smallExhibitHeightRequired,
    minLandAreaRequired: minLandAreaRequired,
    minWaterAreaRequired: minWaterAreaRequired,
    acceptableTempMin: acceptableTempMin,
    acceptableTempMax: acceptableTempMax,
    acceptableHumidityMin: acceptableHumidityMin,
    acceptableHumidityMax: acceptableHumidityMax,
    recommendedStandOffBarrierDistMetres: recommendedStandOffBarrierDistMetres,
    plantationCoveragePercentMin: plantationCoveragePercentMin,
    plantationCoveragePercentMax: plantationCoveragePercentMax,
    longGrassPercentMin: longGrassPercentMin,
    longGrassPercentMax: longGrassPercentMax,
    shortGrassPercentMin: shortGrassPercentMin,
    shortGrassPercentMax: shortGrassPercentMax,
    rockPercentMin: rockPercentMin,
    rockPercentMax: rockPercentMax,
    sandPercentMin: sandPercentMin,
    sandPercentMax: sandPercentMax,
    snowPercentMin: snowPercentMin,
    snowPercentMax: snowPercentMax,
    soilPercenMin: soilPercenMin,
    soilPercenMax: soilPercenMax,
    // species:
  } as any;

  console.log(newEnclosureNeed);

  try {
    let speciesEncloure = await SpeciesEnclosureNeed.create(newEnclosureNeed);
    await (
      await getSpeciesByCode(speciesCode, [])
    ).setSpeciesEnclosureNeed(speciesEncloure);

    return speciesEncloure;
  } catch (error: any) {
    console.log(error);
    throw validationErrorHandler(error);
  }
}

export async function getEnclosureNeedsBySpeciesCode(speciesCode: string) {
  let result = await Species.findOne({
    where: { speciesCode: speciesCode },
    include: SpeciesEnclosureNeed, //eager fetch here!!
  });

  if (result) {
    let resultEnclosure = await result.speciesEnclosureNeed;
    return resultEnclosure;
  }
  throw { error: "Invalid Species Code!" };
}

export async function updateEnclosureNeeds(
  speciesEnclosureNeedId: number,
  smallExhibitHeightRequired: number,
  minLandAreaRequired: number,
  minWaterAreaRequired: number,
  acceptableTempMin: number,
  acceptableTempMax: number,
  acceptableHumidityMin: number,
  acceptableHumidityMax: number,
  recommendedStandOffBarrierDistMetres: number,
  plantationCoveragePercentMin: number,
  plantationCoveragePercentMax: number,
  longGrassPercentMin: number,
  longGrassPercentMax: number,
  shortGrassPercentMin: number,
  shortGrassPercentMax: number,
  rockPercentMin: number,
  rockPercentMax: number,
  sandPercentMin: number,
  sandPercentMax: number,
  snowPercentMin: number,
  snowPercentMax: number,
  soilPercenMin: number,
  soilPercenMax: number,
) {
  let updatedSpeciesEnclosure = {
    smallExhibitHeightRequired: smallExhibitHeightRequired,
    minLandAreaRequired: minLandAreaRequired,
    minWaterAreaRequired: minWaterAreaRequired,
    acceptableTempMin: acceptableTempMin,
    acceptableTempMax: acceptableTempMax,
    acceptableHumidityMin: acceptableHumidityMin,
    acceptableHumidityMax: acceptableHumidityMax,
    recommendedStandOffBarrierDistMetres: recommendedStandOffBarrierDistMetres,
    plantationCoveragePercentMin: plantationCoveragePercentMin,
    plantationCoveragePercentMax: plantationCoveragePercentMax,
    longGrassPercentMin: longGrassPercentMin,
    longGrassPercentMax: longGrassPercentMax,
    shortGrassPercentMin: shortGrassPercentMin,
    shortGrassPercentMax: shortGrassPercentMax,
    rockPercentMin: rockPercentMin,
    rockPercentMax: rockPercentMax,
    sandPercentMin: sandPercentMin,
    sandPercentMax: sandPercentMax,
    snowPercentMin: snowPercentMin,
    snowPercentMax: snowPercentMax,
    soilPercenMin: soilPercenMin,
    soilPercenMax: soilPercenMax,
  } as any;

  console.log(updatedSpeciesEnclosure);

  try {
    let speciesEnclosure = await SpeciesEnclosureNeed.update(
      updatedSpeciesEnclosure,
      {
        where: { speciesEnclosureNeedId: speciesEnclosureNeedId },
      },
    );
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deleteSpeciesEnclosureNeeds(
  speciesEnclosureNeedId: string,
) {
  let result = await SpeciesEnclosureNeed.destroy({
    where: { speciesEnclosureNeedId: speciesEnclosureNeedId },
  });
  if (result) {
    return result;
  }
  throw { error: "Invalid Species Enclosure Need Id!" };
}

export async function createPhysiologicalReferenceNorms(
  speciesCode: string,
  sizeMaleCm: number,
  sizeFemaleCm: number,
  weightMaleKg: number,
  weightFemaleKg: number,
  ageToGrowthAge: number,
  growthStage: AnimalGrowthStage,
) {
  let newPhysiologicalRefNorm = {
    sizeMaleCm: sizeMaleCm,
    sizeFemaleCm: sizeFemaleCm,
    weightMaleKg: weightMaleKg,
    weightFemaleKg: weightFemaleKg,
    ageToGrowthAge: ageToGrowthAge,
    growthStage: growthStage,
    // species:
  } as any;

  console.log(newPhysiologicalRefNorm);

  try {
    let newPhysiologicalRefNormEntry = await PhysiologicalReferenceNorms.create(
      newPhysiologicalRefNorm,
    );
    // let test : PhysiologicalReferenceNorms[] = [newPhysiologicalRefNormEntry]
    // await (
    //   await getSpeciesByCode(speciesCode, "")
    // ).addPhysiologicalRefNorm(newPhysiologicalRefNormEntry);

    newPhysiologicalRefNormEntry.setSpecies(
      await getSpeciesByCode(speciesCode, []),
    );

    return newPhysiologicalRefNormEntry;
  } catch (error: any) {
    console.log(error);
    throw validationErrorHandler(error);
  }
}

export async function getAllPhysiologicalReferenceNormsbySpeciesCode(
  speciesCode: string,
) {
  let result = await Species.findOne({
    where: { speciesCode: speciesCode },
    include: PhysiologicalReferenceNorms, //eager fetch here!!
  });

  if (result) {
    let resultPhysiologicalReferenceNorms =
      await result.physiologicalReferenceNorms;
    //   await result.getPhysiologicalRefNorm();
    return resultPhysiologicalReferenceNorms;
  }
  throw { error: "Invalid Species Code!" };
}

export async function getPhysiologicalReferenceNormsById(
  physiologicalRefId: string,
) {
  let result = await PhysiologicalReferenceNorms.findOne({
    where: { physiologicalRefId: physiologicalRefId },
  });

  if (result) {
    return result;
  }
  throw { error: "Invalid Physiological Ref Id Code!" };
}

export async function updatePhysiologicalReferenceNorms(
  physiologicalRefId: number,
  sizeMaleCm: number,
  sizeFemaleCm: number,
  weightMaleKg: number,
  weightFemaleKg: number,
  ageToGrowthAge: number,
  growthStage: AnimalGrowthStage,
) {
  let updatedPhysiologicalRef = {
    sizeMaleCm: sizeMaleCm,
    sizeFemaleCm: sizeFemaleCm,
    weightMaleKg: weightMaleKg,
    weightFemaleKg: weightFemaleKg,
    ageToGrowthAge: ageToGrowthAge,
    growthStage: growthStage,
  } as any;

  console.log(updatedPhysiologicalRef);

  try {
    await PhysiologicalReferenceNorms.update(updatedPhysiologicalRef, {
      where: { physiologicalRefId: physiologicalRefId },
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deletePhysiologicalReferenceNorms(
  physiologicalRefId: string,
) {
  let result = await PhysiologicalReferenceNorms.destroy({
    where: { physiologicalRefId: physiologicalRefId },
  });
  if (result) {
    return result;
  }
  throw { error: "Invalid Physiological Reference Id!" };
}

//createPhysiologicalReferenceNorms
export async function createDietNeed(
  speciesCode: string,
  animalFeedCategory: string,
  amountPerMealGram: number,
  amountPerWeekGram: number,
  presentationContainer: string,
  presentationMethod: string,
  presentationLocation: string,
  growthStage: string,
) {
  let newDietNeed = {
    animalFeedCategory: animalFeedCategory,
    amountPerMealGram: amountPerMealGram,
    amountPerWeekGram: amountPerWeekGram,
    presentationContainer: presentationContainer,
    presentationMethod: presentationMethod,
    presentationLocation: presentationLocation,
    growthStage: growthStage,
  } as any;

  console.log(newDietNeed);

  try {
    let newDietNeedEntry = await SpeciesDietNeed.create(newDietNeed);

    newDietNeedEntry.setSpecies(await getSpeciesByCode(speciesCode, []));

    return newDietNeedEntry;
  } catch (error: any) {
    console.log(error);
    throw validationErrorHandler(error);
  }
}

export async function getAllDietNeedbySpeciesCode(speciesCode: string) {
  let result = await Species.findOne({
    where: { speciesCode: speciesCode },
    include: SpeciesDietNeed, //eager fetch here
  });

  if (result) {
    let resultSpeciesDietNeed = await result.speciesDietNeeds;
    return resultSpeciesDietNeed;
  }
  throw { error: "Invalid Species Code!" };
}

export async function getDietNeedById(speciesDietNeedId: string) {
  let result = await SpeciesDietNeed.findOne({
    where: { speciesDietNeedId: speciesDietNeedId },
  });

  if (result) {
    return result;
  }
  throw { error: "Invalid Species Diet Need Id!" };
}

export async function updateDietNeed(
  speciesDietNeedId: number,
  animalFeedCategory: string,
  amountPerMealGram: number,
  amountPerWeekGram: number,
  presentationContainer: string,
  presentationMethod: string,
  presentationLocation: string,
  growthStage: string,
) {
  let updatedDietNeed = {
    animalFeedCategory: animalFeedCategory,
    amountPerMealGram: amountPerMealGram,
    amountPerWeekGram: amountPerWeekGram,
    presentationContainer: presentationContainer,
    presentationMethod: presentationMethod,
    presentationLocation: presentationLocation,
    growthStage: growthStage,
  } as any;

  console.log(updatedDietNeed);

  try {
    await SpeciesDietNeed.update(updatedDietNeed, {
      where: { speciesDietNeedId: speciesDietNeedId },
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deleteDietNeed(speciesDietNeedId: string) {
  let result = await SpeciesDietNeed.destroy({
    where: { speciesDietNeedId: speciesDietNeedId },
  });
  if (result) {
    return result;
  }
  throw { error: "Invalid Species Diet Need Id!" };
}
