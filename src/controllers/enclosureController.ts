import { Request, Response } from "express";
import { handleFileUpload } from "../helpers/multerProcessFile";
import * as EnclosureService from "../services/enclosureService";

export async function getAllEnclosures(req: Request, res: Response) {
  try {
    const allEnclosures = await EnclosureService.getAllEnclosures();
    return res.status(200).json(allEnclosures);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllEnclosuresFacility(req: Request, res: Response) {
  try {
    const allEnclosures = await EnclosureService.getAllEnclosures();
    const facilities = allEnclosures.map((enclosure) => enclosure.facility); // Assuming each enclosure has a 'facility' property
    return res.status(200).json({ facilities: facilities });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getEnclosureById(req: Request, res: Response) {
  const { enclosureId } = req.params;

  if (enclosureId == undefined) {
    console.log("Missing field(s): ", {
      enclosureId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const enclosure = await EnclosureService.getEnclosureById(
      Number(enclosureId),
    );
    return res.status(200).json(enclosure);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function createNewEnclosure(req: Request, res: Response) {
  try {
    const imageUrl = await handleFileUpload(
      req,
      process.env.IMG_URL_ROOT! + "enclosure", //"D:/capstoneUploads/enclosure",
    );
    const {
      name,
      remark,
      length,
      width,
      height,
      enclosureStatus,
      standOffBarrierDist,
      facilityName,
      isSheltered,
    } = req.body;

    if (
      [
        name,
        remark,
        length,
        width,
        height,
        enclosureStatus,
        standOffBarrierDist,
        facilityName,
        isSheltered,
        imageUrl,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        name,
        remark,
        length,
        width,
        height,
        enclosureStatus,
        standOffBarrierDist,
        facilityName,
        isSheltered,
        imageUrl,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let enclosure = await EnclosureService.createNewEnclosure(
      name,
      remark,
      length,
      width,
      height,
      enclosureStatus,
      standOffBarrierDist,
      facilityName,
      isSheltered,
      imageUrl,
    );

    return res.status(200).json({ enclosure });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateEnclosure(req: Request, res: Response) {
  try {
    // let imageUrl;
    // if (
    //   req.headers["content-type"] &&
    //   req.headers["content-type"].includes("multipart/form-data")
    // ) {
    //   imageUrl = await handleFileUpload(
    //     req,
    //     process.env.IMG_URL_ROOT! + "facility",
    //   );
    // } else {
    //   imageUrl = req.body.imageUrl;
    // }
    const {
      enclosureId,
      name,
      remark,
      length,
      width,
      height,
      enclosureStatus,
      standOffBarrierDist,
    } = req.body;

    if (
      [
        enclosureId,
        name,
        remark,
        length,
        width,
        height,
        enclosureStatus,
        standOffBarrierDist,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        enclosureId,
        name,
        remark,
        length,
        width,
        height,
        enclosureStatus,
        standOffBarrierDist,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let enclosure = await EnclosureService.updateEnclosure(
      enclosureId,
      name,
      remark,
      length,
      width,
      height,
      enclosureStatus,
      standOffBarrierDist,
    );

    return res.status(200).json({ enclosure });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateEnclosureStatus(req: Request, res: Response) {
  try {
    const { enclosureId, enclosureStatus } = req.body;

    if ([enclosureId, enclosureStatus].includes(undefined)) {
      console.log("Missing field(s): ", {
        enclosureId,
        enclosureStatus,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let enclosure = await EnclosureService.updateEnclosureStatus(
      Number(enclosureId),
      enclosureStatus,
    );

    return res.status(200).json({ enclosure });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteEnclosure(req: Request, res: Response) {
  const { enclosureId } = req.params;

  if (enclosureId == undefined) {
    console.log("Missing field(s): ", {
      enclosureId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const enclosure = await EnclosureService.deleteEnclosure(
      Number(enclosureId),
    );
    return res.status(200).json(enclosure);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

// getanimalsofenclosure/:enclosureId
export async function getAnimalsOfEnclosure(req: Request, res: Response) {
  const { enclosureId } = req.params;

  if (enclosureId == undefined) {
    console.log("Missing field(s): ", {
      enclosureId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const animalsList = await EnclosureService.getAnimalsOfEnclosure(
      Number(enclosureId),
    );
    return res.status(200).json({ animalsList });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

// assignAnimalToEnclosure
export async function assignAnimalToEnclosure(req: Request, res: Response) {
  try {
    const { enclosureId, animalCode } = req.body;

    if ([enclosureId, animalCode].includes(undefined)) {
      console.log("Missing field(s): ", {
        enclosureId,
        animalCode,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let enclosure = await EnclosureService.assignAnimalToEnclosure(
      Number(enclosureId),
      animalCode,
    );

    return res.status(200).json({ enclosure });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

// removeAnimalFromEnclosure
export async function removeAnimalFromEnclosure(req: Request, res: Response) {
  try {
    const { enclosureId, animalCode } = req.body;

    if ([enclosureId, animalCode].includes(undefined)) {
      console.log("Missing field(s): ", {
        enclosureId,
        animalCode,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let enclosure = await EnclosureService.removeAnimalFromEnclosure(
      Number(enclosureId),
      animalCode,
    );

    return res.status(200).json({ enclosure });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

// getSpeciesCompatibilityInEnclosure
export async function getSpeciesCompatibilityInEnclosure(
  req: Request,
  res: Response,
) {
  try {
    const { speciesCode, enclosureId } = req.params;

    if (enclosureId == undefined || speciesCode == undefined) {
      console.log("Missing field(s): ", {
        enclosureId,
        speciesCode,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let isCompatible =
      await EnclosureService.getSpeciesCompatibilityInEnclosure(
        Number(enclosureId),
        speciesCode,
      );

    return res.status(200).json({ isCompatible });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateDesignDiagram(req: Request, res: Response) {
  try {
    const { enclosureId } = req.params;
    const { designDiagramJson, landArea, waterArea, plantationCoveragePercent } =
      req.body;
    if (enclosureId == undefined) {
      console.log("Missing field(s): ", {
        enclosureId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    if (
      [
        designDiagramJson,
        landArea,
        waterArea,
        plantationCoveragePercent,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        designDiagramJson,
        landArea,
        waterArea,
        plantationCoveragePercent,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    await EnclosureService.updateDesignDiagram(
      Number(enclosureId),
      designDiagramJson,
      Number(landArea),
      Number(waterArea),
      Number(plantationCoveragePercent),
    );

    return res.status(200).json("Successfully saved diagram!");
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function assignKeepersToEnclosure(req: Request, res: Response) {
  const { enclosureId, employeeIds } = req.body;

  if ([enclosureId, employeeIds].includes(undefined)) {
    console.log("Missing field(s): ", {
      enclosureId,
      employeeIds,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    await EnclosureService.assignKeepersToEnclosure(
      Number(enclosureId),
      employeeIds.map((employeeId: string) => Number(employeeId)),
    );
    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    console.log("error", error);
    res.status(400).json({ error: error.message });
  }
}

export async function removeKeepersFromEnclosure(req: Request, res: Response) {
  const { enclosureId, employeeIds } = req.body;

  if ([enclosureId, employeeIds].includes(undefined)) {
    console.log("Missing field(s): ", {
      enclosureId,
      employeeIds,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    await EnclosureService.removeKeepersFromEnclosure(
      Number(enclosureId),
      employeeIds.map((employeeId: string) => Number(employeeId)),
    );
    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateEnclosureTerrainDistribution(
  req: Request,
  res: Response,
) {
  try {
    const {
      enclosureId,
      longGrassPercent,
      shortGrassPercent,
      rockPercent,
      sandPercent,
      snowPercent,
      soilPercent,
    } = req.body;

    if (
      [
        enclosureId,
        longGrassPercent,
        shortGrassPercent,
        rockPercent,
        sandPercent,
        snowPercent,
        soilPercent,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        enclosureId,
        longGrassPercent,
        shortGrassPercent,
        rockPercent,
        sandPercent,
        snowPercent,
        soilPercent,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let enclosureTerrainDistribution =
      await EnclosureService.updateEnclosureTerrainDistribution(
        enclosureId,
        longGrassPercent,
        shortGrassPercent,
        rockPercent,
        sandPercent,
        snowPercent,
        soilPercent,
      );

    return res.status(200).json({ enclosureTerrainDistribution });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteEnclosureTerrainDistribution(
  req: Request,
  res: Response,
) {
  try {
    const { enclosureId } = req.params;

    if (enclosureId == undefined) {
      console.log("Missing field(s): ", {
        enclosureId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let enclosureTerrainDistributionToDelete =
      await EnclosureService.deleteEnclosureTerrainDistribution(
        Number(enclosureId),
      );

    return res.status(200).json({ enclosureTerrainDistributionToDelete });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getEnclosureTerrainDistributionRecommendation(
  req: Request,
  res: Response,
) {
  try {
    const { enclosureId } = req.params;

    if (enclosureId == undefined) {
      console.log("Missing field(s): ", {
        enclosureId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let enclosureTerrainDistributionReco =
      await EnclosureService.getEnclosureTerrainDistributionRecommendation(
        Number(enclosureId),
      );

    return res.status(200).json({ enclosureTerrainDistributionReco });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateEnclosureClimateDesign(
  req: Request,
  res: Response,
) {
  try {
    const {
      enclosureId,
      acceptableTempMin,
      acceptableTempMax,
      acceptableHumidityMin,
      acceptableHumidityMax,
    } = req.body;

    if (
      [
        enclosureId,
        acceptableTempMin,
        acceptableTempMax,
        acceptableHumidityMin,
        acceptableHumidityMax,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        enclosureId,
        acceptableTempMin,
        acceptableTempMax,
        acceptableHumidityMin,
        acceptableHumidityMax,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let enclosureClimateDesign =
      await EnclosureService.updateEnclosureClimateDesign(
        enclosureId,
        acceptableTempMin,
        acceptableTempMax,
        acceptableHumidityMin,
        acceptableHumidityMax,
      );

    return res.status(200).json({ enclosureClimateDesign });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteEnclosureClimateDesign(
  req: Request,
  res: Response,
) {
  try {
    const { enclosureId } = req.params;

    if (enclosureId == undefined) {
      console.log("Missing field(s): ", {
        enclosureId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let enclosureTerrainDistributionToDelete =
      await EnclosureService.deleteEnclosureClimateDesign(Number(enclosureId));

    return res.status(200).json({ enclosureTerrainDistributionToDelete });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

// export async function getClimateDesignRecommendation(
//   req: Request,
//   res: Response,
// ) {
//   try {
//     const { enclosureId } = req.params;

//     if (enclosureId == undefined) {
//       console.log("Missing field(s): ", {
//         enclosureId,
//       });
//       return res.status(400).json({ error: "Missing information!" });
//     }

//     // have to pass in req for image uploading
//     let enclosureClimateDesignReco =
//       await EnclosureService.getClimateDesignRecommendation(
//         Number(enclosureId),
//       );

//     return res.status(200).json({ enclosureClimateDesignReco });
//   } catch (error: any) {
//     res.status(400).json({ error: error.message });
//   }
// }

export async function getAllPlantations(req: Request, res: Response) {
  try {
    const allPlantations = await EnclosureService.getAllPlantations();
    return res.status(200).json(allPlantations);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllPlantationsByEnclosureId(
  req: Request,
  res: Response,
) {
  const { enclosureId } = req.params;

  if (enclosureId == undefined) {
    console.log("Missing field(s): ", {
      enclosureId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const enclosurePlanatations =
      await EnclosureService.getAllPlantationsByEnclosureId(
        Number(enclosureId),
      );
    return res.status(200).json(enclosurePlanatations);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function addPlantationToEnclosure(req: Request, res: Response) {
  try {
    const { enclosureId, plantationId } = req.body;

    if ([enclosureId, plantationId].includes(undefined)) {
      console.log("Missing field(s): ", {
        enclosureId,
        plantationId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let result = await EnclosureService.addPlantationToEnclosure(
      Number(enclosureId),
      Number(plantationId),
    );

    return res.status(200).json({ result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function removePlantationFromEnclosure(
  req: Request,
  res: Response,
) {
  try {
    const { enclosureId, plantationId } = req.body;

    if ([enclosureId, plantationId].includes(undefined)) {
      console.log("Missing field(s): ", {
        enclosureId,
        plantationId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let result = await EnclosureService.removePlantationFromEnclosure(
      Number(enclosureId),
      Number(plantationId),
    );

    return res.status(200).json({ result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getEnvironmentSensorsData(req: Request, res: Response) {
  try {
    const { enclosureId } = req.params;

    if ([enclosureId].includes("")) {
      console.log("Missing field(s): ", {
        enclosureId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let environmentData = await EnclosureService.getEnvironmentSensorsData(
      Number(enclosureId),
    );

    return res.status(200).json({ environmentData: environmentData });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getEnclosureBarrier(req: Request, res: Response) {
  const { enclosureId } = req.params;

  if (enclosureId == undefined) {
    console.log("Missing field(s): ", {
      enclosureId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const enclosureBarrier = await EnclosureService.getEnclosureBarrier(
      Number(enclosureId),
    );
    return res.status(200).json(enclosureBarrier);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function createNewEnclosureBarrier(req: Request, res: Response) {
  try {
    let { enclosureId, wallName, barrierType, remarks } = req.body;

    if ([enclosureId, wallName, barrierType, remarks].includes(undefined)) {
      console.log("Missing field(s): ", {
        enclosureId,
        wallName,
        barrierType,
        remarks,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let enclosureBarrier = await EnclosureService.createNewEnclosureBarrier(
      Number(enclosureId),
      wallName,
      barrierType,
      remarks,
    );

    return res
      .status(200)
      .json({ enclosureBarrier: enclosureBarrier.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateEnclosureBarrier(req: Request, res: Response) {
  try {
    const { enclosureBarrierId, wallName, barrierType, remarks } = req.body;

    if (
      [enclosureBarrierId, wallName, barrierType, remarks].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        enclosureBarrierId,
        wallName,
        barrierType,
        remarks,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let updatedEnclosureBarrier = await EnclosureService.updateEnclosureBarrier(
      Number(enclosureBarrierId),
      wallName,
      barrierType,
      remarks,
    );

    return res.status(200).json({ updatedEnclosureBarrier });
  } catch (error: any) {
    console.log("error", error);
    res.status(400).json({ error: error.message });
  }
}

export async function deleteEnclosureBarrier(req: Request, res: Response) {
  try {
    const { enclosureBarrierId } = req.params;

    if (enclosureBarrierId == undefined) {
      console.log("Missing field(s): ", {
        enclosureBarrierId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let enclosureBarrierToDelete =
      await EnclosureService.deleteEnclosureBarrier(Number(enclosureBarrierId));

    return res.status(200).json({ enclosureBarrierToDelete });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getEnclosureAccessPoints(req: Request, res: Response) {
  const { enclosureId } = req.params;

  if (enclosureId == undefined) {
    console.log("Missing field(s): ", {
      enclosureId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const enclosureAccessPoints =
      await EnclosureService.getEnclosureAccessPoints(Number(enclosureId));
    return res.status(200).json(enclosureAccessPoints);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getEnclosureAccessPointById(req: Request, res: Response) {
  const { accessPointId } = req.params;

  if (accessPointId == undefined) {
    console.log("Missing field(s): ", {
      accessPointId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const enclosureAccessPoints =
      await EnclosureService.getEnclosureAccessPointById(Number(accessPointId));
    return res.status(200).json(enclosureAccessPoints);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function createNewEnclosureAccessPoint(
  req: Request,
  res: Response,
) {
  try {
    let { enclosureId, name, type } = req.body;

    if ([enclosureId, name, type].includes(undefined)) {
      console.log("Missing field(s): ", {
        enclosureId,
        name,
        type,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let enclosureAccessPoint =
      await EnclosureService.createNewEnclosureAccessPoint(
        Number(enclosureId),
        name,
        type,
      );

    return res
      .status(200)
      .json({ enclosureAccessPoint: enclosureAccessPoint.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateEnclosureAccessPoint(req: Request, res: Response) {
  try {
    const { accessPointId, name, type } = req.body;

    if ([accessPointId, name, type].includes(undefined)) {
      console.log("Missing field(s): ", {
        accessPointId,
        name,
        type,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let updatedAccessPoint = await EnclosureService.updateEnclosureAccessPoint(
      Number(accessPointId),
      name,
      type,
    );

    return res.status(200).json({ updatedAccessPoint });
  } catch (error: any) {
    console.log("error", error);
    res.status(400).json({ error: error.message });
  }
}

export async function deleteEnclosureAccessPoint(req: Request, res: Response) {
  try {
    const { accessPointId } = req.params;

    if (accessPointId == undefined) {
      console.log("Missing field(s): ", {
        accessPointId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let accessPointToDelete = await EnclosureService.deleteEnclosureAccessPoint(
      Number(accessPointId),
    );

    return res.status(200).json({ accessPointToDelete });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getEnclosureEnrichmentItems(req: Request, res: Response) {
  const { enclosureId } = req.params;

  if (enclosureId == undefined) {
    console.log("Missing field(s): ", {
      enclosureId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const enclosureItems = await EnclosureService.getEnclosureEnrichmentItems(
      Number(enclosureId),
    );
    return res.status(200).json(enclosureItems);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function addEnrichmentItemToEnclosure(
  req: Request,
  res: Response,
) {
  try {
    const { enclosureId, enrichmentItemId } = req.body;

    if ([enclosureId, enrichmentItemId].includes(undefined)) {
      console.log("Missing field(s): ", {
        enclosureId,
        enrichmentItemId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let result = await EnclosureService.addEnrichmentItemToEnclosure(
      Number(enclosureId),
      Number(enrichmentItemId),
    );

    return res.status(200).json({ result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function removeEnrichmentItemFromEnclosure(
  req: Request,
  res: Response,
) {
  try {
    const { enclosureId, enrichmentItemId } = req.body;

    if ([enclosureId, enrichmentItemId].includes(undefined)) {
      console.log("Missing field(s): ", {
        enclosureId,
        enrichmentItemId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let result = await EnclosureService.removeEnrichmentItemFromEnclosure(
      Number(enclosureId),
      Number(enrichmentItemId),
    );

    return res.status(200).json({ result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

// + getEnclosureEnrichmentItems(enclosureId: number): Promise<any>

// + addEnrichmentItemToEnclosure(enclosureId: number, enrichmenItemId: number): Promise<any>
//         - Similar to assignAnimalToEnclosure, but with EnrichmentItem entity instead

// + removeEnrichmentItemFromEnclosure(enclosureId: number, enrichmenItemId: number): Promise<any>
//         - Similar to removeAnimalFromEnclosure, but with EnrichmentItem entity instead
