import { Animal } from "../models/Animal";
import { Op } from "Sequelize";
import { validationErrorHandler } from "../helpers/errorHandler";
import { Enclosure } from "../models/Enclosure";
import * as AnimalService from "./animalService";
import * as SpeciesService from "./speciesService";
import * as EnrichmentItemService from "./enrichmentItemService";
import { Facility } from "../models/Facility";

import { writeFile } from "fs/promises";
import { Keeper } from "../models/Keeper";
import { Employee } from "../models/Employee";
import { Plantation } from "../models/Plantation";
import { EnclosureBarrier } from "../models/EnclosureBarrier";
import { AccessPoint } from "../models/AccessPoint";
import { MINUTES_IN_MILLISECONDS } from "../helpers/staticValues";
import { EnrichmentItem } from "../models/EnrichmentItem";
import { Species } from "../models/Species";
import { SpeciesEnclosureNeed } from "../models/SpeciesEnclosureNeed";

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
    include: [
      {
        model: Facility,
      },
      {
        model: Animal,
        required: false,
      },
      {
        model: Plantation,
        as: "plantations",
        required: false,
      },
      {
        model: Keeper,
        as: "keepers",
        required: false,
        include: [
          {
            model: Employee,
            required: true,
            as: "employee",
          },
        ],
      },
      {
        model: EnclosureBarrier,
        required: false,
      },
      {
        model: AccessPoint,
        as: "accessPoints",
        required: false,
      },
      {
        model: EnrichmentItem,
        as: "enrichmentItems",
        required: false,
      },
    ],
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
  standOffBarrierDist: number,
  facilityName: string,
  isSheltered: boolean,
  imageUrl: string,
) {
  let newEnclosure = {
    name: name,
    remark: remark,
    length: length,
    width: width,
    height: height,
    enclosureStatus: enclosureStatus,
    standOffBarrierDist: standOffBarrierDist,
  } as any;

  try {
    let facility = {
      facilityName: facilityName,
      isSheltered: isSheltered,
      imageUrl: imageUrl,
    } as any;

    let newFacility = await Facility.create(facility);
    let enclousre = await Enclosure.create(newEnclosure);
    await enclousre.setFacility(newFacility);

    return { newEnclosure: enclousre, newFacility: newFacility };
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
  standOffBarrierDist: number,
) {
  let updatedEnclosure = {
    name: name,
    remark: remark,
    length: length,
    width: width,
    height: height,
    enclosureStatus: enclosureStatus,
    standOffBarrierDist: standOffBarrierDist,
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
  landArea: number,
  waterArea: number,
  plantationCoveragePercent: number,
) {
  // let updatedEnclosureStatus = {
  //   enclosureStatus: enclosureStatus,
  // } as any;

  try {
    let enclosure = await getEnclosureById(enclosureId);
    // console.log("here")
    // console.log(designDiagramJson)
    const filePath = `enclosureDiagramJson/${enclosure.name}.json`;

    console.log("landArea" + landArea)
    console.log("waterArea" + waterArea)
    console.log("plantationCoveragePercent" + plantationCoveragePercent)

    await writeFile(filePath, designDiagramJson);
    // if (enclosure.designDiagramJsonUrl == null) {
    await Enclosure.update(
      {
        designDiagramJsonUrl: filePath,
        landArea: landArea,
        waterArea: waterArea,
        plantationCoveragePercent: plantationCoveragePercent,
      },
      {
        where: { enclosureId: enclosureId },
      },
    );
    // }
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
      promises.push(enclosure.addKeeper(keeper));
    }

    for (const p of promises) await p;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function removeKeepersFromEnclosure(
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
      promises.push(keeper.removeEnclosure(enclosure));
    }
    for (const p of promises) await p;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function updateEnclosureTerrainDistribution(
  enclosureId: number,
  longGrassPercent: number,
  shortGrassPercent: number,
  rockPercent: number,
  sandPercent: number,
  snowPercent: number,
  soilPercent: number,
) {
  let updatedEnclosure = {
    longGrassPercent: longGrassPercent,
    shortGrassPercent: shortGrassPercent,
    rockPercent: rockPercent,
    sandPercent: sandPercent,
    snowPercent: snowPercent,
    soilPercent: soilPercent,
  } as any;

  try {
    await Enclosure.update(updatedEnclosure, {
      where: { enclosureId: enclosureId },
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deleteEnclosureTerrainDistribution(enclosureId: number) {
  let updatedEnclosure = {
    longGrassPercent: null,
    shortGrassPercent: null,
    rockPercent: null,
    sandPercent: null,
    snowPercent: null,
    soilPercent: null,
  } as any;

  try {
    await Enclosure.update(updatedEnclosure, {
      where: { enclosureId: enclosureId },
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

// ---- QY: WIP ----
export async function getEnclosureTerrainDistributionRecommendation(
  enclosureId: number,
) {
  type Recommends = {
    minLandAreaRequired: number;
    minWaterAreaRequired: number;
    acceptableTempMin: number;
    acceptableTempMax: number;
    acceptableHumidityMin: number;
    acceptableHumidityMax: number;
    plantationCoveragePercentMin: number;
    plantationCoveragePercentMax: number;
    longGrassPercentMin: number;
    longGrassPercentMax: number;
    shortGrassPercentMin: number;
    shortGrassPercentMax: number;
    rockPercentMin: number;
    rockPercentMax: number;
    sandPercentMin: number;
    sandPercentMax: number;
    snowPercentMin: number;
    snowPercentMax: number;
    soilPercentMin: number;
    soilPercentMax: number;
  };
  // const reco: Recommends = {
  let reco: Recommends = {
    minLandAreaRequired: Number.MIN_SAFE_INTEGER,
    minWaterAreaRequired: Number.MIN_SAFE_INTEGER,
    acceptableTempMin: Number.MIN_SAFE_INTEGER,
    acceptableTempMax: Number.MAX_SAFE_INTEGER,
    acceptableHumidityMin: Number.MIN_SAFE_INTEGER,
    acceptableHumidityMax: Number.MAX_SAFE_INTEGER,
    plantationCoveragePercentMin: Number.MIN_SAFE_INTEGER,
    plantationCoveragePercentMax: Number.MAX_SAFE_INTEGER,
    longGrassPercentMin: Number.MIN_SAFE_INTEGER,
    longGrassPercentMax: Number.MAX_SAFE_INTEGER,
    shortGrassPercentMin: Number.MIN_SAFE_INTEGER,
    shortGrassPercentMax: Number.MAX_SAFE_INTEGER,
    rockPercentMin: Number.MIN_SAFE_INTEGER,
    rockPercentMax: Number.MAX_SAFE_INTEGER,
    sandPercentMin: Number.MIN_SAFE_INTEGER,
    sandPercentMax: Number.MAX_SAFE_INTEGER,
    snowPercentMin: Number.MIN_SAFE_INTEGER,
    snowPercentMax: Number.MAX_SAFE_INTEGER,
    soilPercentMin: Number.MIN_SAFE_INTEGER,
    soilPercentMax: Number.MAX_SAFE_INTEGER,
  };

  let enclosure = await Enclosure.findOne({
    where: { enclosureId: enclosureId },
    include: [
      {
        model: Animal, // Self-reference to represent parent-child relationships
        as: "animals",
        required: false,
        include: [
          {
            model: Species,
            as: "species",
            include: [
              {
                model: SpeciesEnclosureNeed,
                as: "speciesEnclosureNeed",
                required: false,
              },
            ],
          },
        ],
      },
    ],
  });

  if (enclosure) {
    if (enclosure.animals) {
      const species = new Set<Species>();
      enclosure.animals.forEach(async (animal) => {
        if (animal.species?.speciesEnclosureNeed) {
          species.add(animal.species);
        } else {
          return "No Enclosure Requirement Data Found!";
        }
      }); // ensure all have enclosure requiemnt, else no data

      for (let s of species) {
        console.log(s.commonName)
        console.log("here!")
        console.log(s.speciesEnclosureNeed!.minLandAreaRequired)
        console.log(reco.minLandAreaRequired)
        // s.speciesEnclosureNeed!.minLandAreaRequired = Math.max(
        //   s.speciesEnclosureNeed!.minLandAreaRequired,
        //   reco.minLandAreaRequired,
        // );
        // s.speciesEnclosureNeed!.minWaterAreaRequired = Math.max(
        //   s.speciesEnclosureNeed!.minWaterAreaRequired,
        //   reco.minWaterAreaRequired,
        // );
        // s.speciesEnclosureNeed!.acceptableTempMin = Math.max(
        //   s.speciesEnclosureNeed!.acceptableTempMin,
        //   reco.acceptableTempMin,
        // );
        // s.speciesEnclosureNeed!.acceptableTempMax = Math.min(
        //   s.speciesEnclosureNeed!.acceptableTempMax,
        //   reco.acceptableTempMax,
        // );
        // s.speciesEnclosureNeed!.acceptableHumidityMin = Math.max(
        //   s.speciesEnclosureNeed!.acceptableHumidityMin,
        //   reco.acceptableHumidityMin,
        // );
        // s.speciesEnclosureNeed!.acceptableHumidityMax = Math.min(
        //   s.speciesEnclosureNeed!.acceptableHumidityMax,
        //   reco.acceptableHumidityMax,
        // );
        // s.speciesEnclosureNeed!.plantationCoveragePercentMin = Math.max(
        //   s.speciesEnclosureNeed!.plantationCoveragePercentMin,
        //   reco.plantationCoveragePercentMin,
        // );
        // s.speciesEnclosureNeed!.plantationCoveragePercentMax = Math.min(
        //   s.speciesEnclosureNeed!.plantationCoveragePercentMax,
        //   reco.plantationCoveragePercentMax,
        // );
        // s.speciesEnclosureNeed!.longGrassPercentMin = Math.max(
        //   s.speciesEnclosureNeed!.longGrassPercentMin,
        //   reco.longGrassPercentMin,
        // );
        // s.speciesEnclosureNeed!.longGrassPercentMax = Math.min(
        //   s.speciesEnclosureNeed!.longGrassPercentMax,
        //   reco.longGrassPercentMax,
        // );
        // s.speciesEnclosureNeed!.shortGrassPercentMin = Math.max(
        //   s.speciesEnclosureNeed!.shortGrassPercentMin,
        //   reco.shortGrassPercentMin,
        // );
        // s.speciesEnclosureNeed!.shortGrassPercentMax = Math.min(
        //   s.speciesEnclosureNeed!.shortGrassPercentMax,
        //   reco.shortGrassPercentMax,
        // );
        // s.speciesEnclosureNeed!.rockPercentMin = Math.max(
        //   s.speciesEnclosureNeed!.rockPercentMin,
        //   reco.rockPercentMin,
        // );
        // s.speciesEnclosureNeed!.rockPercentMax = Math.min(
        //   s.speciesEnclosureNeed!.rockPercentMax,
        //   reco.rockPercentMax,
        // );
        // s.speciesEnclosureNeed!.sandPercentMin = Math.max(
        //   s.speciesEnclosureNeed!.sandPercentMin,
        //   reco.sandPercentMin,
        // );
        // s.speciesEnclosureNeed!.sandPercentMax = Math.min(
        //   s.speciesEnclosureNeed!.sandPercentMax,
        //   reco.sandPercentMax,
        // );
        // s.speciesEnclosureNeed!.snowPercentMin = Math.max(
        //   s.speciesEnclosureNeed!.snowPercentMin,
        //   reco.snowPercentMin,
        // );
        // s.speciesEnclosureNeed!.snowPercentMax = Math.min(
        //   s.speciesEnclosureNeed!.snowPercentMax,
        //   reco.snowPercentMax,
        // );

        // s.speciesEnclosureNeed!.soilPercentMin = Math.max(
        //   s.speciesEnclosureNeed!.soilPercentMin,
        //   reco.soilPercentMin,
        // );
        // s.speciesEnclosureNeed!.soilPercentMax = Math.min(
        //   s.speciesEnclosureNeed!.soilPercentMax,
        //   reco.soilPercentMax,
        // );
        reco.minLandAreaRequired = Math.max(
          s.speciesEnclosureNeed!.minLandAreaRequired,
          reco.minLandAreaRequired,
        );
        reco.minWaterAreaRequired = Math.max(
          s.speciesEnclosureNeed!.minWaterAreaRequired,
          reco.minWaterAreaRequired,
        );
        reco.acceptableTempMin = Math.max(
          s.speciesEnclosureNeed!.acceptableTempMin,
          reco.acceptableTempMin,
        );
        reco.acceptableTempMax = Math.min(
          s.speciesEnclosureNeed!.acceptableTempMax,
          reco.acceptableTempMax,
        );
        reco.acceptableHumidityMin = Math.max(
          s.speciesEnclosureNeed!.acceptableHumidityMin,
          reco.acceptableHumidityMin,
        );
        reco.acceptableHumidityMax = Math.min(
          s.speciesEnclosureNeed!.acceptableHumidityMax,
          reco.acceptableHumidityMax,
        );
        reco.plantationCoveragePercentMin = Math.max(
          s.speciesEnclosureNeed!.plantationCoveragePercentMin,
          reco.plantationCoveragePercentMin,
        );
        reco.plantationCoveragePercentMax = Math.min(
          s.speciesEnclosureNeed!.plantationCoveragePercentMax,
          reco.plantationCoveragePercentMax,
        );
        reco.longGrassPercentMin = Math.max(
          s.speciesEnclosureNeed!.longGrassPercentMin,
          reco.longGrassPercentMin,
        );
        reco.longGrassPercentMax = Math.min(
          s.speciesEnclosureNeed!.longGrassPercentMax,
          reco.longGrassPercentMax,
        );
        reco.shortGrassPercentMin = Math.max(
          s.speciesEnclosureNeed!.shortGrassPercentMin,
          reco.shortGrassPercentMin,
        );
        reco.shortGrassPercentMax = Math.min(
          s.speciesEnclosureNeed!.shortGrassPercentMax,
          reco.shortGrassPercentMax,
        );
        reco.rockPercentMin = Math.max(
          s.speciesEnclosureNeed!.rockPercentMin,
          reco.rockPercentMin,
        );
        reco.rockPercentMax = Math.min(
          s.speciesEnclosureNeed!.rockPercentMax,
          reco.rockPercentMax,
        );
        reco.sandPercentMin = Math.max(
          s.speciesEnclosureNeed!.sandPercentMin,
          reco.sandPercentMin,
        );
        reco.sandPercentMax = Math.min(
          s.speciesEnclosureNeed!.sandPercentMax,
          reco.sandPercentMax,
        );
        reco.snowPercentMin = Math.max(
          s.speciesEnclosureNeed!.snowPercentMin,
          reco.snowPercentMin,
        );
        reco.snowPercentMax = Math.min(
          s.speciesEnclosureNeed!.snowPercentMax,
          reco.snowPercentMax,
        );

        reco.soilPercentMin = Math.max(
          s.speciesEnclosureNeed!.soilPercentMin,
          reco.soilPercentMin,
        );
        reco.soilPercentMax = Math.min(
          s.speciesEnclosureNeed!.soilPercentMax,
          reco.soilPercentMax,
        );
      }

      // if min > max, then convert to string "No suitable range, please review species allocation."

      //return reco (the converted one);
      return {
        minLandAreaRequired: reco.minLandAreaRequired,
        minWaterAreaRequired: reco.minWaterAreaRequired,
        acceptableTempMin:
          reco.acceptableTempMax >= reco.acceptableTempMin
            ? reco.acceptableTempMin
            : "No suitable range, please review species allocation.",
        acceptableTempMax:
          reco.acceptableTempMax >= reco.acceptableTempMin
            ? reco.acceptableTempMax
            : "No suitable range, please review species allocation.",
        acceptableHumidityMin:
          reco.acceptableHumidityMax >= reco.acceptableHumidityMin
            ? reco.acceptableHumidityMin
            : "No suitable range, please review species allocation.",
        acceptableHumidityMax:
          reco.acceptableHumidityMax >= reco.acceptableHumidityMin
            ? reco.acceptableHumidityMax
            : "No suitable range, please review species allocation.",
        plantationCoveragePercentMin:
          reco.plantationCoveragePercentMax >= reco.plantationCoveragePercentMin
            ? reco.plantationCoveragePercentMin
            : "No suitable range, please review species allocation.",
        plantationCoveragePercentMax:
          reco.plantationCoveragePercentMax >= reco.plantationCoveragePercentMin
            ? reco.plantationCoveragePercentMax
            : "No suitable range, please review species allocation.",
        longGrassPercentMin:
          reco.longGrassPercentMax >= reco.longGrassPercentMin
            ? reco.longGrassPercentMin
            : "No suitable range, please review species allocation.",
        longGrassPercentMax:
          reco.longGrassPercentMax >= reco.longGrassPercentMin
            ? reco.longGrassPercentMax
            : "No suitable range, please review species allocation.",
        shortGrassPercentMin:
          reco.shortGrassPercentMax >= reco.shortGrassPercentMin
            ? reco.shortGrassPercentMin
            : "No suitable range, please review species allocation.",
        shortGrassPercentMax:
          reco.shortGrassPercentMax >= reco.shortGrassPercentMin
            ? reco.shortGrassPercentMax
            : "No suitable range, please review species allocation.",
        rockPercentMin:
          reco.rockPercentMax >= reco.rockPercentMin
            ? reco.rockPercentMin
            : "No suitable range, please review species allocation.",
        rockPercentMax:
          reco.rockPercentMax >= reco.rockPercentMin
            ? reco.rockPercentMax
            : "No suitable range, please review species allocation.",
        sandPercentMin:
          reco.sandPercentMax >= reco.sandPercentMin
            ? reco.sandPercentMin
            : "No suitable range, please review species allocation.",
        sandPercentMax:
          reco.sandPercentMax >= reco.sandPercentMin
            ? reco.sandPercentMax
            : "No suitable range, please review species allocation.",
        snowPercentMin:
          reco.snowPercentMax >= reco.snowPercentMin
            ? reco.snowPercentMin
            : "No suitable range, please review species allocation.",
        snowPercentMax:
          reco.snowPercentMax >= reco.snowPercentMin
            ? reco.snowPercentMax
            : "No suitable range, please review species allocation.",
        soilPercentMin:
          reco.soilPercentMax >= reco.soilPercentMin
            ? reco.soilPercentMin
            : "No suitable range, please review species allocation.",
        soilPercentMax:
          reco.soilPercentMax >= reco.soilPercentMin
            ? reco.soilPercentMax
            : "No suitable range, please review species allocation.",
      };
    }
    throw new Error("Enclosure Has No Animal Data!");
  }
  throw new Error("Invalid Enclosure ID!");
}

export async function updateEnclosureClimateDesign(
  enclosureId: number,
  acceptableTempMin: number,
  acceptableTempMax: number,
  acceptableHumidityMin: number,
  acceptableHumidityMax: number,
) {
  let updatedEnclosure = {
    acceptableTempMin: acceptableTempMin,
    acceptableTempMax: acceptableTempMax,
    acceptableHumidityMin: acceptableHumidityMin,
    acceptableHumidityMax: acceptableHumidityMax,
  } as any;

  try {
    await Enclosure.update(updatedEnclosure, {
      where: { enclosureId: enclosureId },
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deleteEnclosureClimateDesign(enclosureId: number) {
  let updatedEnclosure = {
    acceptableTempMin: null,
    acceptableTempMax: null,
    acceptableHumidityMin: null,
    acceptableHumidityMax: null,
  } as any;

  try {
    await Enclosure.update(updatedEnclosure, {
      where: { enclosureId: enclosureId },
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

// // ---- QY: WIP ----
// export async function getClimateDesignRecommendation(enclosureId: number) {
//   let enclosure = await Enclosure.findOne({
//     where: { enclosureId: enclosureId },
//   });
//   if (enclosure) {
//     // - Get all animals of enclosure, then get species list (see getSpeciesCompatibilityInEnclosure service method)
//     // - Get all speciesEnclosureNeeds
//     // - Do some maths idk, or apply some rules
//     // - Return list of recommended terrainDistribution, min and max for each longGrass, shortGrass,...
//     //-- add code here
//     //
//     //return enclosure;
//   }
//   throw new Error("Invalid Enclosure ID!");
// }

export async function getPlantationById(plantationId: number) {
  let plantation = await Plantation.findOne({
    where: { plantationId: plantationId },
  });
  if (plantation) {
    return plantation;
  }
  throw new Error("Invalid Plantation ID!");
}

export async function getAllPlantations() {
  try {
    const allPlantation = await Plantation.findAll({});
    return allPlantation;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllPlantationsByEnclosureId(enclosureId: number) {
  let result = await Enclosure.findOne({
    where: { enclosureId: enclosureId },
    include: {
      model: Plantation,
      required: false, // Include only if they exist
    },
  });

  if (result) {
    let plantations = await result.plantations;
    if (plantations) {
      return plantations;
    } else {
      throw new Error("This Enclosure Has No Plantations!");
    }
  }
  throw new Error("Invalid Plantation!");
}

export async function addPlantationToEnclosure(
  enclosureId: number,
  plantationId: number,
) {
  try {
    let enclosure = await getEnclosureById(enclosureId);
    let plantation = await getPlantationById(plantationId);

    if (enclosure && plantation) {
      enclosure.addPlantation(plantation);
    }
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function removePlantationFromEnclosure(
  enclosureId: number,
  plantationId: number,
) {
  try {
    let enclosure = await getEnclosureById(enclosureId);
    let plantation = await getPlantationById(plantationId);

    if (enclosure && plantation) {
      enclosure.removePlantation(plantation);
    }
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getEnvironmentSensorsData(enclosureId: number) {
  try {
    let enclosure = await getEnclosureById(enclosureId);

    const facility = await enclosure.getFacility();
    const sensors = [];

    for (const hub of await facility.getHubProcessors()) {
      sensors.push(
        ...(await hub.getSensors({
          include: [
            {
              association: "sensorReadings",
              required: false,
              where: {
                readingDate: {
                  [Op.lt]: new Date(),
                  [Op.gt]: new Date(Date.now() - 15 * MINUTES_IN_MILLISECONDS),
                },
              },
            },
          ],
        })),
      );
    }
    return sensors;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

// encloure ---

export async function getEnclosureBarrier(enclosureId: number) {
  let result = await Enclosure.findOne({
    where: { enclosureId: enclosureId },
    include: {
      model: EnclosureBarrier,
      required: false, // Include only if they exist
    },
  });

  if (result) {
    let enclosureBarrier = await result.enclosureBarrier;
    if (enclosureBarrier) {
      return enclosureBarrier;
    } else {
      throw new Error("This Enclosure Has No Barrier Data!");
    }
  }
  throw new Error("Invalid Enclousre Code!");
}

export async function createNewEnclosureBarrier(
  enclosureId: number,
  wallName: string,
  barrierType: string,
  remarks: string,
) {
  let newBarrier = {
    wallName: wallName,
    barrierType: barrierType,
    remarks: remarks,
  } as any;

  try {
    let newBarrierEntry = await EnclosureBarrier.create(newBarrier);

    newBarrierEntry.setEnclosure(await getEnclosureById(enclosureId));

    return newBarrierEntry;
  } catch (error: any) {
    console.log(error);
    throw validationErrorHandler(error);
  }
}

export async function updateEnclosureBarrier(
  enclosureBarrierId: number,
  wallName: string,
  barrierType: string,
  remarks: string,
) {
  let updatedEnclosureBarrier = {
    wallName: wallName,
    barrierType: barrierType,
    remarks: remarks,
  } as any;

  try {
    return await EnclosureBarrier.update(updatedEnclosureBarrier, {
      where: { enclosureBarrierId: enclosureBarrierId },
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deleteEnclosureBarrier(enclosureBarrierId: number) {
  let result = await EnclosureBarrier.destroy({
    where: { enclosureBarrierId: enclosureBarrierId },
  });
  if (result) {
    return result;
  }
  throw new Error("Invalid Enclosure Barrier Id!");
}

// -- access point
export async function getEnclosureAccessPoints(enclosureId: number) {
  let result = await Enclosure.findOne({
    where: { enclosureId: enclosureId },
    include: {
      model: AccessPoint,
      required: false, // Include only if they exist
    },
  });

  if (result) {
    let accessPoints = await result.accessPoints;
    if (accessPoints) {
      return accessPoints;
    } else {
      throw new Error("This Enclosure Has No Access Point!");
    }
  }
  throw new Error("Invalid Enclousre Code!");
}

export async function getEnclosureAccessPointById(accessPointId: number) {
  let result = await AccessPoint.findOne({
    where: { accessPointId: accessPointId },
  });

  if (result) {
    return result;
  }
  throw new Error("Invalid Access Point Code!");
}

export async function createNewEnclosureAccessPoint(
  enclosureId: number,
  name: string,
  type: string,
) {
  let newAccessPoint = {
    name: name,
    type: type,
  } as any;

  try {
    let newAccessPointEntry = await AccessPoint.create(newAccessPoint);

    newAccessPointEntry.setEnclosure(await getEnclosureById(enclosureId));

    return newAccessPointEntry;
  } catch (error: any) {
    console.log(error);
    throw validationErrorHandler(error);
  }
}

export async function updateEnclosureAccessPoint(
  accessPointId: number,
  name: string,
  type: string,
) {
  let updatedAccessPoint = {
    name: name,
    type: type,
  } as any;

  try {
    return await AccessPoint.update(updatedAccessPoint, {
      where: { accessPointId: accessPointId },
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deleteEnclosureAccessPoint(accessPointId: number) {
  let result = await AccessPoint.destroy({
    where: { accessPointId: accessPointId },
  });
  if (result) {
    return result;
  }
  throw new Error("Invalid Access Point Id!");
}

// -- enclosure enrichment item
export async function getEnclosureEnrichmentItems(enclosureId: number) {
  let result = await Enclosure.findOne({
    where: { enclosureId: enclosureId },
    include: {
      model: EnrichmentItem,
      required: false, // Include only if they exist
    }, //eager fetch here
  });

  if (result) {
    let items = await result.enrichmentItems;
    if (items) {
      return items;
    } else {
      throw new Error("This Enclosure Has No Enrichment Items!");
    }
  }
  throw new Error("Invalid Enclosure Id!");
}

export async function addEnrichmentItemToEnclosure(
  enclosureId: number,
  enrichmentItemId: number,
) {
  try {
    let enclosure = await getEnclosureById(enclosureId);
    let item =
      await EnrichmentItemService.getEnrichmentItemById(enrichmentItemId);

    if (enclosure && item) {
      enclosure.addEnrichmentItem(item);
    }
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function removeEnrichmentItemFromEnclosure(
  enclosureId: number,
  enrichmentItemId: number,
) {
  try {
    let enclosure = await getEnclosureById(enclosureId);
    let item =
      await EnrichmentItemService.getEnrichmentItemById(enrichmentItemId);

    if (enclosure && item) {
      enclosure.removeEnrichmentItem(item);
    }
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}
