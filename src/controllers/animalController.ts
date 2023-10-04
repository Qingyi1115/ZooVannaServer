import { Request, Response } from "express";
import * as AnimalService from "../services/animal";
import { handleFileUpload } from "../helpers/multerProcessFile";

// -- Animal Basic Info
export async function getAllAnimals(req: Request, res: Response) {
  const {} = req.body;
  try {
    const allAnimals = await AnimalService.getAllAnimals();
    return res.status(200).json(allAnimals);
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
    return res.status(200).json(allAnimals);
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
    return res.status(200).json(animalRecord);
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
      growthStage,
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
        dateOfDeath,
        locationOfDeath,
        causeOfDeath,
        growthStage,
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
        growthStage,
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
      growthStage,
      animalStatus,
      imageUrl,
    );

    return res.status(200).json({ animal });
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
      dateOfDeath,
      locationOfDeath,
      causeOfDeath,
      growthStage,
      animalStatus,
    } = req.body;

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
        growthStage,
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
        growthStage,
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
      growthStage,
      animalStatus,
      imageUrl,
    );

    return res.status(200).json({ animal });
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
    return res.status(200).json(animal);
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

    return res.status(200).json({ updatedAnimalStatus });
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

    return res.status(200).json({ newLineage });
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

    return res.status(200).json({ updatedAnimalLineage });
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

    return res.status(200).json({ deletedAnimalLineage });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
//checkIsSafeBreeding
export async function checkIsSafeBreeding(req: Request, res: Response) {
  const { animalCode1, animalCode2 } = req.params;
  try {
    const isCompatible = await AnimalService.checkIsSafeBreeding(
      animalCode1,
      animalCode2,
    );
    return res.status(200).json(isCompatible);
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
