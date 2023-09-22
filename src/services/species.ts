import { Request } from "express";
import { Op } from "Sequelize";
import { validationErrorHandler } from "../helpers/errorHandler";
import { Species } from "../models/species";
import { SpeciesEnclosureNeed } from "../models/speciesEnclosureNeed";
import { PhysiologicalReferenceNorms } from "../models/physiologicalReferenceNorms";
import { AnimalGrowthStage } from "../models/enumerated";
import { SpeciesDietNeed } from "../models/speciesDietNeed";
import { Compatibility } from "../models/compatibility";

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
  throw new Error("Invalid Species Code!");
}

export async function getSpeciesIdByCode(speciesCode: string) {
  let result = await Species.findOne({
    where: { speciesCode: speciesCode },
  });
  if (result) {
    return result.getSpeciesId();
  }
  throw new Error("Invalid Species Code!");
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

export async function getSpeciesEduDescBySpeciesCode(speciesCode: string) {
  let result = await Species.findOne({
    where: { speciesCode: speciesCode },
  });

  if (result) {
    let newSpeciesEdu = {
      educationalDescription: result.educationalDescription,
      educationalFunFact: result.educationalFunFact,
    };

    return newSpeciesEdu;
  }
  throw new Error("Invalid Species Code!");
}

export async function updateSpeciesEduDesc(
  speciesCode: string,
  educationalDescription: string,
  educationalFunFact: string,
) {
  let updatedSpecies = {
    educationalDescription: educationalDescription,
    educationalFunFact: educationalFunFact,
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

export async function getSpeciesFoodRemark(speciesCode: string) {
  let result = await Species.findOne({
    where: { speciesCode: speciesCode },
  });

  if (result) {
    let newSpeciesFoodRemark = {
      foodRemark: result.foodRemark,
    };

    return newSpeciesFoodRemark;
  }
  throw new Error("Invalid Species Code!");
}

export async function updateSpeciesFoodRemark(
  speciesCode: string,
  foodRemark: string,
) {
  let updatedSpecies = {
    foodRemark: foodRemark,
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
  throw new Error("Invalid Species Code!");
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
  soilPercentMin: number,
  soilPercentMax: number,
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
    soilPercentMin: soilPercentMin,
    soilPercentMax: soilPercentMax,
    // species:
  } as any;

  console.log(newEnclosureNeed);

  try {
    let newSpeciesEncloureEntry =
      await SpeciesEnclosureNeed.create(newEnclosureNeed);
    // await (
    //   await getSpeciesByCode(speciesCode, [])
    // ).setSpeciesEnclosureNeed(speciesEncloure);
    newSpeciesEncloureEntry.setSpecies(await getSpeciesByCode(speciesCode, []));

    return newSpeciesEncloureEntry;
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
  throw new Error("Invalid Species Code!");
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
  soilPercentMin: number,
  soilPercentMax: number,
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
    soilPercentMin: soilPercentMin,
    soilPercentMax: soilPercentMax,
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
  throw new Error("Invalid Species Enclosure Need Id!");
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
  throw new Error("Invalid Species Code!");
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
  throw new Error("Invalid Physiological Ref Id Code!");
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
  throw new Error("Invalid Physiological Reference Id!");
}

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
  throw new Error("Invalid Species Code!");
}

export async function getDietNeedById(speciesDietNeedId: string) {
  let result = await SpeciesDietNeed.findOne({
    where: { speciesDietNeedId: speciesDietNeedId },
  });

  if (result) {
    return result;
  }
  throw new Error("Invalid Species Diet Need Id!");
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
  throw new Error("Invalid Species Diet Need Id!");
}

//
export async function createCompatibility(
  speciesCode1: string,
  speciesCode2: string,
) {
  let newCompatibility = {
    speciesId1: await getSpeciesIdByCode(speciesCode1),
    speciesId2: await getSpeciesIdByCode(speciesCode2),
  } as any;

  // Check if compatibility already exists
  const existingCompatibility = await Compatibility.findOne({
    where: {
      [Op.or]: [
        {
          speciesId1: newCompatibility.speciesId1,
          speciesId2: newCompatibility.speciesId2,
        },
        {
          speciesId1: newCompatibility.speciesId2,
          speciesId2: newCompatibility.speciesId1,
        },
      ],
    },
  });
  if (existingCompatibility) {
    throw new Error("Compatibility already exists.");
  } else {
    console.log(newCompatibility);

    try {
      let newCompatibilityEntry = await Compatibility.create(newCompatibility);

      await newCompatibilityEntry.setSpecies1(
        await getSpeciesByCode(speciesCode1, []),
      );
      await newCompatibilityEntry.setSpecies2(
        await getSpeciesByCode(speciesCode2, []),
      );

      return newCompatibilityEntry;
    } catch (error: any) {
      console.log(error);
      throw validationErrorHandler(error);
    }
  }
}

export async function getAllCompatibilitiesbySpeciesCode(speciesCode: string) {
  let speciesResult = await Species.findOne({
    where: { speciesCode: speciesCode },
    // include: Compatibility, //eager fetch here
  });

  if (speciesResult != null) {
    // Find all species compatible with the given species
    const compatibilities = await Compatibility.findAll({
      where: {
        [Op.or]: [
          { speciesId1: speciesResult.speciesId },
          { speciesId2: speciesResult.speciesId },
        ],
      },
    });

    // Extract the IDs of compatible species
    const compatibleSpeciesIds = compatibilities.map((compatibility) => {
      if (compatibility.speciesId1 === speciesResult?.speciesId) {
        return compatibility.speciesId2;
      } else {
        return compatibility.speciesId1;
      }
    });

    // Find the actual compatible species using their IDs
    const compatibleSpecies = await Species.findAll({
      where: { speciesId: compatibleSpeciesIds },
    });

    return compatibleSpecies;
  }
  //   throw { error: "Invalid Species Code!" };
  throw new Error("Invalid Species Code!");
}

export async function checkIsCompatible(
  speciesCode1: string,
  speciesCode2: string,
) {
  let specie1Result = await Species.findOne({
    where: { speciesCode: speciesCode1 },
    include: Compatibility, //eager fetch here
  });

  let specie2Result = await Species.findOne({
    where: { speciesCode: speciesCode2 },
    include: Compatibility, //eager fetch here
  });

  if (specie1Result && specie2Result) {
    return specie1Result.isCompatible(specie2Result);
  }
  throw new Error("Invalid Species Code!");
}

export async function deleteCompatibility(compatibilityId: string) {
  let result = await Compatibility.destroy({
    where: { compatibilityId: compatibilityId },
  });
  if (result) {
    return result;
  }
  throw new Error("Invalid Compatibility Id!");
}
