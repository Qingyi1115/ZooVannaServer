import { Op } from "Sequelize";
import { validationErrorHandler } from "../helpers/errorHandler";
import { Compatibility } from "../models/Compatibility";
import { AnimalGrowthStage } from "../models/Enumerated";
import { PhysiologicalReferenceNorms } from "../models/PhysiologicalReferenceNorms";
import { Species } from "../models/Species";
import { SpeciesDietNeed } from "../models/SpeciesDietNeed";
import { SpeciesEnclosureNeed } from "../models/SpeciesEnclosureNeed";
import * as CustomerService from "../services/customerService";
import { Customer } from "../models/Customer";
import { Facility } from "models/Facility";
const Sequelize = require("sequelize");
import { conn } from "../db";

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
  ageToJuvenile: number,
  ageToAdolescent: number,
  ageToAdult: number,
  ageToElder: number,
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
    lifeExpectancyYears: lifeExpectancyYears,
    ageToJuvenile: ageToJuvenile,
    ageToAdolescent: ageToAdolescent,
    ageToAdult: ageToAdult,
    ageToElder: ageToElder,
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
  ageToJuvenile: number,
  ageToAdolescent: number,
  ageToAdult: number,
  ageToElder: number,
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
    ageToJuvenile: ageToJuvenile,
    ageToAdolescent: ageToAdolescent,
    ageToAdult: ageToAdult,
    ageToElder: ageToElder,
  } as any;

  console.log(updatedSpecies);

  try {
    let species = await Species.update(updatedSpecies, {
      where: { speciesCode: speciesCode },
    });
    return species;
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
  try {
    let species = await getSpeciesByCode(speciesCode, []);
    species.educationalDescription = educationalDescription;
    species.educationalFunFact = educationalFunFact;
    return species.save();
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
  try {
    let species = await getSpeciesByCode(speciesCode, []);
    species.foodRemark = foodRemark;
    return species.save();
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
  minSizeMaleCm: number,
  maxSizeMaleCm: number,
  minSizeFemaleCm: number,
  maxSizeFemaleCm: number,
  minWeightMaleKg: number,
  maxWeightMaleKg: number,
  minWeightFemaleKg: number,
  maxWeightFemaleKg: number,
  minAge: number,
  maxAge: number,
  growthStage: AnimalGrowthStage,
) {
  let newPhysiologicalRefNorm = {
    minSizeMaleCm: minSizeMaleCm,
    maxSizeMaleCm: maxSizeMaleCm,
    minSizeFemaleCm: minSizeFemaleCm,
    maxSizeFemaleCm: maxSizeFemaleCm,
    minWeightMaleKg: minWeightMaleKg,
    maxWeightMaleKg: maxWeightMaleKg,
    minWeightFemaleKg: minWeightFemaleKg,
    maxWeightFemaleKg: maxWeightFemaleKg,
    minAge: minAge,
    maxAge: maxAge,
    growthStage: growthStage,
    // species:
  } as any;

  console.log(newPhysiologicalRefNorm);

  try {
    let newPhysiologicalRefNormEntry = await PhysiologicalReferenceNorms.create(
      newPhysiologicalRefNorm,
    );

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
  minSizeMaleCm: number,
  maxSizeMaleCm: number,
  minSizeFemaleCm: number,
  maxSizeFemaleCm: number,
  minWeightMaleKg: number,
  maxWeightMaleKg: number,
  minWeightFemaleKg: number,
  maxWeightFemaleKg: number,
  minAge: number,
  maxAge: number,
  growthStage: AnimalGrowthStage,
) {
  let updatedPhysiologicalRef = {
    minSizeMaleCm: minSizeMaleCm,
    maxSizeMaleCm: maxSizeMaleCm,
    minSizeFemaleCm: minSizeFemaleCm,
    maxSizeFemaleCm: maxSizeFemaleCm,
    minWeightMaleKg: minWeightMaleKg,
    maxWeightMaleKg: maxWeightMaleKg,
    minWeightFemaleKg: minWeightFemaleKg,
    maxWeightFemaleKg: maxWeightFemaleKg,
    minAge: minAge,
    maxAge: maxAge,
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
  amountPerMealGramMale: number,
  amountPerMealGramFemale: number,
  amountPerWeekGramMale: number,
  amountPerWeekGramFemale: number,
  presentationContainer: string,
  presentationMethod: string,
  presentationLocation: string,
  growthStage: string,
) {
  let newDietNeed = {
    animalFeedCategory: animalFeedCategory,
    amountPerMealGramMale: amountPerMealGramMale,
    amountPerMealGramFemale: amountPerMealGramFemale,
    amountPerWeekGramMale: amountPerWeekGramMale,
    amountPerWeekGramFemale: amountPerWeekGramFemale,
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
  amountPerMealGramMale: number,
  amountPerMealGramFemale: number,
  amountPerWeekGramMale: number,
  amountPerWeekGramFemale: number,
  presentationContainer: string,
  presentationMethod: string,
  presentationLocation: string,
  growthStage: string,
) {
  let updatedDietNeed = {
    animalFeedCategory: animalFeedCategory,
    amountPerMealGramMale: amountPerMealGramMale,
    amountPerMealGramFemale: amountPerMealGramFemale,
    amountPerWeekGramMale: amountPerWeekGramMale,
    amountPerWeekGramFemale: amountPerWeekGramFemale,
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
  //   throw { message: "Invalid Species Code!" };
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

export async function deleteCompatibility(
  speciesCode1: string,
  speciesCode2: string,
) {
  // Find the first species by ID
  const species1 = await Species.findByPk(
    await getSpeciesIdByCode(speciesCode1),
  );
  if (!species1) {
    throw new Error(`Species Code ${speciesCode1} not found.`);
  }

  // Find the second species by ID
  const species2 = await Species.findByPk(
    await getSpeciesIdByCode(speciesCode2),
  );
  if (!species2) {
    throw new Error(`Species Code ${speciesCode2} not found.`);
  }

  // Check if compatibility exists
  const compatibility = await Compatibility.findOne({
    where: {
      [Op.or]: [
        {
          speciesId1: species1.speciesId,
          speciesId2: species2.speciesId,
        },
        {
          speciesId1: species2.speciesId,
          speciesId2: species1.speciesId,
        },
      ],
    },
  });

  if (compatibility) {
    let result = await Compatibility.destroy({
      where: { compatibilityId: compatibility.compatibilityId },
    });

    if (result) {
      return result;
    }
  }
  throw new Error("Invalid Species Code(s)!");
}

export async function findIsLoved(speciesCode: string, email: string) {
  try {
    const species = await getSpeciesByCode(speciesCode, ["customers"]);

    if (species) {
      const customer = await CustomerService.findCustomerByEmail(email);
      console.log("is it here?");
      console.log(customer);
      if (customer) {
        const result = species.customers?.find(
          (speciesCustomer) =>
            speciesCustomer.customerId === customer.customerId,
        );

        if (result) {
          return true;
        } else {
          return false;
        }
      } else {
        throw new Error("Invalid Customer!");
      }
    } else {
      throw new Error("Invalid Species Code!");
    }
  } catch (error: any) {
    console.log("here???");
    console.log("the error message is " + error.message);
    throw { error: error.message };
  }
}

export async function getSpeciesLovedByCustomer(email: string) {
  try {
    let species = await Species.findAll({ include: ["customers", "animals"] });

    const customer = await CustomerService.findCustomerByEmail(email);
    let result: Species[] = [];
    if (species && customer) {
      for (let _species of species) {
        if (await findIsLoved(_species.speciesCode, email)) {
          for (let _animal of await _species.getAnimals()) {
            _animal.getEnclosure();
          }
          result.push(_species);
        }
      }

      console.log("this one " + result);
      return result;
    } else {
      throw new Error("Missing information!");
    }
  } catch (error: any) {
    console.log("here???");
    console.log("the error message is " + error.message);
    throw { error: error.message };
  }
}

export async function getSpeciesLovedByAllCustomer() {
  try {
    interface AggregatedSpecies {
      [key: string]: {
        speciesName: string;
        speciesCode: string;
        imageUrl: string;
        customerCount: number;
      };
    }
    const species = await Species.findAll({ include: ["customers"] });
    const aggregatedSpecies = species.reduce((acc: AggregatedSpecies, curr) => {
      const speciesCode: string = curr.speciesCode;
      const customerCount = curr.customers ? curr.customers.length : 0; // Count customers for each species
      const speciesName: string = curr.commonName;
      const imageUrl: string = curr.imageUrl;

      if (!acc[speciesCode]) {
        acc[speciesCode] = {
          speciesName,
          imageUrl,
          speciesCode,
          customerCount,
        };
      } else {
        acc[speciesCode].customerCount += customerCount;
      }
      return acc;
    }, {});
    return aggregatedSpecies;
  } catch (error: any) {
    console.log("here???");
    console.log("the error message is " + error.message);
    throw { error: error.message };
  }
}

export async function getSpeciesNotLovedByCustomer(email: string) {
  try {
    let species = await Species.findAll({ include: "customers" });

    const customer = await CustomerService.findCustomerByEmail(email);
    let result: Species[] = [];
    if (species && customer) {
      for (let _species of species) {
        if (!(await findIsLoved(_species.speciesCode, email))) {
          result.push(_species);
        }
      }

      console.log("this one " + result);
      return result;
    } else {
      throw new Error("Missing information!");
    }
  } catch (error: any) {
    console.log("here???");
    console.log("the error message is " + error.message);
    throw { error: error.message };
  }
}

export async function getFacilityForSpeciesLovedByCustomer(email: string) {
  try {
    const species: Species[] = await getSpeciesLovedByCustomer(email);
    const placesMap: Map<number, Facility> = new Map(); // Using a Map to prevent duplicate facilities

    if (species) {
      await Promise.all(
        species.map(async (_species) => {
          const animals = await _species.getAnimals();
          await Promise.all(
            animals.map(async (_animal) => {
              const enclosure = await _animal.getEnclosure();
              if (enclosure) {
                const facility = await enclosure.getFacility();
                if (facility && !placesMap.has(facility.facilityId)) {
                  placesMap.set(facility.facilityId, facility);
                }
              }
            }),
          );
        }),
      );
    }

    const places: Facility[] = Array.from(placesMap.values());
    return places;
  } catch (error: any) {
    throw { error: error.message };
  }
}

export async function setCustomerWithSpecies(
  speciesCode: string,
  email: string,
) {
  try {
    const species = await getSpeciesByCode(speciesCode, []);

    if (species) {
      const customer = await CustomerService.findCustomerByEmail(email);
      if (email) {
        await species.addCustomer(customer);
        await customer.addSpecies(species);

        console.log("setting customer with species");

        await species.save();
        await customer.save();

        console.log("customer with species " + species.customers);
        console.log(await species.getCustomers());

        setTimeout(async () => {
          const updatedSpecies = await Species.findByPk(species.speciesId, {
            include: "customers",
          });
          if (updatedSpecies) {
            console.log("Customer with species: ", updatedSpecies.customers);
          }
        }, 100);

        return species;
      } else {
        throw new Error("Invalid Customer!");
      }
    } else {
      throw new Error("Invalid Species Code!");
    }
  } catch (error: any) {
    throw { error: error.message };
  }
}

export async function unSetCustomerWithSpecies(
  speciesCode: string,
  email: string,
) {
  try {
    const species = await getSpeciesByCode(speciesCode, []);

    if (species) {
      const customer = await CustomerService.findCustomerByEmail(email);
      if (email) {
        await species.removeCustomer(customer);
        await customer.removeSpecies(species);

        species.save();
        customer.save();

        await species.getCustomers();

        return species;
      } else {
        throw new Error("Invalid Customer!");
      }
    } else {
      throw new Error("Invalid Species Code!");
    }
  } catch (error: any) {
    throw { error: error.message };
  }
}
