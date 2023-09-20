import { Request, Response } from "express";
import { Species } from "models/species";

import { createNewEmployee, findEmployeeByEmail } from "../services/employee";
import * as SpeciesService from "../services/species";

import { handleFileUpload } from "../helpers/multerProcessFile";

export async function getAllSpecies(req: Request, res: Response) {
  const { includes = "" } = req.body;
  const [_includes] = [
    includes.includes("speciesDietNeed"),
    includes.includes("speciesEnclosureNeed"),
    includes.includes("physiologicalReferenceNorms"),
  ];

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
  const [_includes] = [
    includes.includes("speciesDietNeed"),
    includes.includes("speciesEnclosureNeed"),
    includes.includes("physiologicalReferenceNorms"),
  ];

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
      educationalDescription,
      nativeContinent,
      nativeBiomes,
      groupSexualDynamic,
      habitatOrExhibit,
      generalDietPreference,
      lifeExpectancyYears,
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
        educationalDescription,
        nativeContinent,
        nativeBiomes,
        groupSexualDynamic,
        habitatOrExhibit,
        generalDietPreference,
        lifeExpectancyYears,
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
        educationalDescription,
        nativeContinent,
        nativeBiomes,
        groupSexualDynamic,
        habitatOrExhibit,
        generalDietPreference,
        lifeExpectancyYears,
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
      educationalDescription,
      nativeContinent,
      nativeBiomes,
      groupSexualDynamic,
      habitatOrExhibit,
      generalDietPreference,
      imageUrl,
      lifeExpectancyYears,
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
      educationalDescription,
      nativeContinent,
      nativeBiomes,
      groupSexualDynamic,
      habitatOrExhibit,
      generalDietPreference,
      lifeExpectancyYears,
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
        educationalDescription,
        nativeContinent,
        nativeBiomes,
        groupSexualDynamic,
        habitatOrExhibit,
        generalDietPreference,
        lifeExpectancyYears,
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
        educationalDescription,
        nativeContinent,
        nativeBiomes,
        groupSexualDynamic,
        habitatOrExhibit,
        generalDietPreference,
        lifeExpectancyYears,
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
      educationalDescription,
      nativeContinent,
      nativeBiomes,
      groupSexualDynamic,
      habitatOrExhibit,
      generalDietPreference,
      imageUrl,
      lifeExpectancyYears,
    );

    return res.status(200).json({ species });
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
    const { speciesCode, educationalDescription } = req.body;

    if ([speciesCode, educationalDescription].includes(undefined)) {
      console.log("Missing field(s): ", {
        speciesCode,
        educationalDescription,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let species = await SpeciesService.updateSpeciesEduDesc(
      speciesCode,
      educationalDescription,
    );

    return res.status(200).json({ species });
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
      soilPercenMin,
      soilPercenMax,
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
        soilPercenMin,
        soilPercenMax,
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
        soilPercenMin,
        soilPercenMax,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let species = await SpeciesService.createEnclosureNeeds(
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
      soilPercenMin,
      soilPercenMax,
    );

    return res.status(200).json({ species });
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
      soilPercenMin,
      soilPercenMax,
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
        soilPercenMin,
        soilPercenMax,
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
        soilPercenMin,
        soilPercenMax,
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
      soilPercenMin,
      soilPercenMax,
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
      sizeMaleCm,
      sizeFemaleCm,
      weightMaleKg,
      weightFemaleKg,
      ageToGrowthAge,
      growthStage,
    } = req.body;

    if (
      [
        speciesCode,
        sizeMaleCm,
        sizeFemaleCm,
        weightMaleKg,
        weightFemaleKg,
        ageToGrowthAge,
        growthStage,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        speciesCode,
        sizeMaleCm,
        sizeFemaleCm,
        weightMaleKg,
        weightFemaleKg,
        ageToGrowthAge,
        growthStage,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let physiologicalRefNorms =
      await SpeciesService.createPhysiologicalReferenceNorms(
        speciesCode,
        sizeMaleCm,
        sizeFemaleCm,
        weightMaleKg,
        weightFemaleKg,
        ageToGrowthAge,
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
      sizeMaleCm,
      sizeFemaleCm,
      weightMaleKg,
      weightFemaleKg,
      ageToGrowthAge,
      growthStage,
    } = req.body;

    if (
      [
        physiologicalRefId,
        sizeMaleCm,
        sizeFemaleCm,
        weightMaleKg,
        weightFemaleKg,
        ageToGrowthAge,
        growthStage,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        physiologicalRefId,
        sizeMaleCm,
        sizeFemaleCm,
        weightMaleKg,
        weightFemaleKg,
        ageToGrowthAge,
        growthStage,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let physiologicalRefNorms =
      await SpeciesService.updatePhysiologicalReferenceNorms(
        physiologicalRefId,
        sizeMaleCm,
        sizeFemaleCm,
        weightMaleKg,
        weightFemaleKg,
        ageToGrowthAge,
        growthStage,
      );

    return res.status(200).json({ physiologicalRefNorms });
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
    return res.status(200).json(physiologicalRefNorms);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
