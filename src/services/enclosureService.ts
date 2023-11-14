import { Animal } from "../models/Animal";
import { Op } from "Sequelize";
import { validationErrorHandler } from "../helpers/errorHandler";
import { Enclosure } from "../models/Enclosure";
import * as AnimalService from "./animalService";
import * as SpeciesService from "./speciesService";
import * as AssetFacilityService from "./assetFacilityService";
import { Facility } from "../models/Facility";

import { writeFile } from "fs/promises";
import { Keeper } from "../models/Keeper";
import { Employee } from "../models/Employee";

export async function getAllEnclosures() {
  try {
    const allEnclosures = await Enclosure.findAll({ include: [Facility] });
    return allEnclosures;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getEnclosureById(enclosureId: number) {
  let enclosure = await Enclosure.findOne({
    where: { enclosureId: enclosureId },
  });
  if (enclosure) {
    return enclosure;
  }
  throw new Error("Invalid Enclosure ID!");
}

export async function createNewEnclosure(
  name: string,
  remark: string,
  length: number,
  width: number,
  height: number,
  enclosureStatus: string,
  facilityName: string,
  xCoordinate: number,
  yCoordinate: number,
  isSheltered: boolean,
  facilityDetail: string,
  facilityDetailJson: any,
  imageUrl: string,
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
    // console.log("==heree----");
    // let newFacility = await AssetFacilityService.createNewFacility(
    //   facilityName,
    //   xCoordinate,
    //   yCoordinate,
    //   isSheltered,
    //   facilityDetail,
    //   facilityDetailJson,
    //   imageUrl,
    // );

    let facility = {
      facilityName: facilityName,
      isSheltered: isSheltered,
      xCoordinate: xCoordinate,
      yCoordinate: yCoordinate,
      facilityDetail: facilityDetail,
      facilityDetailJson: facilityDetailJson,
      imageUrl: imageUrl,
    } as any;
    let newFacility = await Facility.create(facility, {});

    if (newFacility) {
      let enclousre = await Enclosure.create(newEnclosure);
      enclousre.setFacility(newFacility);

      return enclousre;
    } else {
      throw new Error("Failed to create facility!");
    }
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

export async function deleteEnclosure(enclosureId: number) {
  let enclosure = await getEnclosureById(enclosureId);
  let facilityToDelete = enclosure.getFacility();

  let result = await Enclosure.destroy({
    where: { enclosureId: enclosureId },
  });

  if (result) {
    await Facility.destroy({
      where: { facilityId: (await facilityToDelete).facilityId },
    });

    return result;
  }
  throw new Error("Invalid Enclosure ID!");
}

export async function getAnimalsOfEnclosure(enclosureId: number) {
  let animalsOfEnclosure: Animal[] = [];

  // let curEnclosure = await getEnclosuresById(enclosureId)

  let allAnimals = await AnimalService.getAllAnimals();

  if (allAnimals) {
    for (let a of allAnimals) {
      if (a.enclosure?.enclosureId === enclosureId) {
        animalsOfEnclosure.push(a);
      }
    }
  }

  if (animalsOfEnclosure) {
    return animalsOfEnclosure;
  }
  throw new Error("Invalid Enclosure ID!");
}

export async function assignAnimalToEnclosure(
  enclosureId: number,
  animalCode: string,
) {
  try {
    let enclosure = await getEnclosureById(enclosureId);
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
    let enclosure = await getEnclosureById(enclosureId);
    let animal = await AnimalService.getAnimalActivityByAnimalCode(animalCode);

    if (enclosure && animal) {
      enclosure.removeAnimal(animal);
    }
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getSpeciesCompatibilityInEnclosure(
  enclosureId: number,
  speciesCode: string,
) {
  // let result: Animal[] = [];

  try {
    let allAnimalsOfEnclosure = await getAnimalsOfEnclosure(enclosureId);

    const speciesCodeSet = new Set<string>();

    allAnimalsOfEnclosure.forEach((animal) => {
      if (animal.species && animal.species.speciesCode) {
        speciesCodeSet.add(animal.species.speciesCode);
      }
    });

    let isCompatible = true;
    for (const curSpeciesCode of speciesCodeSet) {
      console.log("test");
      console.log(speciesCode);
      console.log(curSpeciesCode);
      console.log(
        await SpeciesService.checkIsCompatible(speciesCode, curSpeciesCode),
      );
      console.log("-------");
      if (curSpeciesCode != speciesCode) {
        if (
          !(await SpeciesService.checkIsCompatible(speciesCode, curSpeciesCode))
        ) {
          isCompatible = false;
        }
      }
    }
    return isCompatible;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function updateDesignDiagram(
  enclosureId: number,
  designDiagramJson: string,
) {
  // let updatedEnclosureStatus = {
  //   enclosureStatus: enclosureStatus,
  // } as any;

  try {
    let enclosure = await getEnclosureById(enclosureId);
    // console.log("here")
    // console.log(designDiagramJson)
    const filePath = `enclosureDiagramJson/${enclosure.name}.json`;

    await writeFile(filePath, designDiagramJson);
    if (enclosure.designDiagramJsonUrl == null) {
      await Enclosure.update(
        { designDiagramJsonUrl: filePath },
        {
          where: { enclosureId: enclosureId },
        },
      );
    }
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function assignKeepersToEnclosure(
  enclosureId: number,
  employeeIds: number[],
) {
  try {
    let enclosure = await getEnclosureById(enclosureId);

    const employees = await Employee.findAll({
      where: {
        employeeId: {
          [Op.or]: employeeIds,
        },
      },
    });

    for (const empId of employeeIds) {
      if (!employees.find((e) => e.employeeId == empId))
        throw { mesage: "Unable to find Keeper with employee Id " + empId };
    }

    const keepers = [];
    for (const emp of employees) {
      const keeper = await emp.getKeeper();
      if (!keeper)
        throw {
          message: "Keeper does not exist on employee :" + emp.employeeName,
        };
      keepers.push(keeper);
    }

    const promises = [];
    for (const keeper of keepers) {
      promises.push(keeper.addEnclosure(enclosure));
    }

    for (const p of promises) await p;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}
