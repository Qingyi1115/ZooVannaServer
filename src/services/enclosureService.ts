import { Animal } from "../models/Animal";
import { validationErrorHandler } from "../helpers/errorHandler";
import { Enclosure } from "../models/Enclosure";
import * as AnimalService from "./animalService";
import * as AssetFacilityService from "./assetFacilityService";

export async function getAllEnclosures() {
  try {
    const allEnclosures = await Enclosure.findAll();
    return allEnclosures;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getEnclosuresById(enclosureId: number) {
  let result = await Enclosure.findOne({
    where: { enclosureId: enclosureId },
  });
  if (result) {
    return result;
  }
  throw new Error("Invalid Enclosure ID!");
}

// need to update to create facility too
export async function createNewEnclosure(
  facilityId: number,
  name: string,
  remark: string,
  length: number,
  width: number,
  height: number,
  enclosureStatus: string,
) {
  let newEnclosure = {
    name: name,
    remark: remark,
    length: length,
    width: width,
    height: height,
    enclosureStatus: enclosureStatus,
  } as any;

  try {
    let enclousre = await Enclosure.create(newEnclosure);
    enclousre.setFacility(
      await AssetFacilityService.getFacilityById(facilityId),
    );

    return enclousre;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function updateEnclosure(
  enclosureId: number,
  name: string,
  remark: string,
  length: number,
  width: number,
  height: number,
  enclosureStatus: string,
) {
  let updatedEnclosure = {
    name: name,
    remark: remark,
    length: length,
    width: width,
    height: height,
    enclosureStatus: enclosureStatus,
  } as any;

  try {
    await Enclosure.update(updatedEnclosure, {
      where: { enclosureId: enclosureId },
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function updateEnclosureStatus(
  enclosureId: number,
  enclosureStatus: string,
) {
  let updatedEnclosureStatus = {
    enclosureStatus: enclosureStatus,
  } as any;

  try {
    await Enclosure.update(updatedEnclosureStatus, {
      where: { enclosureId: enclosureId },
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

// need to update to delete facility too
export async function deleteEnclosure(enclosureId: number) {
  let result = await Enclosure.destroy({
    where: { enclosureId: enclosureId },
  });

  //delete facility also HEREE!!!!!!!!!

  if (result) {
    return result;
  }
  throw new Error("Invalid Enclosure ID!");
}

export async function getAnimalsOfEnclosure(enclosureId: number) {
  let result: Animal[] = [];

  // let curEnclosure = await getEnclosuresById(enclosureId)

  let allAnimals = await AnimalService.getAllAnimals();

  if (allAnimals) {
    for (let a of allAnimals) {
      if (a.enclosure?.enclosureId === enclosureId) {
        result.push(a);
      }
    }
  }

  if (result) {
    return result;
  }
  throw new Error("Invalid Enclosure ID!");
}

export async function assignAnimalToEnclosure(
  enclosureId: number,
  animalCode: string,
) {
  try {
    let enclosure = await getEnclosuresById(enclosureId);
    let animal = await AnimalService.getAnimalActivityByAnimalCode(animalCode);

    if (enclosure && animal) {
      enclosure.addAnimal(animal);
    }
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function removeAnimalFromEnclosure(
  enclosureId: number,
  animalCode: string,
) {
  try {
    let enclosure = await getEnclosuresById(enclosureId);
    let animal = await AnimalService.getAnimalActivityByAnimalCode(animalCode);

    if (enclosure && animal) {
      enclosure.removeAnimal(animal);
    }
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}
