import { Request } from "express";
import { Op } from "Sequelize";
import { conn } from "../db";
import { validationErrorHandler } from "../helpers/errorHandler";
import { Animal } from "../models/animal";
import { Species } from "../models/species";
import { PhysiologicalReferenceNorms } from "../models/physiologicalReferenceNorms";
import {
  ActivityType,
  AnimalGrowthStage,
  AnimalSex,
  AnimalStatus,
  DayOfWeek,
  EventTimingType,
  Rating,
  RecurringPattern,
} from "../models/enumerated";
import { AnimalWeight } from "../models/animalWeight";
import * as SpeciesService from "../services/species";
import { EnrichmentItem } from "../models/enrichmentItem";
import { Employee } from "../models/employee";
import * as EnrichmentItemService from "../services/enrichmentItem";
import { findEmployeeById } from "./employee";
import { AnimalObservationLog } from "../models/animalObservationLog";
import { AnimalActivity } from "../models/animalActivity";
import * as ZooEventService from "./zooEvent";
import { DAY_IN_MILLISECONDS } from "../helpers/staticValues";
import { compareDates, getNextDayOfMonth, getNextDayOfWeek } from "../helpers/others";

//-- Animal Basic Info
export async function getAnimalIdByCode(animalCode: string) {
  let result = await Animal.findOne({
    where: { animalCode: animalCode },
  });
  if (result) {
    return result.getAnimalId();
  }
  throw new Error("Invalid Animal Code!");
}

// export async function getAnimalByCode(animalCode: string) {
//   let result = await Animal.findOne({
//     where: { animalCode: animalCode },
//   });
//   if (result) {
//     return result;
//   }
//   throw new Error("Invalid Animal Code!");
// }

