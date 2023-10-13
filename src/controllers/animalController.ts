import { Request, Response } from "express";
import * as AnimalService from "../services/animal";
import { handleFileUpload } from "../helpers/multerProcessFile";
import { findEmployeeByEmail } from "../services/employee";

// -- Animal Basic Info
export async function getAllAnimals(req: Request, res: Response) {
  const {} = req.body;
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
  const {} = req.body;
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
    const animalActivityRecord =
      await AnimalService.getAnimalActivityById(animalActivityId);
    return res.status(200).json(animalActivityRecord);
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
    const { activityType, title, details, startDate, endDate, dayOfTheWeek, eventTimingType, durationInMinutes } =
      req.body;

    if (
      [activityType, title, details, startDate, endDate, dayOfTheWeek, eventTimingType, durationInMinutes].includes(
        undefined,
      )
    ) {
      console.log("Missing field(s): ", {
        activityType,
        title,
        details,
        startDate,
        endDate,
        dayOfTheWeek,
        eventTimingType,
        durationInMinutes,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let animalActivity = await AnimalService.createAnimalActivity(
      activityType,
      title,
      details,
      startDate,
      endDate,
      dayOfTheWeek,
      eventTimingType,
      durationInMinutes,
    );

    return res.status(200).json({ animalActivity });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateAnimalActivity(req: Request, res: Response) {
  try {
    const {
      animalActivityId,
      activityType,
      title,
      details,
      startDate,
      endDate,
      dayOfTheWeek,
      eventTimingType,
      durationInMinutes,
    } = req.body;

    if (
      [
        animalActivityId,
        activityType,
        title,
        details,
        startDate,
        endDate,
        dayOfTheWeek,
        eventTimingType,
        durationInMinutes,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        animalActivityId,
        activityType,
        title,
        details,
        startDate,
        endDate,
        dayOfTheWeek,
        eventTimingType,
        durationInMinutes,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let updatedAnimalActivity = await AnimalService.updateAnimalActivity(
      animalActivityId,
      activityType,
      title,
      details,
      startDate,
      endDate,
      dayOfTheWeek,
      eventTimingType,
      durationInMinutes,
    );

    return res.status(200).json({ result:"success" });
  } catch (error: any) {
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
    return res.status(200).json({result:"success"});
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

export async function createAnimalObservationLog(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);
    const { animalCodes, dateTime, durationInMinutes, observationQuality, details } = req.body;

    if ([animalCodes, dateTime, durationInMinutes, observationQuality, details].includes(undefined)) {
      console.log("Missing field(s): ", {
        animalCodes,
        dateTime,
        durationInMinutes, 
        observationQuality,
        details
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let animalObservationLog = await AnimalService.createAnimalObservationLog(
      employee.employeeId,
      animalCodes,
      new Date(dateTime),
      Number(durationInMinutes), 
      observationQuality,
      details
    );

    return res.status(200).json({ animalObservationLog:animalObservationLog });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllAnimalObservationLogs(req: Request, res: Response) {
  try {

    // have to pass in req for image uploading
    let animalObservationLogs = await AnimalService.getAllAnimalObservationLogs();

    return res.status(200).json({ animalObservationLogs:animalObservationLogs });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAnimalObservationLogById(req: Request, res: Response) {
  try {
    const { animalObservationLogId } = req.body;

    if ([animalObservationLogId].includes(undefined)) {
      console.log("Missing field(s): ", {
        animalObservationLogId
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let animalObservationLog = await AnimalService.getAnimalObservationLogById(Number(animalObservationLogId));

    return res.status(200).json({ animalObservationLog:animalObservationLog });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAnimalObservationLogsByAnimalCode(req: Request, res: Response) {
  try {
    const { animalCode } = req.params;

    if ([animalCode,].includes("")) {
      console.log("Missing field(s): ", {
        animalCode
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let animalObservationLogs = await AnimalService.getAnimalObservationLogsByAnimalCode(animalCode);

    return res.status(200).json({ animalObservationLogs:animalObservationLogs });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAnimalObservationLogsBySpeciesCode(req: Request, res: Response) {
  try {
    const { speciesCode } = req.params;

    if ([speciesCode,].includes("")) {
      console.log("Missing field(s): ", {
        speciesCode
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let animalObservationLogs = await AnimalService.getAnimalObservationLogsBySpeciesCode(speciesCode);

    return res.status(200).json({ animalObservationLogs:animalObservationLogs });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateAnimalObservationLog(req: Request, res: Response) {
  try {
    const { animalObservationLogId } = req.params;
    const { animalCodes, dateTime, durationInMinutes, observationQuality, details } = req.body;

    if ([animalObservationLogId, animalCodes, dateTime, durationInMinutes, observationQuality, details].includes("")) {
      console.log("Missing field(s): ", {
        animalObservationLogId, animalCodes, dateTime, durationInMinutes, observationQuality, details
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let animalObservationLog = await AnimalService.updateAnimalObservationLog(
      Number(animalObservationLogId), 
      animalCodes, 
      new Date(dateTime), 
      Number(durationInMinutes), 
      observationQuality, 
      details);

    return res.status(200).json({ animalObservationLog:animalObservationLog });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteAnimalObservationLogById(req: Request, res: Response) {
  try {
    const { animalObservationLogsId } = req.params;

    if ([animalObservationLogsId,].includes("")) {
      console.log("Missing field(s): ", {
        animalObservationLogsId
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    await AnimalService.deleteAnimalObservationLogById(Number(animalObservationLogsId));

    return res.status(200).json({ result:"success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
