import { Request, Response } from "express";
import { handleFileUpload } from "../helpers/multerProcessFile";
import * as SpeciesService from "../services/speciesService";
import { Species } from "models/Species";
import { Facility } from "models/Facility";

export async function getAllSpecies(req: Request, res: Response) {
  const { includes = "" } = req.body;

  const _includes: string[] = [];
  for (const role of [
    "speciesDietNeed",
    "speciesEnclosureNeed",
    "physiologicalReferenceNorms",
  ]) {
    if (includes.includes(role)) _includes.push(role);
  }

  try {
    const allSpecies = await SpeciesService.getAllSpecies(_includes);
    return res.status(200).json(allSpecies);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getSpeciesByCode(req: Request, res: Response) {
  const { speciesCode } = req.params;
  const { includes = "" } = req.body;

  const _includes: string[] = [];
  for (const role of [
    "speciesDietNeed",
    "speciesEnclosureNeed",
    "physiologicalReferenceNorms",
    "customers",
  ]) {
    if (includes.includes(role)) _includes.push(role);
  }

  _includes.push("customers");

  if (speciesCode == undefined) {
    console.log("Missing field(s): ", {
      speciesCode,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const species = await SpeciesService.getSpeciesByCode(
      speciesCode,
      _includes,
    );
    return res.status(200).json(species);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function createSpecies(req: Request, res: Response) {
  try {
    // const { email } = (req as any).locals.jwtPayload
    // const employee = await findEmployeeByEmail(email);

    // if (!((await employee.getPlanningStaff())?.plannerType == PlannerType.OPERATIONS_MANAGER)) {
    //     return res.status(403).json({error: "Access Denied! Operation managers only!"});
    // }
    console.log("req", req, req.file, req.files);
    const imageUrl = await handleFileUpload(
      req,
      process.env.IMG_URL_ROOT! + "species", //"D:/capstoneUploads/species",
    );
    const {
      commonName,
      scientificName,
      aliasName,
      conservationStatus,
      domain,
      kingdom,
      phylum,
      speciesClass,
      order,
      family,
      genus,
      nativeContinent,
      nativeBiomes,
      groupSexualDynamic,
      habitatOrExhibit,
      generalDietPreference,
      lifeExpectancyYears,
      ageToJuvenile,
      ageToAdolescent,
      ageToAdult,
      ageToElder,
    } = req.body;

    if (
      [
        commonName,
        scientificName,
        aliasName,
        conservationStatus,
        domain,
        kingdom,
        phylum,
        speciesClass,
        order,
        family,
        genus,
        nativeContinent,
        nativeBiomes,
        groupSexualDynamic,
        habitatOrExhibit,
        generalDietPreference,
        lifeExpectancyYears,
        ageToJuvenile,
        ageToAdolescent,
        ageToAdult,
        ageToElder,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        commonName,
        scientificName,
        aliasName,
        conservationStatus,
        domain,
        kingdom,
        phylum,
        speciesClass,
        order,
        family,
        genus,
        nativeContinent,
        nativeBiomes,
        groupSexualDynamic,
        habitatOrExhibit,
        generalDietPreference,
        lifeExpectancyYears,
        ageToJuvenile,
        ageToAdolescent,
        ageToAdult,
        ageToElder,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let species = await SpeciesService.createNewSpecies(
      commonName,
      scientificName,
      aliasName,
      conservationStatus,
      domain,
      kingdom,
      phylum,
      speciesClass,
      order,
      family,
      genus,
      nativeContinent,
      nativeBiomes,
      groupSexualDynamic,
      habitatOrExhibit,
      generalDietPreference,
      imageUrl,
      lifeExpectancyYears,
      ageToJuvenile,
      ageToAdolescent,
      ageToAdult,
      ageToElder,
    );

    return res.status(200).json({ species });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateSpecies(req: Request, res: Response) {
  try {
    let imageUrl;
    if (
      req.headers["content-type"] &&
      req.headers["content-type"].includes("multipart/form-data")
    ) {
      imageUrl = await handleFileUpload(
        req,
        process.env.IMG_URL_ROOT! + "species", //"D:/capstoneUploads/species",
      );
    } else {
      imageUrl = req.body.imageUrl;
    }
    const {
      speciesCode,
      commonName,
      scientificName,
      aliasName,
      conservationStatus,
      domain,
      kingdom,
      phylum,
      speciesClass,
      order,
      family,
      genus,
      nativeContinent,
      nativeBiomes,
      groupSexualDynamic,
      habitatOrExhibit,
      generalDietPreference,
      lifeExpectancyYears,
      ageToJuvenile,
      ageToAdolescent,
      ageToAdult,
      ageToElder,
    } = req.body;

    if (
      [
        speciesCode,
        commonName,
        scientificName,
        aliasName,
        conservationStatus,
        domain,
        kingdom,
        phylum,
        speciesClass,
        order,
        family,
        genus,
        nativeContinent,
        nativeBiomes,
        groupSexualDynamic,
        habitatOrExhibit,
        generalDietPreference,
        lifeExpectancyYears,
        ageToJuvenile,
        ageToAdolescent,
        ageToAdult,
        ageToElder,
        imageUrl,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        speciesCode,
        commonName,
        scientificName,
        aliasName,
        conservationStatus,
        domain,
        kingdom,
        phylum,
        speciesClass,
        order,
        family,
        genus,
        nativeContinent,
        nativeBiomes,
        groupSexualDynamic,
        habitatOrExhibit,
        generalDietPreference,
        lifeExpectancyYears,
        ageToJuvenile,
        ageToAdolescent,
        ageToAdult,
        ageToElder,
        imageUrl,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let species = await SpeciesService.updateSpecies(
      speciesCode,
      commonName,
      scientificName,
      aliasName,
      conservationStatus,
      domain,
      kingdom,
      phylum,
      speciesClass,
      order,
      family,
      genus,
      nativeContinent,
      nativeBiomes,
      groupSexualDynamic,
      habitatOrExhibit,
      generalDietPreference,
      imageUrl,
      lifeExpectancyYears,
      ageToJuvenile,
      ageToAdolescent,
      ageToAdult,
      ageToElder,
    );

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteSpeciesByCode(req: Request, res: Response) {
  const { speciesCode } = req.params;

  if (speciesCode == undefined) {
    console.log("Missing field(s): ", {
      speciesCode,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const species = await SpeciesService.deleteSpeciesByCode(speciesCode);
    return res.status(200).json(species);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

//Species EduDesc
export async function getSpeciesEduDescBySpeciesCode(
  req: Request,
  res: Response,
) {
  const { speciesCode } = req.params;
  if (speciesCode == undefined) {
    console.log("Missing field(s): ", {
      speciesCode,
    });
    return res.status(400).json({ error: "Missing information!" });
  }
  try {
    const speciesEduDesc =
      await SpeciesService.getSpeciesEduDescBySpeciesCode(speciesCode);
    return res.status(200).json(speciesEduDesc);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateSpeciesEduDesc(req: Request, res: Response) {
  try {
    // const imageUrl = await handleFileUpload(
    //     req,
    //     process.env.IMG_URL_ROOT! + "species", //"D:/capstoneUploads/species",
    // );
    const { speciesCode, educationalDescription, educationalFunFact } =
      req.body;

    if (
      [speciesCode, educationalDescription, educationalFunFact].includes(
        undefined,
      )
    ) {
      console.log("Missing field(s): ", {
        speciesCode,
        educationalDescription,
        educationalFunFact,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let species = await SpeciesService.updateSpeciesEduDesc(
      speciesCode,
      educationalDescription,
      educationalFunFact,
    );

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

//Species Food Remark
export async function getSpeciesFoodRemarkBySpeciesCode(
  req: Request,
  res: Response,
) {
  const { speciesCode } = req.params;
  if (speciesCode == undefined) {
    console.log("Missing field(s): ", {
      speciesCode,
    });
    return res.status(400).json({ error: "Missing information!" });
  }
  try {
    const speciesFoodRemark =
      await SpeciesService.getSpeciesFoodRemark(speciesCode);
    return res.status(200).json(speciesFoodRemark);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateSpeciesFoodRemark(req: Request, res: Response) {
  try {
    const { speciesCode, foodRemark } = req.body;

    if ([speciesCode, foodRemark].includes(undefined)) {
      console.log("Missing field(s): ", {
        speciesCode,
        foodRemark,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let speciesFoodRemark = await SpeciesService.updateSpeciesFoodRemark(
      speciesCode,
      foodRemark,
    );

    return res.status(200).json({ speciesFoodRemark });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getSpeciesEnclosureNeedsBySpeciesCode(
  req: Request,
  res: Response,
) {
  const { speciesCode } = req.params;
  if (speciesCode == undefined) {
    console.log("Missing field(s): ", {
      speciesCode,
    });
    return res.status(400).json({ error: "Missing information!" });
  }
  try {
    const speciesEnclsoureNeeds =
      await SpeciesService.getEnclosureNeedsBySpeciesCode(speciesCode);
    return res.status(200).json(speciesEnclsoureNeeds);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function createSpeciesEnclosureNeeds(req: Request, res: Response) {
  try {
    const {
      speciesCode,
      smallExhibitHeightRequired,
      minLandAreaRequired,
      minWaterAreaRequired,
      acceptableTempMin,
      acceptableTempMax,
      acceptableHumidityMin,
      acceptableHumidityMax,
      recommendedStandOffBarrierDistMetres,
      plantationCoveragePercentMin,
      plantationCoveragePercentMax,
      longGrassPercentMin,
      longGrassPercentMax,
      shortGrassPercentMin,
      shortGrassPercentMax,
      rockPercentMin,
      rockPercentMax,
      sandPercentMin,
      sandPercentMax,
      snowPercentMin,
      snowPercentMax,
      soilPercentMin,
      soilPercentMax,
    } = req.body;

    if (
      [
        speciesCode,
        smallExhibitHeightRequired,
        minLandAreaRequired,
        minWaterAreaRequired,
        acceptableTempMin,
        acceptableTempMax,
        acceptableHumidityMin,
        acceptableHumidityMax,
        recommendedStandOffBarrierDistMetres,
        plantationCoveragePercentMin,
        plantationCoveragePercentMax,
        longGrassPercentMin,
        longGrassPercentMax,
        shortGrassPercentMin,
        shortGrassPercentMax,
        rockPercentMin,
        rockPercentMax,
        sandPercentMin,
        sandPercentMax,
        snowPercentMin,
        snowPercentMax,
        soilPercentMin,
        soilPercentMax,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        speciesCode,
        smallExhibitHeightRequired,
        minLandAreaRequired,
        minWaterAreaRequired,
        acceptableTempMin,
        acceptableTempMax,
        acceptableHumidityMin,
        acceptableHumidityMax,
        recommendedStandOffBarrierDistMetres,
        plantationCoveragePercentMin,
        plantationCoveragePercentMax,
        longGrassPercentMin,
        longGrassPercentMax,
        shortGrassPercentMin,
        shortGrassPercentMax,
        rockPercentMin,
        rockPercentMax,
        sandPercentMin,
        sandPercentMax,
        snowPercentMin,
        snowPercentMax,
        soilPercentMin,
        soilPercentMax,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let speciesEnclosureNeeds = await SpeciesService.createEnclosureNeeds(
      speciesCode,
      smallExhibitHeightRequired,
      minLandAreaRequired,
      minWaterAreaRequired,
      acceptableTempMin,
      acceptableTempMax,
      acceptableHumidityMin,
      acceptableHumidityMax,
      recommendedStandOffBarrierDistMetres,
      plantationCoveragePercentMin,
      plantationCoveragePercentMax,
      longGrassPercentMin,
      longGrassPercentMax,
      shortGrassPercentMin,
      shortGrassPercentMax,
      rockPercentMin,
      rockPercentMax,
      sandPercentMin,
      sandPercentMax,
      snowPercentMin,
      snowPercentMax,
      soilPercentMin,
      soilPercentMax,
    );

    return res.status(200).json({ speciesEnclosureNeeds });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateSpeciesEnclosureNeeds(req: Request, res: Response) {
  try {
    const {
      speciesEnclosureNeedId,
      smallExhibitHeightRequired,
      minLandAreaRequired,
      minWaterAreaRequired,
      acceptableTempMin,
      acceptableTempMax,
      acceptableHumidityMin,
      acceptableHumidityMax,
      recommendedStandOffBarrierDistMetres,
      plantationCoveragePercentMin,
      plantationCoveragePercentMax,
      longGrassPercentMin,
      longGrassPercentMax,
      shortGrassPercentMin,
      shortGrassPercentMax,
      rockPercentMin,
      rockPercentMax,
      sandPercentMin,
      sandPercentMax,
      snowPercentMin,
      snowPercentMax,
      soilPercentMin,
      soilPercentMax,
    } = req.body;

    if (
      [
        speciesEnclosureNeedId,
        smallExhibitHeightRequired,
        minLandAreaRequired,
        minWaterAreaRequired,
        acceptableTempMin,
        acceptableTempMax,
        acceptableHumidityMin,
        acceptableHumidityMax,
        recommendedStandOffBarrierDistMetres,
        plantationCoveragePercentMin,
        plantationCoveragePercentMax,
        longGrassPercentMin,
        longGrassPercentMax,
        shortGrassPercentMin,
        shortGrassPercentMax,
        rockPercentMin,
        rockPercentMax,
        sandPercentMin,
        sandPercentMax,
        snowPercentMin,
        snowPercentMax,
        soilPercentMin,
        soilPercentMax,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        speciesEnclosureNeedId,
        smallExhibitHeightRequired,
        minLandAreaRequired,
        minWaterAreaRequired,
        acceptableTempMin,
        acceptableTempMax,
        acceptableHumidityMin,
        acceptableHumidityMax,
        recommendedStandOffBarrierDistMetres,
        plantationCoveragePercentMin,
        plantationCoveragePercentMax,
        longGrassPercentMin,
        longGrassPercentMax,
        shortGrassPercentMin,
        shortGrassPercentMax,
        rockPercentMin,
        rockPercentMax,
        sandPercentMin,
        sandPercentMax,
        snowPercentMin,
        snowPercentMax,
        soilPercentMin,
        soilPercentMax,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let speciesEnclosureNeeds = await SpeciesService.updateEnclosureNeeds(
      speciesEnclosureNeedId,
      smallExhibitHeightRequired,
      minLandAreaRequired,
      minWaterAreaRequired,
      acceptableTempMin,
      acceptableTempMax,
      acceptableHumidityMin,
      acceptableHumidityMax,
      recommendedStandOffBarrierDistMetres,
      plantationCoveragePercentMin,
      plantationCoveragePercentMax,
      longGrassPercentMin,
      longGrassPercentMax,
      shortGrassPercentMin,
      shortGrassPercentMax,
      rockPercentMin,
      rockPercentMax,
      sandPercentMin,
      sandPercentMax,
      snowPercentMin,
      snowPercentMax,
      soilPercentMin,
      soilPercentMax,
    );

    return res.status(200).json({ speciesEnclosureNeeds });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteSpeciesEnclosureNeeds(req: Request, res: Response) {
  const { speciesEnclosureNeedId } = req.params;

  if (speciesEnclosureNeedId == undefined) {
    console.log("Missing field(s): ", {
      speciesEnclosureNeedId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const species = await SpeciesService.deleteSpeciesEnclosureNeeds(
      speciesEnclosureNeedId,
    );
    return res.status(200).json(species);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function createPhysiologicalReferenceNorms(
  req: Request,
  res: Response,
) {
  try {
    const {
      speciesCode,
      minSizeMaleCm,
      maxSizeMaleCm,
      minSizeFemaleCm,
      maxSizeFemaleCm,
      minWeightMaleKg,
      maxWeightMaleKg,
      minWeightFemaleKg,
      maxWeightFemaleKg,
      minAge,
      maxAge,
      growthStage,
    } = req.body;

    if (
      [
        speciesCode,
        minSizeMaleCm,
        maxSizeMaleCm,
        minSizeFemaleCm,
        maxSizeFemaleCm,
        minWeightMaleKg,
        maxWeightMaleKg,
        minWeightFemaleKg,
        maxWeightFemaleKg,
        minAge,
        maxAge,
        growthStage,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        speciesCode,
        minSizeMaleCm,
        maxSizeMaleCm,
        minSizeFemaleCm,
        maxSizeFemaleCm,
        minWeightMaleKg,
        maxWeightMaleKg,
        minWeightFemaleKg,
        maxWeightFemaleKg,
        minAge,
        maxAge,
        growthStage,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let physiologicalRefNorms =
      await SpeciesService.createPhysiologicalReferenceNorms(
        speciesCode,
        minSizeMaleCm,
        maxSizeMaleCm,
        minSizeFemaleCm,
        maxSizeFemaleCm,
        minWeightMaleKg,
        maxWeightMaleKg,
        minWeightFemaleKg,
        maxWeightFemaleKg,
        minAge,
        maxAge,
        growthStage,
      );

    return res.status(200).json({ physiologicalRefNorms });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllPhysiologicalReferenceNormsbySpeciesCode(
  req: Request,
  res: Response,
) {
  const { speciesCode } = req.params;
  try {
    const allPhysiologicalReferenceNorms =
      await SpeciesService.getAllPhysiologicalReferenceNormsbySpeciesCode(
        speciesCode,
      );
    return res.status(200).json(allPhysiologicalReferenceNorms);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getPhysiologicalReferenceNormsById(
  req: Request,
  res: Response,
) {
  const { physiologicalRefId } = req.params;
  if (physiologicalRefId == undefined) {
    console.log("Missing field(s): ", {
      physiologicalRefId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }
  try {
    const speciesPhysiologicalReferenceNorms =
      await SpeciesService.getPhysiologicalReferenceNormsById(
        physiologicalRefId,
      );
    return res.status(200).json(speciesPhysiologicalReferenceNorms);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updatePhysiologicalReferenceNorms(
  req: Request,
  res: Response,
) {
  try {
    const {
      physiologicalRefId,
      minSizeMaleCm,
      maxSizeMaleCm,
      minSizeFemaleCm,
      maxSizeFemaleCm,
      minWeightMaleKg,
      maxWeightMaleKg,
      minWeightFemaleKg,
      maxWeightFemaleKg,
      minAge,
      maxAge,
      growthStage,
    } = req.body;

    if (
      [
        physiologicalRefId,
        minSizeMaleCm,
        maxSizeMaleCm,
        minSizeFemaleCm,
        maxSizeFemaleCm,
        minWeightMaleKg,
        maxWeightMaleKg,
        minWeightFemaleKg,
        maxWeightFemaleKg,
        minAge,
        maxAge,
        growthStage,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        physiologicalRefId,
        minSizeMaleCm,
        maxSizeMaleCm,
        minSizeFemaleCm,
        maxSizeFemaleCm,
        minWeightMaleKg,
        maxWeightMaleKg,
        minWeightFemaleKg,
        maxWeightFemaleKg,
        minAge,
        maxAge,
        growthStage,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let physiologicalRefNorms =
      await SpeciesService.updatePhysiologicalReferenceNorms(
        physiologicalRefId,
        minSizeMaleCm,
        maxSizeMaleCm,
        minSizeFemaleCm,
        maxSizeFemaleCm,
        minWeightMaleKg,
        maxWeightMaleKg,
        minWeightFemaleKg,
        maxWeightFemaleKg,
        minAge,
        maxAge,
        growthStage,
      );

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deletePhysiologicalReferenceNorms(
  req: Request,
  res: Response,
) {
  const { physiologicalRefId } = req.params;

  if (physiologicalRefId == undefined) {
    console.log("Missing field(s): ", {
      physiologicalRefId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const physiologicalRefNorms =
      await SpeciesService.deletePhysiologicalReferenceNorms(
        physiologicalRefId,
      );
    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function createDietNeed(req: Request, res: Response) {
  try {
    const {
      speciesCode,
      animalFeedCategory,
      amountPerMealGramMale,
      amountPerMealGramFemale,
      amountPerWeekGramMale,
      amountPerWeekGramFemale,
      presentationContainer,
      presentationMethod,
      presentationLocation,
      growthStage,
    } = req.body;

    if (
      [
        speciesCode,
        animalFeedCategory,
        amountPerMealGramMale,
        amountPerMealGramFemale,
        amountPerWeekGramMale,
        amountPerWeekGramFemale,
        presentationContainer,
        presentationMethod,
        presentationLocation,
        growthStage,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        speciesCode,
        animalFeedCategory,
        amountPerMealGramMale,
        amountPerMealGramFemale,
        amountPerWeekGramMale,
        amountPerWeekGramFemale,
        presentationContainer,
        presentationMethod,
        presentationLocation,
        growthStage,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let dietNeed = await SpeciesService.createDietNeed(
      speciesCode,
      animalFeedCategory,
      amountPerMealGramMale,
      amountPerMealGramFemale,
      amountPerWeekGramMale,
      amountPerWeekGramFemale,
      presentationContainer,
      presentationMethod,
      presentationLocation,
      growthStage,
    );

    return res.status(200).json({ dietNeed });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllDietNeedbySpeciesCode(req: Request, res: Response) {
  const { speciesCode } = req.params;
  try {
    const allDietNeeds =
      await SpeciesService.getAllDietNeedbySpeciesCode(speciesCode);
    return res.status(200).json(allDietNeeds);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getDietNeedById(req: Request, res: Response) {
  const { speciesDietNeedId } = req.params;
  if (speciesDietNeedId == undefined) {
    console.log("Missing field(s): ", {
      speciesDietNeedId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }
  try {
    const dietNeed = await SpeciesService.getDietNeedById(speciesDietNeedId);
    return res.status(200).json(dietNeed);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateDietNeed(req: Request, res: Response) {
  try {
    const {
      speciesDietNeedId,
      animalFeedCategory,
      amountPerMealGramMale,
      amountPerMealGramFemale,
      amountPerWeekGramMale,
      amountPerWeekGramFemale,
      presentationContainer,
      presentationMethod,
      presentationLocation,
      growthStage,
    } = req.body;

    if (
      [
        speciesDietNeedId,
        animalFeedCategory,
        amountPerMealGramMale,
        amountPerMealGramFemale,
        amountPerWeekGramMale,
        amountPerWeekGramFemale,
        presentationContainer,
        presentationMethod,
        presentationLocation,
        growthStage,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        speciesDietNeedId,
        animalFeedCategory,
        amountPerMealGramMale,
        amountPerMealGramFemale,
        amountPerWeekGramMale,
        amountPerWeekGramFemale,
        presentationContainer,
        presentationMethod,
        presentationLocation,
        growthStage,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let dietNeed = await SpeciesService.updateDietNeed(
      speciesDietNeedId,
      animalFeedCategory,
      amountPerMealGramMale,
      amountPerMealGramFemale,
      amountPerWeekGramMale,
      amountPerWeekGramFemale,
      presentationContainer,
      presentationMethod,
      presentationLocation,
      growthStage,
    );

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteDietNeed(req: Request, res: Response) {
  const { speciesDietNeedId } = req.params;

  if (speciesDietNeedId == undefined) {
    console.log("Missing field(s): ", {
      speciesDietNeedId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const dietNeed = await SpeciesService.deleteDietNeed(speciesDietNeedId);
    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function createCompatibility(req: Request, res: Response) {
  try {
    const { speciesCode1, speciesCode2 } = req.body;

    if ([speciesCode1, speciesCode2].includes(undefined)) {
      console.log("Missing field(s): ", {
        speciesCode1,
        speciesCode2,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let compatibility = await SpeciesService.createCompatibility(
      speciesCode1,
      speciesCode2,
    );

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllCompatibilitiesbySpeciesCode(
  req: Request,
  res: Response,
) {
  const { speciesCode } = req.params;
  try {
    const allCompatibility =
      await SpeciesService.getAllCompatibilitiesbySpeciesCode(speciesCode);
    return res.status(200).json(allCompatibility);
  } catch (error: any) {
    console.error("An error occurred:", error);
    // res.status(400).json({ error: error.message });
    res.status(400).json({ error: error.message });
  }
}

export async function checkIsCompatible(req: Request, res: Response) {
  const { speciesCode1, speciesCode2 } = req.params;
  try {
    const isCompatible = await SpeciesService.checkIsCompatible(
      speciesCode1,
      speciesCode2,
    );
    return res.status(200).json(isCompatible);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteCompatibility(req: Request, res: Response) {
  const { speciesCode1, speciesCode2 } = req.params;

  if (speciesCode1 == undefined || speciesCode2 == undefined) {
    console.log("Missing field(s): ", {
      speciesCode1,
      speciesCode2,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const compatibility = await SpeciesService.deleteCompatibility(
      speciesCode1,
      speciesCode2,
    );
    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function findIsLoved(req: Request, res: Response) {
  try {
    console.log("here");
    const { email } = (req as any).locals.jwtPayload;
    const { speciesCode } = req.params;
    console.log("here");
    if (email && speciesCode) {
      const result = await SpeciesService.findIsLoved(speciesCode, email);
      console.log("here is the result" + result);
      return res.status(200).json({ result: result });
    } else {
      return res.status(400).json({ error: "Missing Information" });
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function setCustomerWithSpecies(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const { speciesCode } = req.params;

    if (email && speciesCode) {
      const result = await SpeciesService.setCustomerWithSpecies(
        speciesCode,
        email,
      );

      return res.status(200).json({ result: result.toJSON() });
    } else {
      return res.status(400).json({ error: "Missing Information" });
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function unSetCustomerWithSpecies(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const { speciesCode } = req.params;

    if (email && speciesCode) {
      const result = await SpeciesService.unSetCustomerWithSpecies(
        speciesCode,
        email,
      );

      return res.status(200).json({ result: result.toJSON() });
    } else {
      return res.status(400).json({ error: "Missing Information" });
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getSpeciesLovedByCustomer(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;

    if (email) {
      const result = await SpeciesService.getSpeciesLovedByCustomer(email);

      return res
        .status(200)
        .json({ result: result?.map((_result: Species) => _result.toJSON()) });
    } else {
      return res.status(400).json({ error: "Missing Information" });
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getSpeciesLovedByAllCustomer(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;

    if (email) {
      const result = await SpeciesService.getSpeciesLovedByAllCustomer();

      return res.status(200).json({ result: result });
    } else {
      return res.status(400).json({ error: "Access required" });
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getSpeciesNotLovedByCustomer(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;

    if (email) {
      const result = await SpeciesService.getSpeciesNotLovedByCustomer(email);

      return res
        .status(200)
        .json({ result: result?.map((_result: Species) => _result.toJSON()) });
    } else {
      return res.status(400).json({ error: "Missing Information" });
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getFacilityForSpeciesLovedByCustomer(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;

    if (email) {
      const result =
        await SpeciesService.getFacilityForSpeciesLovedByCustomer(email);

      return res
        .status(200)
        .json({ result: result?.map((_result: Facility) => _result.toJSON()) });
    } else {
      return res.status(400).json({ error: "Missing Information" });
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