export async function getAllAnimals() {
  try {
    const allAnimals = await Animal.findAll({
      include: [Species],
    });
    return allAnimals;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllAnimalsBySpeciesCode(speciesCode: string) {
  let result: Animal[] = [];
  let allAnimals = await getAllAnimals();
  if (allAnimals) {
    for (let a of allAnimals) {
      if (a.species?.speciesCode === speciesCode) {
        result.push(a);
      }
    }
  }
  if (result) {
    return result;
  }

  throw new Error("Invalid Species Code!");
}

export async function getAnimalByAnimalCode(animalCode: string) {
  //   try {
  //     const allAnimals = await Animal.findAll({ include: [Species] });
  //     return allAnimals;
  //   } catch (error: any) {
  //     throw validationErrorHandler(error);
  //   }

  let animalRecord = await Animal.findOne({
    where: { animalCode: animalCode },
    include: [
      {
        model: Species,
      },
      {
        model: AnimalWeight,
        required: false, // Include the Animal Weights only if they exist
      },
      {
        model: Animal,
        as: "parents",
        required: false, // Include the parents only if they exist
      },
      {
        model: Animal,
        as: "children",
        required: false, // Include the children only if they exist
      },
    ],
    attributes: {
      // Include the 'age' virtual field
      include: ["age"],
    },
  });

  if (animalRecord) {
    return animalRecord;
  }
  // console.log("animal code: " + animalCode);
  // console.log("--in here 2 --");
  throw new Error("Invalid Animal Code!");
}

export async function createNewAnimal(
  speciesCode: string,
  isGroup: boolean,
  houseName: string,
  sex: string | null,
  dateOfBirth: Date | null,
  placeOfBirth: string | null,
  identifierType: string | null,
  identifierValue: string | null,
  acquisitionMethod: string,
  dateOfAcquisition: Date,
  acquisitionRemarks: string | null,
  physicalDefiningCharacteristics: string | null,
  behavioralDefiningCharacteristics: string | null,
  dateOfDeath: Date | null,
  locationOfDeath: string | null,
  causeOfDeath: string | null,
  animalStatus: string,
  imageUrl: string,
) {
  let newAnimal = {
    animalCode: await Animal.getNextAnimalCode(),
    isGroup: isGroup,
    houseName: houseName,
    sex: sex,
    dateOfBirth: dateOfBirth,
    placeOfBirth: placeOfBirth,
    identifierType: identifierType,
    identifierValue: identifierValue,
    acquisitionMethod: acquisitionMethod,
    dateOfAcquisition: dateOfAcquisition,
    acquisitionRemarks: acquisitionRemarks,
    physicalDefiningCharacteristics: physicalDefiningCharacteristics,
    behavioralDefiningCharacteristics: behavioralDefiningCharacteristics,
    dateOfDeath: dateOfDeath,
    locationOfDeath: locationOfDeath,
    causeOfDeath: causeOfDeath,
    animalStatus: animalStatus,
    imageUrl: imageUrl,
  } as any;

  console.log(newAnimal);

  try {
    let newAnimalEntry = await Animal.create(newAnimal);

    newAnimalEntry.setSpecies(
      await SpeciesService.getSpeciesByCode(speciesCode, [
        "physiologicalReferenceNorms",
      ]),
    );

    return newAnimalEntry;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function updateAnimal(
  animalCode: string,
  houseName: string,
  sex: string | null,
  dateOfBirth: Date | null,
  placeOfBirth: string | null,
  identifierType: string | null,
  identifierValue: string | null,
  acquisitionMethod: string,
  dateOfAcquisition: Date,
  acquisitionRemarks: string | null,
  physicalDefiningCharacteristics: string | null,
  behavioralDefiningCharacteristics: string | null,
  dateOfDeath: Date | null,
  locationOfDeath: string | null,
  causeOfDeath: string | null,
  animalStatus: string,
  imageUrl: string,
) {
  let updatedAnimal = {
    houseName: houseName,
    sex: sex,
    dateOfBirth: dateOfBirth,
    placeOfBirth: placeOfBirth,
    identifierType: identifierType,
    identifierValue: identifierValue,
    acquisitionMethod: acquisitionMethod,
    dateOfAcquisition: dateOfAcquisition,
    acquisitionRemarks: acquisitionRemarks,
    physicalDefiningCharacteristics: physicalDefiningCharacteristics,
    behavioralDefiningCharacteristics: behavioralDefiningCharacteristics,
    dateOfDeath: dateOfDeath,
    locationOfDeath: locationOfDeath,
    causeOfDeath: causeOfDeath,
    animalStatus: animalStatus,
    imageUrl: imageUrl,
  } as any;

  console.log(updatedAnimal);

  try {
    await Animal.update(updatedAnimal, {
      where: { animalCode: animalCode },
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deleteAnimal(animalCode: string) {
  let result = await Animal.destroy({
    where: { animalCode: animalCode },
  });
  if (result) {
    return result;
  }
  throw new Error("Invalid Animal Code!");
}

export async function updateAnimalStatus(
  animalCode: string,
  animalStatus: string,
) {
  let updatedAnimalStatus = {
    animalStatus: animalStatus,
  } as any;

  console.log(updatedAnimalStatus);

  // Split the string by ","
  const animalStatusArray = animalStatus.split(",");

  // Check if every status is a valid AnimalStatus enum value
  const allItemsInEnum = animalStatusArray.every((item) =>
    Object.values(AnimalStatus).includes(item.trim() as AnimalStatus),
  );

  if (allItemsInEnum) {
    try {
      await Animal.update(updatedAnimalStatus, {
        where: { animalCode: animalCode },
      });
    } catch (error: any) {
      throw validationErrorHandler(error);
    }
  } else {
    throw new Error(
      `"${animalStatus}" contains invalid Animal Status value(s).`,
    );
  }
}

//-- Animal Lineage
export async function addAnimalLineage(
  childAnimalCode: string,
  parentAnimalCode: string,
) {
  let childAnimal = await getAnimalByAnimalCode(childAnimalCode);
  console.log(childAnimal);
  let parentAnimal = await getAnimalByAnimalCode(parentAnimalCode);

  if (!childAnimal || !parentAnimal) {
    throw new Error("Child or parent animal not found.");
  }

  // Check if the child is trying to add itself as its parent
  if (childAnimalCode === parentAnimalCode) {
    throw new Error("An animal can't be its own parent.");
  }

  if ((await childAnimal.hasLessThanTwoParents()) == false) {
    throw new Error("An animal can't have more than 2 parents.");
  }

  let parents = await childAnimal.getParents();
  if (parents) {
    for (let parent of parents) {
      if (parent.animalCode === parentAnimalCode) {
        throw new Error(
          parentAnimalCode + " is already a parent of current animal!",
        );
      }
    }
  }

  try {
    childAnimal.addParent(parentAnimal);
    // parentAnimal.addChildren(childAnimal);
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getLineageByAnimalCode(animalCode: string) {
  let animalRecord = await Animal.findOne({
    where: { animalCode: animalCode },
    include: [
      {
        model: Animal, // Self-reference to represent parent-child relationships
        as: "children",
        required: false,
        include: [
          {
            model: Animal,
            as: "children",
            required: false,
            include: [
              {
                model: Animal,
                as: "children",
                required: false,
              },
              {
                model: Animal,
                as: "parents",
                required: false,
              },
            ],
          },
          {
            model: Animal,
            as: "parents",
            required: false,
          },
        ],
      },
      {
        model: Animal, // Self-reference to represent parent-child relationships
        as: "parents",
        required: false,
        include: [
          {
            model: Animal,
            as: "parents",
            required: false,
            include: [
              {
                model: Animal,
                as: "parents",
                required: false,
              },
              {
                model: Animal,
                as: "children",
                required: false,
              },
            ],
          },
          {
            model: Animal,
            as: "children",
            required: false,
          },
        ],
      },
    ],
    attributes: {
      // Include the 'age' virtual field
      include: ["age"],
    },
  });

  if (animalRecord) {
    return animalRecord;
  }
  throw new Error("Invalid Animal Code!");
}

export async function updateAnimalLineage(
  childAnimalCode: string,
  parentAnimalCode: string,
  newParentAnimalCode: string,
) {
  // try {

  //   await addAnimalLineage(childAnimalCode, newParentAnimalCode);
  //   await deleteAnimalLineage(childAnimalCode, parentAnimalCode);

  // } catch (error: any) {
  //   throw new Error(error);
  // }

  try {
    await deleteAnimalLineage(childAnimalCode, parentAnimalCode);
  } catch (error) {
    // Handle the error from deleteAnimalLineage
    throw new Error("Error deleting lineage: " + error);
    // console.error("Error deleting lineage:", error);
  }

  try {
    await addAnimalLineage(childAnimalCode, newParentAnimalCode);
  } catch (error) {
    await addAnimalLineage(childAnimalCode, parentAnimalCode);
    // Handle the error from addAnimalLineage
    // console.error("Error adding lineage:", error);
    throw new Error("Error adding lineage: " + error);
  }
}

export async function deleteAnimalLineage(
  childAnimalCode: string,
  parentAnimalCode: string,
) {
  let childAnimal = await Animal.findOne({
    where: { animalCode: childAnimalCode },
    include: {
      model: Animal,
      as: "parents",
      required: false,
    },
  });

  let parentAnimal = await Animal.findOne({
    where: { animalCode: parentAnimalCode },
    include: {
      model: Animal,
      as: "children",
      required: false,
    },
  });

  // check if child and parent exists
  if (!childAnimal || !parentAnimal) {
    throw new Error("Child or parent animal not found.");
  }

  // check if child has the parent
  const parents = await childAnimal.getParents();
  let isValidParent = false;
  for (const parent of parents) {
    if (parent.animalId === parentAnimal.animalId) {
      isValidParent = true;
      break; // Exit the loop as soon as a match is found
    }
  }

  if (isValidParent) {
    try {
      await childAnimal.removeParent(parentAnimal);
    } catch (error: any) {
      throw new Error(error);
    }
  } else {
    throw new Error("Child animal has no such parent.");
  }
}

export async function checkInbreeding( // Check if two animals are related through common ancestors within given degrees
  animalCode1: string,
  animalCode2: string,
  // depth: number,
): Promise<boolean> {
  // if (depth === 0) {
  //   return false; // Stop recursion at depth 0
  // }

  let animal1 = await Animal.findOne({
    where: { animalCode: animalCode1 },
    include: {
      model: Animal, // Self-reference to represent parent-child relationships
      as: "parents",
      required: false,
      include: [
        {
          model: Animal,
          as: "parents",
          required: false,
          include: [
            {
              model: Animal,
              as: "parents",
              required: false,
            },
          ],
        },
      ],
    },
  });

  let animal2 = await Animal.findOne({
    where: { animalCode: animalCode2 },
    include: {
      model: Animal, // Self-reference to represent parent-child relationships
      as: "parents",
      required: false,
      include: [
        {
          model: Animal,
          as: "parents",
          required: false,
          include: [
            {
              model: Animal,
              as: "parents",
              required: false,
            },
          ],
        },
      ],
    },
  });

  if (!animal1 || !animal2) {
    throw new Error("Invalid Animal Code!");
  }

  // Check if animal1 is an ancestor of animal2 and vice versa
  const isAncestorOf1 = isAncestor(animal1, animal2.animalId);
  const isAncestorOf2 = isAncestor(animal2, animal1.animalId);

  // Check if animal1 and animal2 have the same parents
  const haveSameParents = haveSameParentsCheck(animal1, animal2);

  // Return true if all false
  return isAncestorOf1 || isAncestorOf2 || haveSameParents;
}

// Helper function to check if one animal is an ancestor of another
function isAncestor(animal: any, targetId: number): boolean {
  if (!animal || !animal.parents || animal.parents.length === 0) {
    return false;
  }

  if (animal.parents.some((parent: any) => parent.animalId === targetId)) {
    return true;
  }

  return animal.parents.some((parent: any) => isAncestor(parent, targetId));
}

// Helper function to check if two animals have the same parents
function haveSameParentsCheck(animal1: any, animal2: any): boolean {
  if (animal1.parents.length === 0 || animal2.parents.length === 0) {
    console.log("here--1");
    return false;
  }

  console.log("here--2");
  const parentIds1 = animal1.parents.map((parent: any) => parent.animalId);
  const parentIds2 = animal2.parents.map((parent: any) => parent.animalId);

  console.log("here--parentIds1: " + parentIds1);
  console.log("here--parentIds2: " + parentIds2);
  return parentIds1.every((animalId: any) => parentIds2.includes(animalId));
}

//-- Animal Weight
export async function addAnimalWeight(
  animalCode: string,
  weightInKg: number,
  dateOfMeasure: Date,
) {
  let newWeight = {
    animalCode: animalCode,
    weightInKg: weightInKg,
    dateOfMeasure: dateOfMeasure,
  } as any;

  console.log(newWeight);

  try {
    let newWeightEntry = await AnimalWeight.create(newWeight);

    newWeightEntry.setAnimal(await getAnimalByAnimalCode(animalCode));

    return newWeightEntry;
  } catch (error: any) {
    console.log(error);
    throw validationErrorHandler(error);
  }
}

export async function deleteAnimalWeight(animalWeightId: string) {
  let result = await AnimalWeight.destroy({
    where: { animalWeightId: animalWeightId },
  });
  if (result) {
    return result;
  }
  throw new Error("Invalid Animal Weight Id!");
}

export async function getAllAnimalWeightsByAnimalCode(animalCode: string) {
  let result = await Animal.findOne({
    where: { animalCode: animalCode },
    include: AnimalWeight, //eager fetch here
  });

  if (result) {
    let resultAnimalWeights = await result.animalWeights;
    return resultAnimalWeights;
  }
  throw new Error("Invalid Animal Code!");
}

export async function getAllAbnormalWeights() {
  let animals = await getAllAnimals();
  let abnormalWeightAnimals: Animal[] = [];

  for (let animal of animals) {
    let currentAnimalWeightStatus = await checkIfAbnormalWeight(
      animal.animalCode,
    );

    if (
      currentAnimalWeightStatus == "Underweight" ||
      currentAnimalWeightStatus == "Overweight"
    ) {
      abnormalWeightAnimals.push(animal);
    }
  }

  return abnormalWeightAnimals;
}

export async function checkIfAbnormalWeight(animalCode: string) {
  let animal = await Animal.findOne({
    where: { animalCode: animalCode },
    include: [
      {
        model: Species,
        required: false, // Include only if they exist
        include: [
          {
            model: PhysiologicalReferenceNorms,
            required: false, // Include only if they exist
          },
        ],
      },
      {
        model: AnimalWeight,
        required: false, // Include only if they exist
      },
    ],
  });

  if (animal && animal.age && animal.animalWeights != null) {
    let weightRecords = animal.animalWeights;

    const latestWeightRecord = weightRecords.reduce(
      (latest: AnimalWeight | null, record: AnimalWeight) => {
        if (!latest || record.dateOfMeasure > latest.dateOfMeasure) {
          return record;
        }
        return latest;
      },
      null,
    );

    if (!latestWeightRecord) {
      // throw new Error("Animal has no weight record!");
      return "Data Not Available";
    }
    let physiologicalRef = await PhysiologicalReferenceNorms.findOne({
      where: {
        minAge: {
          [Op.lte]: animal.age, // Assuming you have an age property in AnimalWeight
        },
        maxAge: {
          [Op.gte]: animal.age,
        },
        // You may need to adjust the query based on the animal's gender
        // and other characteristics to get the appropriate reference norms.
      },
    });

    if (!physiologicalRef) {
      // throw new Error(
      //   "Physiological reference data not available for the given age and gender!",
      // );
      return "Data Not Available";
    }

    if (animal.sex === AnimalSex.MALE) {
      if (latestWeightRecord!.weightInKg < physiologicalRef.minWeightMaleKg) {
        return "Underweight";
      } else if (
        latestWeightRecord!.weightInKg > physiologicalRef.maxWeightMaleKg
      ) {
        return "Overweight";
      } else {
        return "Normal";
      }
    } else if (animal.sex === AnimalSex.FEMALE) {
      if (latestWeightRecord!.weightInKg < physiologicalRef.minWeightFemaleKg) {
        return "Underweight";
      } else if (
        latestWeightRecord!.weightInKg > physiologicalRef.maxWeightFemaleKg
      ) {
        return "Overweight";
      } else {
        return "Normal";
      }
    } else {
      return "Data Not Available";
    }
  }

  return "Data Not Available";
  // throw new Error("Animal has no age or weight record!");
}

//-- Animal Activity
export async function getAllAnimalActivities() {
  try {
    const allAnimalActivities = await AnimalActivity.findAll({
      include: [
        {
          model: Animal,
          required: false, // Include only if they exist
          as: "animals",
        },
        {
          model: EnrichmentItem,
          required: false, // Include only if they exist
          as: "enrichmentItems",
        }
      ],
    });

    return allAnimalActivities;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAnimalActivityById(animalActivityId: number) {
  let animalActivityRecord = await AnimalActivity.findOne({
    where: { animalActivityId: animalActivityId },
    include: [
      {
        model: Animal,
        required: false, // Include only if they exist
        as: "animals",
      },
      {
        model: EnrichmentItem,
        required: false, // Include only if they exist
        as: "enrichmentItems",
      }
    ],
  });

  if (animalActivityRecord) {
    return animalActivityRecord;
  }
  throw new Error("Invalid Animal Activity Id!");
}

export async function getAnimalActivityByAnimalCode(animalCode: string) {
  let animalActivities = await Animal.findAll({
    where: { animalCode: animalCode },
    include: {
      model: AnimalActivity,
      required: false, // Include only if they exist
      as: "animalActivities",
    },
  });

  if (animalActivities) {
    return animalActivities;
  }
  throw new Error("Invalid Animal Code!");
}

export async function createAnimalActivity(
  activityType: ActivityType,
  title: string,
  details: string,
  startDate: Date,
  endDate: Date,
  recurringPattern: RecurringPattern,
  dayOfWeek: DayOfWeek | null,
  dayOfMonth: number | null,
  eventTimingType : EventTimingType,
  durationInMinutes: number,
  // enrichmentItemIds:number[],
  // animalCodes:string[],
) {
  let newActivity = {
    activityType: activityType,
    title: title,
    details: details,
    startDate: startDate,
    endDate: endDate,
    recurringPattern: recurringPattern,
    dayOfWeek: dayOfWeek,
    dayOfMonth: dayOfMonth,
    eventTimingType : eventTimingType,
    durationInMinutes: durationInMinutes,
  } as any;

  try {
    let newActivityEntry = await AnimalActivity.create(newActivity);

    if (recurringPattern == RecurringPattern.NON_RECURRING){
      await ZooEventService.createAnimalActivityZooEvent(
        newActivityEntry.animalActivityId,
        startDate,
        durationInMinutes,
        eventTimingType,
        details
      )
    }else{
      startDate = compareDates(startDate, new Date()) >= 0? startDate : 
      new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
      const iKeepMyPromises = []
      if (recurringPattern == RecurringPattern.DAILY){
        while (compareDates(endDate, startDate) >= 0){
          iKeepMyPromises.push(
            ZooEventService.createAnimalActivityZooEvent(
              newActivityEntry.animalActivityId,
              startDate,
              durationInMinutes,
              eventTimingType,
              details
          ));
          startDate = new Date(startDate.getTime() + DAY_IN_MILLISECONDS);
        }
      }else if (recurringPattern == RecurringPattern.WEEKLY){
        let weekInt = 0;
        if (!dayOfWeek) throw {message: "Day Of Week missing!"}
        switch(dayOfWeek){
          case DayOfWeek.MONDAY: weekInt = 1; break;
          case DayOfWeek.TUESDAY: weekInt = 2; break;
          case DayOfWeek.WEDNESDAY: weekInt = 3; break;
          case DayOfWeek.THURSDAY: weekInt = 4; break;
          case DayOfWeek.FRIDAY: weekInt = 5; break;
          case DayOfWeek.SATURDAY: weekInt = 6; break;
        }
        startDate = getNextDayOfWeek(startDate, weekInt);
        while (compareDates(endDate, startDate) >= 0){
          iKeepMyPromises.push(
            ZooEventService.createAnimalActivityZooEvent(
              newActivityEntry.animalActivityId,
              startDate,
              durationInMinutes,
              eventTimingType,
              details
          ));
          startDate = new Date(startDate.getTime() + 7 * DAY_IN_MILLISECONDS);
        }

      } else if (recurringPattern == RecurringPattern.MONTHLY){
        if (!dayOfMonth) throw {message: "Day Of Month missing!"}
        startDate = getNextDayOfMonth(startDate, dayOfMonth);
        while (compareDates(endDate, startDate) >= 0){
          iKeepMyPromises.push(
            ZooEventService.createAnimalActivityZooEvent(
              newActivityEntry.animalActivityId,
              startDate,
              durationInMinutes,
              eventTimingType,
              details
          ));
          startDate = new Date(startDate.setMonth(startDate.getMonth()+1));
        }
      }
      for (const p of iKeepMyPromises){
        await p;
      }
    }
    // const iKeepMyPromises = []

    // for (let enrichmentItemId of enrichmentItemIds) {
    //   iKeepMyPromises.push(EnrichmentItemService.getEnrichmentItemById(enrichmentItemId).then(async enrichmentItem =>await enrichmentItem.addAnimalActivity(newActivityEntry)));
    // }
    // for (let animalCode of animalCodes) {
    //   iKeepMyPromises.push(getAnimalByAnimalCode(animalCode).then(async animal =>await animal.addAnimalActivity(newActivityEntry)));
    // }

    // // see?
    // for (const myPromise of iKeepMyPromises){
    //   await myPromise;
    // }

    return newActivityEntry;
  } catch (error: any) {
    console.log(error);
    throw validationErrorHandler(error);
  }
}

export async function updateAnimalActivity(
  animalActivityId: number,
  activityType: ActivityType,
  title: string, 
  details: string,
  startDate:Date,
  endDate:Date, 
  recurringPattern: RecurringPattern, 
  dayOfWeek: DayOfWeek | null,
  dayOfMonth: number | null,  
  eventTimingType: EventTimingType, 
  durationInMinutes: number, 
) {
  try {
    const animalActivity = await AnimalActivity.findOne({
      where:{animalActivityId: animalActivityId}
    });

    if (!animalActivity) throw {message:"Animal Activity not found with Id: " + animalActivityId}

    animalActivity.activityType = activityType;
    animalActivity.details = details;
    const zooEvents = await animalActivity.getZooEvents();

    if (animalActivity.title != title){
      animalActivity.title = title;
      for (const ze of zooEvents){
        ze.eventName = title;
      }
    }
    if (animalActivity.eventTimingType != eventTimingType){
      animalActivity.eventTimingType = eventTimingType;
      for (const ze of zooEvents){
        ze.eventTiming = eventTimingType;
      }
    }
    if (animalActivity.durationInMinutes != durationInMinutes){
      animalActivity.durationInMinutes = durationInMinutes;
      for (const ze of zooEvents){
        ze.eventDurationHrs = durationInMinutes/60;
      }
    }

    if (animalActivity.dayOfWeek != dayOfWeek 
      || animalActivity.dayOfMonth != dayOfMonth
      || animalActivity.recurringPattern != recurringPattern){
        // Regenerate ALL events
        for (const ze of zooEvents){
          await ze.destroy();
        }
        if (recurringPattern == RecurringPattern.NON_RECURRING){
          await ZooEventService.createAnimalActivityZooEvent(
            animalActivity.animalActivityId,
            startDate,
            durationInMinutes,
            eventTimingType,
            details
          )
        }else{
          startDate = compareDates(startDate, new Date()) >= 0? startDate : new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
          const iKeepMyPromises = []
          if (recurringPattern == RecurringPattern.DAILY){
            while (compareDates(endDate, startDate) >= 0){
              iKeepMyPromises.push(
                ZooEventService.createAnimalActivityZooEvent(
                  animalActivity.animalActivityId,
                  startDate,
                  durationInMinutes,
                  eventTimingType,
                  details
              ));
              startDate = new Date(startDate.getTime() + DAY_IN_MILLISECONDS);
            }
          }else if (recurringPattern == RecurringPattern.WEEKLY){
            let weekInt = 0;
            if (!dayOfWeek) throw {message: "Day Of Week missing!"}
            switch(dayOfWeek){
              case DayOfWeek.MONDAY: weekInt = 1; break;
              case DayOfWeek.TUESDAY: weekInt = 2; break;
              case DayOfWeek.WEDNESDAY: weekInt = 3; break;
              case DayOfWeek.THURSDAY: weekInt = 4; break;
              case DayOfWeek.FRIDAY: weekInt = 5; break;
              case DayOfWeek.SATURDAY: weekInt = 6; break;
            }
            startDate = getNextDayOfWeek(startDate, weekInt);
            while (compareDates(endDate, startDate) >= 0){
              iKeepMyPromises.push(
                ZooEventService.createAnimalActivityZooEvent(
                  animalActivity.animalActivityId,
                  startDate,
                  durationInMinutes,
                  eventTimingType,
                  details
              ));
              startDate = new Date(startDate.getTime() + 7 * DAY_IN_MILLISECONDS);
            }
    
          } else if (recurringPattern == RecurringPattern.MONTHLY){
            if (!dayOfMonth) throw {message: "Day Of Month missing!"}
            startDate = getNextDayOfMonth(startDate, dayOfMonth);
            while (compareDates(endDate, startDate) >= 0){
              iKeepMyPromises.push(
                ZooEventService.createAnimalActivityZooEvent(
                  animalActivity.animalActivityId,
                  startDate,
                  durationInMinutes,
                  eventTimingType,
                  details
              ));
              startDate = new Date(startDate.setMonth(startDate.getMonth()+1));
            }
          }
          for (const p of iKeepMyPromises){
            await p;
          }
        }
    }else if (recurringPattern != RecurringPattern.NON_RECURRING 
      && (animalActivity.startDate != startDate
          || animalActivity.endDate != endDate)){
        // If shortened duration in start or end dates
        if (compareDates(startDate, animalActivity.startDate) > 0
        || compareDates(endDate, animalActivity.endDate) < 0 ){
          for (const ze of zooEvents){
            if (compareDates(startDate, ze.eventStartDateTime) > 0
            || compareDates(endDate, ze.eventStartDateTime) < 0 )
            await ze.destroy();
          }
        }

        if (compareDates(startDate, animalActivity.startDate) < 0){
          const iKeepMyPromises = [];
          let earliestDate = zooEvents.reduce((a, b)=>compareDates(a.eventStartDateTime, b.eventStartDateTime) > 0 ? b : a).eventStartDateTime;
          
          if (recurringPattern == RecurringPattern.DAILY || recurringPattern == RecurringPattern.WEEKLY ){
            let interval = 0;
            switch(recurringPattern){
              case RecurringPattern.DAILY: interval = DAY_IN_MILLISECONDS; break;
              case RecurringPattern.WEEKLY: interval = DAY_IN_MILLISECONDS * 7; break;
            }
            earliestDate = new Date(earliestDate.getTime() - interval);
            while (compareDates(startDate, earliestDate) >= 0){
              iKeepMyPromises.push(
                ZooEventService.createAnimalActivityZooEvent(
                  animalActivity.animalActivityId,
                  earliestDate,
                  durationInMinutes,
                  eventTimingType,
                  details
              ));
              earliestDate = new Date(earliestDate.getTime() - interval);
            }
          } else {
            
            if (!dayOfMonth) throw {message: "Day Of Month missing!"}
            earliestDate = new Date(earliestDate.setMonth(earliestDate.getMonth()-1));
            while (compareDates(startDate, earliestDate) >= 0){
              iKeepMyPromises.push(
                ZooEventService.createAnimalActivityZooEvent(
                  animalActivity.animalActivityId,
                  earliestDate,
                  durationInMinutes,
                  eventTimingType,
                  details
              ));
              earliestDate = new Date(earliestDate.setMonth(earliestDate.getMonth()-1));
            }

          }
          for (const p of iKeepMyPromises) await p; 
        }

        if (compareDates(endDate, animalActivity.endDate) > 0){
          const iKeepMyPromises = [];
          let latestDate = zooEvents.reduce((a, b)=>compareDates(a.eventStartDateTime, b.eventStartDateTime) > 0 ? a : b).eventStartDateTime;
          
          if (recurringPattern == RecurringPattern.DAILY || recurringPattern == RecurringPattern.WEEKLY ){
            let interval = 0;
            switch(recurringPattern){
              case RecurringPattern.DAILY: interval = DAY_IN_MILLISECONDS; break;
              case RecurringPattern.WEEKLY: interval = DAY_IN_MILLISECONDS * 7; break;
            }
            latestDate = new Date(latestDate.getTime() + interval);
            while (compareDates(endDate, latestDate) >= 0){
              iKeepMyPromises.push(
                ZooEventService.createAnimalActivityZooEvent(
                  animalActivity.animalActivityId,
                  latestDate,
                  durationInMinutes,
                  eventTimingType,
                  details
              ));
              latestDate = new Date(latestDate.getTime() - interval);
            }
          } else {

            if (!dayOfMonth) throw {message: "Day Of Month missing!"}
            latestDate = new Date(latestDate.setMonth(latestDate.getMonth()-1));
            while (compareDates(endDate, latestDate) >= 0){
              iKeepMyPromises.push(
                ZooEventService.createAnimalActivityZooEvent(
                  animalActivity.animalActivityId,
                  latestDate,
                  durationInMinutes,
                  eventTimingType,
                  details
              ));
              latestDate = new Date(latestDate.setMonth(latestDate.getMonth()-1));
            }

          }
          for (const p of iKeepMyPromises) await p; 
        }

        animalActivity.startDate = startDate;
        animalActivity.endDate = endDate;
      }
      return await animalActivity.save();

  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deleteAnimalActivity(animalActivityId: string) {
  let result = await AnimalActivity.destroy({
    where: { animalActivityId: animalActivityId },
  });
  if (result) {
    return result;
  }
  throw new Error("Invalid Animal Activity Id!");
}

export async function assignAnimalsToActivity(
  animalActivityId: number,
  animalCodes: string[],
) {
  let animalActivity = await getAnimalActivityById(animalActivityId);

  for (let animalCode of animalCodes) {
    animalActivity.addAnimal(await getAnimalByAnimalCode(animalCode));
  }
}

export async function removeAnimalFromActivity(
  animalActivityId: number,
  animalCode: string,
) {
  let animalActivity = await getAnimalActivityById(animalActivityId);

  animalActivity.removeAnimal(await getAnimalByAnimalCode(animalCode));
}

export async function assignItemToActivity(
  animalActivityId: number,
  enrichmentItemIds: number[],
) {
  let animalActivity = await getAnimalActivityById(animalActivityId);

  for (let enrichmentItemId of enrichmentItemIds) {
    animalActivity.addEnrichmentItem(
      await EnrichmentItemService.getEnrichmentItemById(
        Number(enrichmentItemId),
      ),
    );
  }
}

export async function removeItemFromActivity(
  animalActivityId: number,
  enrichmentItemId: number,
) {
  let animalActivity = await getAnimalActivityById(animalActivityId);

  animalActivity.removeEnrichmentItem(
    await EnrichmentItemService.getEnrichmentItemById(Number(enrichmentItemId)),
  );
}

export async function createAnimalObservationLog(
  employeeId: number,
  animalCodes: string[],
  dateTime: Date,
  durationInMinutes: number,
  observationQuality: Rating,
  details: string,
) {
  const keeper = await (await findEmployeeById(employeeId)).getKeeper();

  if (!keeper)
    throw { message: "No keeper found with employee ID : " + employeeId };

  const animalsPromise: Promise<Animal>[] = [];
  animalCodes.forEach((code) => {
    animalsPromise.push(getAnimalByAnimalCode(code));
  });

  const animals: Animal[] = [];
  for (const prom of animalsPromise) {
    const animal = await prom;
    if (animal === undefined) throw { message: "Animal Code not found!" };
    animals.push(animal);
  }
  try {
    const animalObservationLog = await AnimalObservationLog.create({
      dateTime: dateTime,
      durationInMinutes: durationInMinutes,
      observationQuality: observationQuality,
      details: details,
    });

    animals.forEach((animal) => {
      animal.addAnimalObservationLog(animalObservationLog);
    });

    await keeper.addAnimalObservationLog(animalObservationLog);

    return animalObservationLog;
  } catch (error: any) {
    console.log(error);
    throw validationErrorHandler(error);
  }
}

export async function getAllAnimalObservationLogs() {
  return AnimalObservationLog.findAll();
}

export async function getAnimalObservationLogById(
  animalObservationLogId: number,
) {
  const animalObservationLog = await AnimalObservationLog.findOne({
    where: {
      animalObservationLogId: animalObservationLogId,
    },
    include: [
    {
      association: "animals",
      required:false
    },{
      association: "keeper",
      required:false,
      include: [{
        association: "employee",
        required:false
      }],
    }],
  });
  if (!animalObservationLog)
    throw {
      message:
        "Unable to find AnimalObservationLog with Id " + animalObservationLogId,
    };
  return animalObservationLog;
}

export async function getAnimalObservationLogsByAnimalCode(animalCode: string) {
  return AnimalObservationLog.findAll({
    include: [
      {
        association: "animals",
        where: {
          animalCode: animalCode,
        },
        required: true,
      },
      {
        association: "keeper",
        required: true,
        include: [{
          association: "employee",
          required:false
        }],
      },
    ],
  });
}

export async function getAnimalObservationLogsBySpeciesCode(
  speciesCode: string,
) {
  const species = await SpeciesService.getSpeciesByCode(speciesCode, [
    "animals",
  ]);
  let animals = species.animals || [];
  const logSet = new Set();
  const logs: AnimalObservationLog[] = [];
  for (const animal of animals) {
    for (const log of await animal.getAnimalObservationLogs()) {
      if (!logSet.has(log.animalObservationLogId)) {
        logSet.add(log.animalObservationLogId);
        logs.push(log);
      }
    }
  }

  return logs;
}

export async function updateAnimalObservationLog(
  animalObservationLogId: number,
  animalCodes: string,
  dateTime: Date,
  durationInMinutes: number,
  observationQuality: Rating,
  details: string,
) {
  const animalObservationLog = await getAnimalObservationLogById(
    animalObservationLogId,
  );
  await animalObservationLog.setAnimals([]);
  for (const code of animalCodes) {
    const animal = await getAnimalByAnimalCode(code);
    animalObservationLog.addAnimal(animal);
  }
  animalObservationLog.dateTime = dateTime;
  animalObservationLog.durationInMinutes = durationInMinutes;
  animalObservationLog.observationQuality = observationQuality;
  animalObservationLog.details = details;

  await animalObservationLog.save();
  return animalObservationLog;
}

export async function deleteAnimalObservationLogById(
  animalObservationLogsId: number,
) {
  const animalObservationLog = await getAnimalObservationLogById(
    animalObservationLogsId,
  );
  return await animalObservationLog.destroy();
}
