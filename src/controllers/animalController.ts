import { Request, Response } from "express";
import { handleFileUpload } from "../helpers/multerProcessFile";
import * as AnimalService from "../services/animalService";
import { findEmployeeByEmail } from "../services/employeeService";

// -- Animal Basic Info
export async function getAllAnimals(req: Request, res: Response) {
  const { } = req.body;
  try {
    const allAnimals = await AnimalService.getAllAnimals();
    return res.status(200).json(allAnimals.map((animal) => animal.toJSON()));
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllAnimalsBySpeciesCode(req: Request, res: Response) {
  const { speciesCode } = req.params;

  if (speciesCode == undefined) {
    console.log("Missing field(s): ", {
      speciesCode,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const allAnimals =
      await AnimalService.getAllAnimalsBySpeciesCode(speciesCode);
    return res.status(200).json(allAnimals?.map((animal) => animal.toJSON()));
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAnimalByAnimalCode(req: Request, res: Response) {
  const { animalCode } = req.params;

  if (animalCode == undefined) {
    console.log("Missing field(s): ", {
      animalCode,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const animalRecord = await AnimalService.getAnimalByAnimalCode(animalCode);
    return res.status(200).json(animalRecord.toJSON());
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function createAnimal(req: Request, res: Response) {
  try {
    const imageUrl = await handleFileUpload(
      req,
      process.env.IMG_URL_ROOT! + "animal", //"D:/capstoneUploads/species",
    );
    const {
      speciesCode,
      isGroup,
      houseName,
      sex,
      dateOfBirth,
      placeOfBirth,
      identifierType,
      identifierValue,
      acquisitionMethod,
      dateOfAcquisition,
      acquisitionRemarks,
      physicalDefiningCharacteristics,
      behavioralDefiningCharacteristics,
      dateOfDeath,
      locationOfDeath,
      causeOfDeath,
      animalStatus,
    } = req.body;

    if (
      [
        speciesCode,
        isGroup,
        houseName,
        sex,
        dateOfBirth,
        placeOfBirth,
        identifierType,
        identifierValue,
        acquisitionMethod,
        dateOfAcquisition,
        acquisitionRemarks,
        physicalDefiningCharacteristics,
        behavioralDefiningCharacteristics,
        // dateOfDeath,
        // locationOfDeath,
        // causeOfDeath,
        animalStatus,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        speciesCode,
        isGroup,
        houseName,
        sex,
        dateOfBirth,
        placeOfBirth,
        identifierType,
        identifierValue,
        acquisitionMethod,
        dateOfAcquisition,
        acquisitionRemarks,
        physicalDefiningCharacteristics,
        behavioralDefiningCharacteristics,
        animalStatus,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let animal = await AnimalService.createNewAnimal(
      speciesCode,
      isGroup,
      houseName,
      sex,
      dateOfBirth,
      placeOfBirth,
      identifierType,
      identifierValue,
      acquisitionMethod,
      dateOfAcquisition,
      acquisitionRemarks,
      physicalDefiningCharacteristics,
      behavioralDefiningCharacteristics,
      dateOfDeath,
      locationOfDeath,
      causeOfDeath,
      animalStatus,
      imageUrl,
    );

    return res.status(200).json(animal.toJSON());
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateAnimal(req: Request, res: Response) {
  try {
    let imageUrl;
    if (
      req.headers["content-type"] &&
      req.headers["content-type"].includes("multipart/form-data")
    ) {
      imageUrl = await handleFileUpload(
        req,
        process.env.IMG_URL_ROOT! + "animal", //"D:/capstoneUploads/species",
      );
    } else {
      imageUrl = req.body.imageUrl;
    }

    const {
      animalCode,
      houseName,
      sex,
      dateOfBirth,
      placeOfBirth,
      identifierType,
      identifierValue,
      acquisitionMethod,
      dateOfAcquisition,
      acquisitionRemarks,
      physicalDefiningCharacteristics,
      behavioralDefiningCharacteristics,
      // dateOfDeath,
      locationOfDeath,
      causeOfDeath,
      animalStatus,
    } = req.body;

    const dateOfDeath =
      req.body.dateOfDeath == "" ? null : req.body.dateOfDeath;

    if (
      [
        animalCode,
        houseName,
        sex,
        dateOfBirth,
        placeOfBirth,
        identifierType,
        identifierValue,
        acquisitionMethod,
        dateOfAcquisition,
        acquisitionRemarks,
        physicalDefiningCharacteristics,
        behavioralDefiningCharacteristics,
        dateOfDeath,
        locationOfDeath,
        causeOfDeath,
        animalStatus,
        imageUrl,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        animalCode,
        houseName,
        sex,
        dateOfBirth,
        placeOfBirth,
        identifierType,
        identifierValue,
        acquisitionMethod,
        dateOfAcquisition,
        acquisitionRemarks,
        physicalDefiningCharacteristics,
        behavioralDefiningCharacteristics,
        dateOfDeath,
        locationOfDeath,
        causeOfDeath,
        animalStatus,
        imageUrl,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let animal = await AnimalService.updateAnimal(
      animalCode,
      houseName,
      sex,
      dateOfBirth,
      placeOfBirth,
      identifierType,
      identifierValue,
      acquisitionMethod,
      dateOfAcquisition,
      acquisitionRemarks,
      physicalDefiningCharacteristics,
      behavioralDefiningCharacteristics,
      dateOfDeath,
      locationOfDeath,
      causeOfDeath,
      animalStatus,
      imageUrl,
    );

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteAnimal(req: Request, res: Response) {
  const { animalCode } = req.params;

  if (animalCode == undefined) {
    console.log("Missing field(s): ", {
      animalCode,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const animal = await AnimalService.deleteAnimal(animalCode);
    return res.status(200).json({ animal: animal });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateAnimalStatus(req: Request, res: Response) {
  try {
    const { animalCode, animalStatus } = req.body;

    if ([animalCode, animalStatus].includes(undefined)) {
      console.log("Missing field(s): ", {
        animalCode,
        animalStatus,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let updatedAnimalStatus = await AnimalService.updateAnimalStatus(
      animalCode,
      animalStatus,
    );

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

//-- Animal Lineage
export async function getLineageByAnimalCode(req: Request, res: Response) {
  const { animalCode } = req.params;

  if (animalCode == undefined) {
    console.log("Missing field(s): ", {
      animalCode,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const animalLineageCode =
      await AnimalService.getLineageByAnimalCode(animalCode);
    return res.status(200).json(animalLineageCode);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function addAnimalLineage(req: Request, res: Response) {
  try {
    const { childAnimalCode, parentAnimalCode } = req.body;

    if ([childAnimalCode, parentAnimalCode].includes(undefined)) {
      console.log("Missing field(s): ", {
        childAnimalCode,
        parentAnimalCode,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let newLineage = await AnimalService.addAnimalLineage(
      childAnimalCode,
      parentAnimalCode,
    );

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateAnimalLineage(req: Request, res: Response) {
  try {
    const { childAnimalCode, parentAnimalCode, newParentAnimalCode } = req.body;

    if (
      [childAnimalCode, parentAnimalCode, newParentAnimalCode].includes(
        undefined,
      )
    ) {
      console.log("Missing field(s): ", {
        childAnimalCode,
        parentAnimalCode,
        newParentAnimalCode,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let updatedAnimalLineage = await AnimalService.updateAnimalLineage(
      childAnimalCode,
      parentAnimalCode,
      newParentAnimalCode,
    );

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteAnimalLineage(req: Request, res: Response) {
  try {
    const { childAnimalCode, parentAnimalCode } = req.body;

    if ([childAnimalCode, parentAnimalCode].includes(undefined)) {
      console.log("Missing field(s): ", {
        childAnimalCode,
        parentAnimalCode,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let deletedAnimalLineage = await AnimalService.deleteAnimalLineage(
      childAnimalCode,
      parentAnimalCode,
    );

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
//checkInbreeding
export async function checkInbreeding(req: Request, res: Response) {
  const { animalCode1, animalCode2 } = req.params;
  try {
    const isInbreed = await AnimalService.checkInbreeding(
      animalCode1,
      animalCode2,
    );
    return res.status(200).json(isInbreed);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

//-- Animal Weight
export async function getAllAnimalWeightsByAnimalCode(
  req: Request,
  res: Response,
) {
  const { animalCode } = req.params;
  try {
    const allAnimalWeights =
      await AnimalService.getAllAnimalWeightsByAnimalCode(animalCode);
    return res.status(200).json(allAnimalWeights);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function addAnimalWeight(req: Request, res: Response) {
  try {
    const { animalCode, weightInKg, dateOfMeasure } = req.body;

    if ([animalCode, weightInKg, dateOfMeasure].includes(undefined)) {
      console.log("Missing field(s): ", {
        animalCode,
        weightInKg,
        dateOfMeasure,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let animalWeight = await AnimalService.addAnimalWeight(
      animalCode,
      weightInKg,
      dateOfMeasure,
    );

    return res.status(200).json({ animalWeight });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteAnimalWeight(req: Request, res: Response) {
  const { animalWeightId } = req.params;

  if (animalWeightId == undefined) {
    console.log("Missing field(s): ", {
      animalWeightId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const animalWeight = await AnimalService.deleteAnimalWeight(animalWeightId);
    return res.status(200).json(animalWeight);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllAbnormalWeights(req: Request, res: Response) {
  try {
    const allAbnormals = await AnimalService.getAllAbnormalWeights();
    return res.status(200).json(allAbnormals);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
export async function checkIfAbnormalWeight(req: Request, res: Response) {
  const { animalCode } = req.params;
  try {
    const isAbnormal = await AnimalService.checkIfAbnormalWeight(animalCode);
    return res.status(200).json(isAbnormal);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

//-- Animal Activity
export async function getAllAnimalActivities(req: Request, res: Response) {
  const { } = req.body;
  try {
    const allAnimalActivities = await AnimalService.getAllAnimalActivities();
    return res.status(200).json(allAnimalActivities);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAnimalActivityById(req: Request, res: Response) {
  const { animalActivityId } = req.params;

  if (animalActivityId == undefined) {
    console.log("Missing field(s): ", {
      animalActivityId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const animalActivity = await AnimalService.getAnimalActivityById(
      Number(animalActivityId),
    );
    return res.status(200).json({ animalActivity: animalActivity.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAnimalActivityByAnimalCode(
  req: Request,
  res: Response,
) {
  const { animalCode } = req.params;

  if (animalCode == undefined) {
    console.log("Missing field(s): ", {
      animalCode,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const animalActivities =
      await AnimalService.getAnimalActivityByAnimalCode(animalCode);
    return res.status(200).json(animalActivities);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function createAnimalActivity(req: Request, res: Response) {
  try {
    let {
      activityType,
      title,
      details,
      startDate,
      endDate,
      recurringPattern,
      dayOfWeek,
      dayOfMonth,
      eventTimingType,
      durationInMinutes,
      requiredNumberOfKeeper
    } = req.body;

    if (
      [
        activityType,
        title,
        details,
        startDate,
        recurringPattern,
        eventTimingType,
        durationInMinutes,
        requiredNumberOfKeeper
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        activityType,
        title,
        details,
        startDate,
        recurringPattern,
        eventTimingType,
        durationInMinutes,
        requiredNumberOfKeeper
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    if (endDate === undefined) {
      endDate = startDate;
    }

    // have to pass in req for image uploading
    let animalActivity = await AnimalService.createAnimalActivity(
      activityType,
      title,
      details,
      new Date(startDate),
      new Date(endDate),
      recurringPattern,
      dayOfWeek,
      dayOfMonth,
      eventTimingType,
      Number(durationInMinutes),
      Number(requiredNumberOfKeeper)
    );

    return res.status(200).json({ animalActivity: animalActivity.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

// export async function makeAnimalActivityPublic(req: Request, res: Response) {
//   try {
//     let { animalActivityId, publicEventStartTime, publicEventEndTime } =
//       req.body;

//     if (
//       [animalActivityId, publicEventStartTime, publicEventEndTime].includes(
//         undefined,
//       )
//     ) {
//       console.log("Missing field(s): ", {
//         animalActivityId,
//         publicEventStartTime,
//         publicEventEndTime,
//       });
//       return res.status(400).json({ error: "Missing information!" });
//     }

//     // have to pass in req for image uploading
//     let animalActivity = await AnimalService.makeAnimalActivityPublic(
//       Number(animalActivityId),
//       new Date(publicEventStartTime),
//       new Date(publicEventEndTime),
//     );
//     return res.status(200);
//     // return res.status(200).json({ animalActivity: animalActivity.toJSON() });
//   } catch (error: any) {
//     res.status(400).json({ error: error.message });
//   }
// }

// export async function makeAnimalActivityPrivate(req: Request, res: Response) {
//   try {
//     const { animalActivityId } = req.params;

//     // have to pass in req for image uploading
//     let animalActivity = await AnimalService.makeAnimalActivityPrivate(
//       Number(animalActivityId),
//     );
//     return res.status(200);
//     // return res.status(200).json({ animalActivity: animalActivity.toJSON() });
//   } catch (error: any) {
//     res.status(400).json({ error: error.message });
//   }
// }

export async function updateAnimalActivity(req: Request, res: Response) {
  try {
    const {
      animalActivityId,
      activityType,
      title,
      details,
      startDate,
      endDate,
      recurringPattern,
      dayOfWeek,
      dayOfMonth,
      eventTimingType,
      durationInMinutes,
      requiredNumberOfKeeper
    } = req.body;

    if (
      [
        animalActivityId,
        activityType,
        title,
        details,
        startDate,
        endDate,
        recurringPattern,
        eventTimingType,
        durationInMinutes,
        requiredNumberOfKeeper
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        animalActivityId,
        activityType,
        title,
        details,
        startDate,
        endDate,
        recurringPattern,
        eventTimingType,
        durationInMinutes,
        requiredNumberOfKeeper
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let updatedAnimalActivity = await AnimalService.updateAnimalActivity(
      Number(animalActivityId),
      activityType,
      title,
      details,
      new Date(startDate),
      new Date(endDate),
      recurringPattern,
      dayOfWeek,
      dayOfMonth == null ? null : Number(dayOfMonth),
      eventTimingType,
      Number(durationInMinutes),
      Number(requiredNumberOfKeeper)
    );

    return res.status(200).json({
      updatedAnimalActivity: await updatedAnimalActivity.toFullJSON(),
    });
  } catch (error: any) {
    console.log("error", error);
    res.status(400).json({ error: error.message });
  }
}

export async function deleteAnimalActivity(req: Request, res: Response) {
  const { animalActivityId } = req.params;

  if (animalActivityId == undefined) {
    console.log("Missing field(s): ", {
      animalActivityId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const animalActivity =
      await AnimalService.deleteAnimalActivity(animalActivityId);
    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function assignAnimalsToActivity(req: Request, res: Response) {
  try {
    const { animalActivityId, animalCodes } = req.body;

    if ([animalActivityId, animalCodes].includes(undefined)) {
      console.log("Missing field(s): ", {
        animalActivityId,
        animalCodes,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let animalsToActivity = await AnimalService.assignAnimalsToActivity(
      animalActivityId,
      animalCodes,
    );

    return res.status(200).json({ animalsToActivity });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function removeAnimalFromActivity(req: Request, res: Response) {
  try {
    const { animalActivityId, animalCode } = req.body;

    if ([animalActivityId, animalCode].includes(undefined)) {
      console.log("Missing field(s): ", {
        animalActivityId,
        animalCode,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let animalsFromActivity = await AnimalService.removeAnimalFromActivity(
      animalActivityId,
      animalCode,
    );

    return res.status(200).json({ animalsFromActivity });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function assignItemToActivity(req: Request, res: Response) {
  try {
    const { animalActivityId, enrichmentItemIds } = req.body;

    if ([animalActivityId, enrichmentItemIds].includes(undefined)) {
      console.log("Missing field(s): ", {
        animalActivityId,
        enrichmentItemIds,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let itemsToActivity = await AnimalService.assignItemToActivity(
      animalActivityId,
      enrichmentItemIds,
    );

    return res.status(200).json({ itemsToActivity });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function removeItemFromActivity(req: Request, res: Response) {
  try {
    const { animalActivityId, enrichmentItemId } = req.body;

    if ([animalActivityId, enrichmentItemId].includes(undefined)) {
      console.log("Missing field(s): ", {
        animalActivityId,
        enrichmentItemId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let itemsFromActivity = await AnimalService.removeItemFromActivity(
      animalActivityId,
      enrichmentItemId,
    );

    return res.status(200).json({ itemsFromActivity });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

//-- Animal Observation Log
export async function createAnimalObservationLog(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);
    const {
      animalActivityId,
      dateTime,
      durationInMinutes,
      observationQuality,
      details,
    } = req.body;

    if (
      [
        animalActivityId,
        dateTime,
        durationInMinutes,
        observationQuality,
        details,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        animalActivityId,
        dateTime,
        durationInMinutes,
        observationQuality,
        details,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let animalObservationLog = await AnimalService.createAnimalObservationLog(
      employee.employeeId,
      animalActivityId,
      new Date(dateTime),
      Number(durationInMinutes),
      observationQuality,
      details,
    );

    return res.status(200).json({ animalObservationLog: animalObservationLog });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAnimalObservationLogsByAnimalActivityId(req: Request, res: Response) {
  try {

    const { animalActivityId } = req.params;
    let animalObservationLogs =
      await AnimalService.getAnimalObservationLogsByAnimalActivityId(Number(animalActivityId));

    return res.status(200).json({
      animalObservationLogs: animalObservationLogs.map((animalObservationLog) =>
        animalObservationLog.toJSON(),
      ),
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllAnimalObservationLogs(req: Request, res: Response) {
  try {
    // have to pass in req for image uploading
    let animalObservationLogs =
      await AnimalService.getAllAnimalObservationLogs();

    return res.status(200).json({
      animalObservationLogs: animalObservationLogs.map((animalObservationLog) =>
        animalObservationLog.toJSON(),
      ),
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAnimalObservationLogById(req: Request, res: Response) {
  try {
    const { animalObservationLogId } = req.params;

    if ([animalObservationLogId].includes("")) {
      console.log("Missing field(s): ", {
        animalObservationLogId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let animalObservationLog = await AnimalService.getAnimalObservationLogById(
      Number(animalObservationLogId),
    );

    return res
      .status(200)
      .json({ animalObservationLog: animalObservationLog.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAnimalObservationLogsByAnimalCode(
  req: Request,
  res: Response,
) {
  try {
    const { animalCode } = req.params;

    if ([animalCode].includes("")) {
      console.log("Missing field(s): ", {
        animalCode,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let animalObservationLogs =
      await AnimalService.getAnimalObservationLogsByAnimalCode(animalCode);

    return res.status(200).json({
      animalObservationLogs: animalObservationLogs.map((animalObservationLog) =>
        animalObservationLog.toJSON(),
      ),
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAnimalObservationLogsBySpeciesCode(
  req: Request,
  res: Response,
) {
  try {
    const { speciesCode } = req.params;

    if ([speciesCode].includes("")) {
      console.log("Missing field(s): ", {
        speciesCode,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let animalObservationLogs =
      await AnimalService.getAnimalObservationLogsBySpeciesCode(speciesCode);

    return res.status(200).json({
      animalObservationLogs: animalObservationLogs.map((animalObservationLog) =>
        animalObservationLog.toJSON(),
      ),
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateAnimalObservationLog(req: Request, res: Response) {
  try {
    const { animalObservationLogId } = req.params;
    const {
      dateTime,
      durationInMinutes,
      observationQuality,
      details,
    } = req.body;

    if (
      [
        animalObservationLogId,
        dateTime,
        durationInMinutes,
        observationQuality,
        details,
      ].includes("")
    ) {
      console.log("Missing field(s): ", {
        animalObservationLogId,
        dateTime,
        durationInMinutes,
        observationQuality,
        details,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let animalObservationLog = await AnimalService.updateAnimalObservationLog(
      Number(animalObservationLogId),
      new Date(dateTime),
      Number(durationInMinutes),
      observationQuality,
      details,
    );

    return res
      .status(200)
      .json({ animalObservationLog: animalObservationLog.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteAnimalObservationLogById(
  req: Request,
  res: Response,
) {
  try {
    const { animalObservationLogsId } = req.params;

    if ([animalObservationLogsId].includes("")) {
      console.log("Missing field(s): ", {
        animalObservationLogsId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    await AnimalService.deleteAnimalObservationLogById(
      Number(animalObservationLogsId),
    );

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

//-- Animal Feeding Log
export async function createAnimalFeedingLog(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);
    const { dateTime, durationInMinutes, 
      amountOffered,
      amountConsumed,
      amountLeftovers,
      presentationMethod,
      feedingPlanId,
      extraRemarks } = req.body;

    if (
      [dateTime, durationInMinutes, 
        amountOffered,
        amountConsumed,
        amountLeftovers,
        presentationMethod,
        feedingPlanId,
        extraRemarks].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        dateTime,
        durationInMinutes,
        amountOffered,
        amountConsumed,
        amountLeftovers,
        presentationMethod,
        extraRemarks,
        feedingPlanId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let animalObservationLog = await AnimalService.createAnimalFeedingLog(
      employee.employeeId,
      new Date(dateTime),
      Number(durationInMinutes),
      amountOffered,
      amountConsumed,
      amountLeftovers,
      presentationMethod,
      extraRemarks,
      feedingPlanId,
    );

    return res.status(200).json({ animalObservationLog: animalObservationLog });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAnimalFeedingLogById(req: Request, res: Response) {
  try {
    const { animalFeedingLogId } = req.params;

    if ([animalFeedingLogId].includes("")) {
      console.log("Missing field(s): ", {
        animalFeedingLogId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let animalFeedingLog = await AnimalService.getAnimalFeedingLogById(
      Number(animalFeedingLogId),
    );

    return res
      .status(200)
      .json({ animalFeedingLog: animalFeedingLog.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAnimalFeedingLogByFeedingPlanId(req: Request, res: Response) {
  try {
    const { feedingPlanId } = req.params;

    if ([feedingPlanId].includes("")) {
      console.log("Missing field(s): ", {
        feedingPlanId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let animalFeedingLogs = await AnimalService.getAnimalFeedingLogByFeedingPlanId(
      Number(feedingPlanId),
    );
      
    return res
      .status(200)
      .json({ animalFeedingLogs: animalFeedingLogs.map(log => log.toJSON()) });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAnimalFeedingLogsByAnimalCode(
  req: Request,
  res: Response,
) {
  try {
    const { animalCode } = req.params;

    if ([animalCode].includes("")) {
      console.log("Missing field(s): ", {
        animalCode,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let animalFeedingLogs =
      await AnimalService.getAnimalFeedingLogsByAnimalCode(animalCode);

    return res.status(200).json({
      animalFeedingLogs: animalFeedingLogs.map((animalFeedingLog) =>
        animalFeedingLog.toJSON(),
      ),
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAnimalFeedingLogsBySpeciesCode(
  req: Request,
  res: Response,
) {
  try {
    const { speciesCode } = req.params;

    if ([speciesCode].includes("")) {
      console.log("Missing field(s): ", {
        speciesCode,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let animalFeedingLogs =
      await AnimalService.getAnimalFeedingLogsBySpeciesCode(speciesCode);

    return res.status(200).json({
      animalFeedingLogs: animalFeedingLogs.map((animalFeedingLog) =>
        animalFeedingLog.toJSON(),
      ),
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateAnimalFeedingLog(req: Request, res: Response) {
  try {
    const { animalFeedingLogId } = req.params;
    const { dateTime, durationInMinutes, 
      amountOffered,
      amountConsumed,
      amountLeftovers,
      presentationMethod,
      extraRemarks } = req.body;

    if (
      [
        animalFeedingLogId,
        dateTime,
        durationInMinutes,
        amountOffered,
        amountConsumed,
        amountLeftovers,
        presentationMethod,
        extraRemarks,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        animalFeedingLogId,
        dateTime,
        durationInMinutes,
        amountOffered,
        amountConsumed,
        amountLeftovers,
        presentationMethod,
        extraRemarks,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let animalFeedingLog = await AnimalService.updateAnimalFeedingLog(
      Number(animalFeedingLogId),
      new Date(dateTime),
      Number(durationInMinutes),
      amountOffered,
      amountConsumed,
      amountLeftovers,
      presentationMethod,
      extraRemarks
    );

    return res
      .status(200)
      .json({ animalFeedingLog: animalFeedingLog.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteAnimalFeedingLogById(req: Request, res: Response) {
  try {
    const { animalFeedingLogId } = req.params;

    if ([animalFeedingLogId].includes("")) {
      console.log("Missing field(s): ", {
        animalFeedingLogId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    await AnimalService.deleteAnimalFeedingLogById(Number(animalFeedingLogId));

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    console.log("error", error);
    res.status(400).json({ error: error.message });
  }
}

//-- Animal Activity Log
export async function createAnimalActivityLog(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);
    const {
      activityType,
      animalActivityId,
      dateTime,
      durationInMinutes,
      sessionRating,
      animalReaction,
      details,
    } = req.body;

    if (
      [
        activityType,
        animalActivityId,
        dateTime,
        durationInMinutes,
        sessionRating,
        animalReaction,
        details,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        activityType,
        animalActivityId,
        dateTime,
        durationInMinutes,
        sessionRating,
        animalReaction,
        details,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let animalActivityLog = await AnimalService.createAnimalActivityLog(
      employee.employeeId,
      animalActivityId,
      activityType,
      new Date(dateTime),
      Number(durationInMinutes),
      sessionRating,
      animalReaction,
      details,
    );

    return res
      .status(200)
      .json({ animalActivityLog: animalActivityLog.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAnimalActivityLogById(req: Request, res: Response) {
  try {
    const { animalActivityLogId } = req.params;

    if ([animalActivityLogId].includes("")) {
      console.log("Missing field(s): ", {
        animalActivityLogId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let animalActivityLog = await AnimalService.getAnimalActivityLogById(
      Number(animalActivityLogId),
    );

    return res.status(200).json({ animalActivityLog });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAnimalActivityLogsByAnimalActivityId(req: Request, res: Response) {
  try {
    const { animalActivityId } = req.params;

    if ([animalActivityId].includes("")) {
      console.log("Missing field(s): ", {
        animalActivityId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let animalActivityLogs = await AnimalService.getAnimalActivityLogsByAnimalActivityId(
      Number(animalActivityId),
    );

    return res.status(200).json({ animalActivityLogs: animalActivityLogs.map(log => log.toJSON()) });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAnimalActivityLogsByAnimalCode(
  req: Request,
  res: Response,
) {
  try {
    const { animalCode } = req.params;

    if ([animalCode].includes("")) {
      console.log("Missing field(s): ", {
        animalCode,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let animalActivityLogs =
      await AnimalService.getAnimalActivityLogsByAnimalCode(animalCode);

    return res.status(200).json({
      animalActivityLogs: animalActivityLogs.map((log) => log.toJSON()),
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAnimalActivityLogsBySpeciesCode(
  req: Request,
  res: Response,
) {
  try {
    const { speciesCode } = req.params;

    if ([speciesCode].includes("")) {
      console.log("Missing field(s): ", {
        speciesCode,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let animalActivityLogs =
      await AnimalService.getAnimalActivityLogsBySpeciesCode(speciesCode);

    return res.status(200).json({ animalActivityLogs });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function updateAnimalActivityLog(req: Request, res: Response) {
  try {
    const { animalActivityLogId } = req.params;
    const {
      activityType,
      dateTime,
      durationInMinutes,
      sessionRating,
      animalReaction,
      details,
      // animalCodes,
    } = req.body;

    if (
      [
        animalActivityLogId,
        activityType,
        dateTime,
        durationInMinutes,
        sessionRating,
        animalReaction,
        details,
        // animalCodes,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        animalActivityLogId,
        activityType,
        dateTime,
        durationInMinutes,
        sessionRating,
        animalReaction,
        details,
        // animalCodes,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let animalActivityLog = await AnimalService.updateAnimalActivityLog(
      Number(animalActivityLogId),
      activityType,
      new Date(dateTime),
      Number(durationInMinutes),
      sessionRating,
      animalReaction,
      details,
      // animalCodes,
    );

    return res
      .status(200)
      .json({ animalActivityLog: animalActivityLog.toJSON() });
  } catch (error: any) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
}

export async function deleteAnimalActivityLogById(req: Request, res: Response) {
  try {
    const { animalActivityLogId } = req.params;

    if ([animalActivityLogId].includes("")) {
      console.log("Missing field(s): ", {
        animalActivityLogId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    await AnimalService.deleteAnimalActivityLogById(
      Number(animalActivityLogId),
    );

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

//-- Animal Feeding Plan
export async function getFeedingPlanByFeedingPlanId(
  req: Request,
  res: Response,
) {
  const { feedingPlanId } = req.params;

  if (feedingPlanId == undefined) {
    console.log("Missing field(s): ", {
      feedingPlanId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const feedingPlan = await AnimalService.getFeedingPlanById(
      Number(feedingPlanId),
    );
    return res.status(200).json(feedingPlan);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllFeedingPlans(req: Request, res: Response) {
  // const {} = req.body;
  try {
    const allAnimalFeedingPlans = await AnimalService.getAllFeedingPlans();
    return res
      .status(200)
      .json(allAnimalFeedingPlans.map((feedingPlan) => feedingPlan.toJSON()));
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getFeedingPlansBySpeciesCode(
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
    const allFeedingPlans =
      await AnimalService.getFeedingPlansBySpeciesCode(speciesCode);
    return res
      .status(200)
      .json(allFeedingPlans?.map((feedingPlan) => feedingPlan.toJSON()));
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getFeedingPlansByAnimalCode(req: Request, res: Response) {
  const { animalCode } = req.params;

  if (animalCode == undefined) {
    console.log("Missing field(s): ", {
      animalCode,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const allFeedingPlans =
      await AnimalService.getFeedingPlansByAnimalCode(animalCode);
    return res
      .status(200)
      .json(allFeedingPlans?.map((feedingPlan) => feedingPlan.toJSON()));
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function createFeedingPlan(req: Request, res: Response) {
  try {
    const {
      speciesCode,
      animalCodes,
      feedingPlanDesc,
      startDate,
      endDate,
      sessions,
    } = req.body;

    if (
      [
        speciesCode,
        animalCodes,
        feedingPlanDesc,
        startDate,
        endDate,
        sessions,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        speciesCode,
        animalCodes,
        feedingPlanDesc,
        startDate,
        endDate,
        sessions,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let feedingPlan = await AnimalService.createFeedingPlan(
      speciesCode,
      animalCodes,
      feedingPlanDesc,
      startDate,
      endDate,
      sessions,
    );

    return res.status(200).json({ feedingPlan });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateFeedingPlan(req: Request, res: Response) {
  try {
    const {
      feedingPlanId,
      animalCodes,
      feedingPlanDesc,
      startDate,
      endDate,
      title
    } = req.body;

    if (
      [
        feedingPlanId,
        animalCodes,
        feedingPlanDesc,
        startDate,
        endDate,
        title
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        feedingPlanId,
        animalCodes,
        feedingPlanDesc,
        startDate,
        endDate,
        title
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let updatedAnimalActivity = await AnimalService.updateFeedingPlan(
      Number(feedingPlanId),
      animalCodes,
      feedingPlanDesc,
      new Date(startDate),
      new Date(endDate),
      title
    );

    return res.status(200).json({
      updatedAnimalActivity: await updatedAnimalActivity!.toJSON(),
    });
  } catch (error: any) {
    console.log("error", error);
    res.status(400).json({ error: error.message });
  }
}

export async function deleteFeedingPlanById(req: Request, res: Response) {
  const { feedingPlanSessionDetailId } = req.params;

  if (feedingPlanSessionDetailId == undefined) {
    console.log("Missing field(s): ", {
      feedingPlanSessionDetailId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const animalWeight = await AnimalService.deleteFeedingPlanById(
      Number(feedingPlanSessionDetailId),
    );
    return res.status(200).json(animalWeight);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

//-- Animal Feeding Plan Session
export async function getAllFeedingPlanSessionDetails(
  req: Request,
  res: Response,
) {
  // const {} = req.body;
  try {
    const allAnimalFeedingPlanSessions =
      await AnimalService.getAllFeedingPlanSessionDetails();
    return res
      .status(200)
      .json(
        allAnimalFeedingPlanSessions.map((feedingPlanSession) =>
          feedingPlanSession.toJSON(),
        ),
      );
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllFeedingPlanSessionDetailsByPlanId(
  req: Request,
  res: Response,
) {
  const { feedingPlanSessionDetailId } = req.params;

  if (feedingPlanSessionDetailId == undefined) {
    console.log("Missing field(s): ", {
      feedingPlanSessionDetailId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const allFeedingPlanSessions =
      await AnimalService.getAllFeedingPlanSessionDetailsByPlanId(
        Number(feedingPlanSessionDetailId),
      );
    return res
      .status(200)
      .json(
        allFeedingPlanSessions?.map((feedingPlanSession) =>
          feedingPlanSession.toJSON(),
        ),
      );
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getFeedingPlanSessionDetailById(
  req: Request,
  res: Response,
) {
  const { feedingPlanDetailId } = req.params;

  if (feedingPlanDetailId == undefined) {
    console.log("Missing field(s): ", {
      feedingPlanDetailId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const feedingPlanSession =
      await AnimalService.getFeedingPlanSessionDetailById(
        Number(feedingPlanDetailId),
      );
    return res.status(200).json(feedingPlanSession?.toJSON());
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function createFeedingPlanSessionDetail(
  req: Request,
  res: Response,
) {
  try {
    const {
      feedingPlanId,
      dayOftheWeek,
      eventTimingType,
      durationInMinutes,
      isPublic,
      publicEventStartTime,
      items,
      requiredNumberOfKeeper
    } = req.body;

    if (
      [
        feedingPlanId,
        dayOftheWeek,
        eventTimingType,
        durationInMinutes,
        isPublic,
        publicEventStartTime,
        items,
        requiredNumberOfKeeper
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        feedingPlanId,
        dayOftheWeek,
        eventTimingType,
        durationInMinutes,
        isPublic,
        publicEventStartTime,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let feedingPlanSession = await AnimalService.createFeedingPlanSessionDetail(
      Number(feedingPlanId),
      dayOftheWeek,
      eventTimingType,
      durationInMinutes,
      isPublic,
      publicEventStartTime,
      items,
      Number(requiredNumberOfKeeper)
    );

    return res.status(200).json({ feedingPlanSession });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateFeedingPlanSessionDetail(
  req: Request,
  res: Response,
) {
  try {
    const {
      feedingPlanDetailId,
      dayOftheWeek,
      eventTimingType,
      durationInMinutes,
      isPublic,
      publicEventStartTime,
      requiredNumberOfKeeper,
      items,
    } = req.body;

    if (
      [
        feedingPlanDetailId,
        dayOftheWeek,
        eventTimingType,
        durationInMinutes,
        requiredNumberOfKeeper,
        items,
      ].includes(undefined) ||
      isPublic && [publicEventStartTime,].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        feedingPlanDetailId,
        dayOftheWeek,
        eventTimingType,
        durationInMinutes,
        requiredNumberOfKeeper,
        items,
        isPublic: isPublic ? { publicEventStartTime } : isPublic,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let updatedFeedingPlanSession =
      await AnimalService.updateFeedingPlanSessionDetail(
        Number(feedingPlanDetailId),
        dayOftheWeek,
        eventTimingType,
        durationInMinutes,
        items,
        isPublic,
        publicEventStartTime,
        Number(requiredNumberOfKeeper),
      );

    return res.status(200).json({
      updatedFeedingPlanSession: await updatedFeedingPlanSession!.toJSON(),
    });
  } catch (error: any) {
    console.log("error", error);
    res.status(400).json({ error: error.message });
  }
}

export async function deleteFeedingPlanSessionDetailById(
  req: Request,
  res: Response,
) {
  const { feedingPlanDetailId } = req.params;

  if (feedingPlanDetailId == undefined) {
    console.log("Missing field(s): ", {
      feedingPlanDetailId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    await AnimalService.deleteFeedingPlanSessionDetailById(
      Number(feedingPlanDetailId),
    );
    return res.status(200).json({result:"success"});
  } catch (error: any) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
}

//-- Animal Feeding Plan Food Item
export async function getAllFeedingItemsByPlanSessionId(
  req: Request,
  res: Response,
) {
  const { feedingPlanDetailId } = req.params;

  if (feedingPlanDetailId == undefined) {
    console.log("Missing field(s): ", {
      feedingPlanDetailId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const feedingItems = await AnimalService.getAllFeedingItemsByPlanSessionId(
      Number(feedingPlanDetailId),
    );
    return res.status(200).json(feedingItems.map((item) => item.toJSON()));
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function createFeedingItem(req: Request, res: Response) {
  try {
    const { feedingPlanDetailId, animalCode, foodCategory, amount, unit } =
      req.body;

    if (
      [feedingPlanDetailId, animalCode, foodCategory, amount, unit].includes(
        undefined,
      )
    ) {
      console.log("Missing field(s): ", {
        feedingPlanDetailId,
        animalCode,
        foodCategory,
        amount,
        unit,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let feedingItem = await AnimalService.createFeedingItem(
      Number(feedingPlanDetailId),
      animalCode,
      foodCategory,
      Number(amount),
      unit,
    );

    return res.status(200).json({ feedingItem });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateFeedingItem(req: Request, res: Response) {
  try {
    const { feedingItemId, foodCategory, amount, unit } = req.body;

    if ([feedingItemId, foodCategory, amount, unit].includes(undefined)) {
      console.log("Missing field(s): ", {
        feedingItemId,
        foodCategory,
        amount,
        unit,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let updatedFeedingItem = await AnimalService.updateFeedingItem(
      Number(feedingItemId),
      foodCategory,
      Number(amount),
      unit,
    );

    return res.status(200).json({
      updatedFeedingItem: await updatedFeedingItem!.toJSON(),
    });
  } catch (error: any) {
    console.log("error", error);
    res.status(400).json({ error: error.message });
  }
}

export async function deleteFeedingItemById(req: Request, res: Response) {
  const { feedingItemId } = req.params;

  if (feedingItemId == undefined) {
    console.log("Missing field(s): ", {
      feedingItemId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const animalWeight = await AnimalService.deleteFeedingItemById(
      Number(feedingItemId),
    );
    return res.status(200).json(animalWeight);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getFeedingItemAmtRecoAllAnimalsOfSpecies(
  req: Request,
  res: Response,
) {
  try {
    const { speciesCode, animalFeedCategory } = req.body;

    if ([speciesCode, animalFeedCategory].includes(undefined)) {
      console.log("Missing field(s): ", {
        speciesCode,
        animalFeedCategory,
        // weekOrMeal,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let recoAmts = await AnimalService.getFeedingItemAmtRecoAllAnimalsOfSpecies(
      speciesCode,
      animalFeedCategory,
      // weekOrMeal,
    );

    return res.status(200).json({ recoAmts });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getFeedingItemAmtReco(req: Request, res: Response) {
  try {
    const { animalCode, animalFeedCategory, weekOrMeal } = req.body;

    if ([animalCode, animalFeedCategory, weekOrMeal].includes(undefined)) {
      console.log("Missing field(s): ", {
        animalCode,
        animalFeedCategory,
        weekOrMeal,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let recoAmt = await AnimalService.getFeedingItemAmtReco(
      animalCode,
      animalFeedCategory,
      weekOrMeal,
    );

    return res.status(200).json({ recoAmt });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
