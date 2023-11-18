import { Op } from "Sequelize";
import { validationErrorHandler } from "../helpers/errorHandler";
import {
  compareDates
} from "../helpers/others";
import {
  DAY_IN_MILLISECONDS
} from "../helpers/staticValues";
import { Animal } from "../models/Animal";
import { AnimalActivity } from "../models/AnimalActivity";
import { AnimalActivityLog } from "../models/AnimalActivityLog";
import { AnimalFeedingLog } from "../models/AnimalFeedingLog";
import { AnimalObservationLog } from "../models/AnimalObservationLog";
import { AnimalWeight } from "../models/AnimalWeight";
import { Enclosure } from "../models/Enclosure";
import { EnrichmentItem } from "../models/EnrichmentItem";
import {
  AcquisitionMethod,
  ActivityType,
  AnimalSex,
  AnimalStatus,
  DayOfWeek,
  EventTimingType,
  IdentifierType,
  Rating,
  Reaction,
  RecurringPattern
} from "../models/Enumerated";
import { Facility } from "../models/Facility";
import { FeedingItem } from "../models/FeedingItem";
import { FeedingPlan } from "../models/FeedingPlan";
import { FeedingPlanSessionDetail } from "../models/FeedingPlanSessionDetail";
import { PhysiologicalReferenceNorms } from "../models/PhysiologicalReferenceNorms";
import { Species } from "../models/Species";
import { SpeciesDietNeed } from "../models/SpeciesDietNeed";
import { ZooEvent } from "../models/ZooEvent";
import { findEmployeeById } from "./employeeService";
import * as EnrichmentItemService from "./enrichmentItemService";
import * as SpeciesService from "./speciesService";
import * as ZooEventService from "./zooEventService";

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
      include: [Species, Enclosure],
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
      {
        model: FeedingPlan,
        as: "feedingPlans",
        required: false, // Include only if they exist
      },
      {
        model: Enclosure,
        as: "enclosure",
        required: false, // Include only if they exist
        include: [{
          model: Facility,
          required: true,
          as: "facility"
        }]
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
  sex: AnimalSex | null,
  dateOfBirth: Date | null,
  placeOfBirth: string | null,
  identifierType: IdentifierType | null,
  identifierValue: string | null,
  acquisitionMethod: AcquisitionMethod,
  dateOfAcquisition: Date | null,
  acquisitionRemarks: string | null,
  physicalDefiningCharacteristics: string,
  behavioralDefiningCharacteristics: string,
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
    return false;
  }

  const parentIds1 = animal1.parents.map((parent: any) => parent.animalId);
  const parentIds2 = animal2.parents.map((parent: any) => parent.animalId);

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
        },
        {
          model: ZooEvent,
          required: false,
          as: "zooEvents",
        },
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
      },
      {
        model: ZooEvent,
        required: false,
        as: "zooEvents",
      },
    ],
  });

  if (animalActivityRecord) {
    return animalActivityRecord;
  }
  throw new Error("Invalid Animal Activity Id!");
}

export async function getAnimalActivityByAnimalCode(animalCode: string) {
  let animalActivities = await Animal.findOne({
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

// !!! QY To Marcus: Added isPublic and start/end time, please update
export async function createAnimalActivity(
  activityType: ActivityType,
  title: string,
  details: string,
  startDate: Date,
  endDate: Date,
  recurringPattern: RecurringPattern,
  dayOfWeek: DayOfWeek | null,
  dayOfMonth: number | null,
  eventTimingType: EventTimingType,
  durationInMinutes: number,
  requiredNumberOfKeeper: number,
): Promise<AnimalActivity> {
  let newActivity = {
    activityType: activityType,
    title: title,
    details: details,
    startDate: startDate,
    endDate: endDate,
    recurringPattern: recurringPattern,
    dayOfWeek: dayOfWeek,
    dayOfMonth: dayOfMonth,
    eventTimingType: eventTimingType,
    durationInMinutes: durationInMinutes,
    requiredNumberOfKeeper: requiredNumberOfKeeper,
  };
  try {
    let newActivityEntry = await AnimalActivity.create(newActivity);

    if (recurringPattern == RecurringPattern.NON_RECURRING) {
      await ZooEventService.createAnimalActivityZooEvent(
        newActivityEntry.animalActivityId,
        startDate,
        durationInMinutes,
        eventTimingType,
        details,
        requiredNumberOfKeeper,
      );
    } else {
      return ZooEventService.generateMonthlyZooEventForAnimalActivity(
        newActivityEntry.animalActivityId,
      );
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
  startDate: Date,
  endDate: Date,
  recurringPattern: RecurringPattern,
  dayOfWeek: DayOfWeek | null,
  dayOfMonth: number | null,
  eventTimingType: EventTimingType,
  durationInMinutes: number,
  requiredNumberOfKeeper: number,
) {
  try {
    let animalActivity = await AnimalActivity.findOne({
      where: { animalActivityId: animalActivityId },
    });

    if (!animalActivity) {
      throw {
        message: "Animal Activity not found with Id: " + animalActivityId,
      };
    }

    animalActivity.activityType = activityType;
    animalActivity.details = details;
    animalActivity.requiredNumberOfKeeper = requiredNumberOfKeeper;
    let zooEvents = await animalActivity.getZooEvents();

    if (animalActivity.title != title) {
      animalActivity.title = title;
      for (const ze of zooEvents) {
        ze.eventName = title;
      }
    }
    if (animalActivity.eventTimingType != eventTimingType) {
      animalActivity.eventTimingType = eventTimingType;
      for (const ze of zooEvents) {
        ze.eventTiming = eventTimingType;
      }
    }
    if (animalActivity.durationInMinutes != durationInMinutes) {
      animalActivity.durationInMinutes = durationInMinutes;
      for (const ze of zooEvents) {
        ze.eventDurationHrs = durationInMinutes / 60;
      }
    }
    await animalActivity.save();

    if (
      zooEvents.length == 0 ||
      animalActivity.dayOfWeek != dayOfWeek ||
      animalActivity.dayOfMonth != dayOfMonth ||
      animalActivity.recurringPattern != recurringPattern
    ) {
      animalActivity.startDate = startDate;
      animalActivity.endDate = endDate;
      animalActivity.recurringPattern = recurringPattern;
      animalActivity.dayOfMonth = dayOfMonth;
      animalActivity.dayOfWeek = dayOfWeek;
      await animalActivity.save();

      console.log("regenerate all events");
      // Regenerate ALL events
      for (const ze of zooEvents) {
        await ze.destroy();
      }
      if (recurringPattern == RecurringPattern.NON_RECURRING) {
        await ZooEventService.createAnimalActivityZooEvent(
          animalActivity.animalActivityId,
          startDate,
          durationInMinutes,
          eventTimingType,
          details,
          requiredNumberOfKeeper,
        );
      } else {
        return ZooEventService.generateMonthlyZooEventForAnimalActivity(
          animalActivity.animalActivityId,
        );
      }
    } else if (
      recurringPattern != RecurringPattern.NON_RECURRING &&
      (animalActivity.startDate != startDate ||
        animalActivity.endDate != endDate)
    ) {
      zooEvents = await animalActivity.getZooEvents();

      // If shortened duration in start or end dates
      if (
        compareDates(startDate, animalActivity.startDate) > 0 ||
        compareDates(endDate, animalActivity.endDate) < 0
      ) {
        for (const ze of zooEvents) {
          // console.log("ze",ze.eventStartDateTime.toDateString(),
          // " not before today ",compareDates(new Date(), ze.eventStartDateTime) < 0,
          // " after end date ",compareDates(endDate, ze.eventStartDateTime) < 0 ,
          // " before start date ", compareDates(startDate, ze.eventStartDateTime) > 0 );
          if (
            (compareDates(startDate, ze.eventStartDateTime) > 0 ||
              compareDates(endDate, ze.eventStartDateTime) < 0) &&
            compareDates(new Date(), ze.eventStartDateTime) < 0
          ) {
            await ze.destroy();
          }
        }
      }
      zooEvents = await animalActivity.getZooEvents();

      // If nothing left regenerate all zoo events
      if (zooEvents.length == 0) {
        animalActivity.startDate = startDate;
        animalActivity.endDate = endDate;
        animalActivity.recurringPattern = recurringPattern;
        animalActivity.dayOfMonth = dayOfMonth;
        animalActivity.dayOfWeek = dayOfWeek;
        await animalActivity.save();
        return await ZooEventService.generateMonthlyZooEventForAnimalActivity(
          animalActivity.animalActivityId,
        );
      }

      // Add earlier events
      if (compareDates(startDate, animalActivity.startDate) < 0) {
        console.log("Adding earlier events");
        const iKeepMyPromises = [];
        let earliestDate = zooEvents.reduce((a, b) =>
          compareDates(a.eventStartDateTime, b.eventStartDateTime) > 0 ? b : a,
        ).eventStartDateTime;

        if (
          recurringPattern == RecurringPattern.DAILY ||
          recurringPattern == RecurringPattern.WEEKLY
        ) {
          let interval = 0;
          switch (recurringPattern) {
            case RecurringPattern.DAILY:
              interval = DAY_IN_MILLISECONDS;
              break;
            case RecurringPattern.WEEKLY:
              interval = DAY_IN_MILLISECONDS * 7;
              break;
          }
          earliestDate = new Date(earliestDate.getTime() - interval);
          while (compareDates(startDate, earliestDate) < 0) {
            if (compareDates(earliestDate, new Date()) < 0) break;
            iKeepMyPromises.push(
              ZooEventService.createAnimalActivityZooEvent(
                animalActivity.animalActivityId,
                earliestDate,
                durationInMinutes,
                eventTimingType,
                details,
                requiredNumberOfKeeper,
              ),
            );
            earliestDate = new Date(earliestDate.getTime() - interval);
          }
        } else {
          if (!dayOfMonth) throw { message: "Day Of Month missing!" };
          earliestDate = new Date(
            Date.UTC(
              earliestDate.getFullYear(),
              earliestDate.getMonth() - 1,
              dayOfMonth,
            ),
          );
          while (compareDates(startDate, earliestDate) >= 0) {
            iKeepMyPromises.push(
              ZooEventService.createAnimalActivityZooEvent(
                animalActivity.animalActivityId,
                earliestDate,
                durationInMinutes,
                eventTimingType,
                details,
                requiredNumberOfKeeper,
              ),
            );
            earliestDate = new Date(
              Date.UTC(
                earliestDate.getFullYear(),
                earliestDate.getMonth() - 1,
                dayOfMonth,
              ),
            );
          }
        }
        for (const p of iKeepMyPromises) await p;
      }

      // Add later events
      if (compareDates(endDate, animalActivity.endDate) > 0) {
        console.log("Adding later events");
        animalActivity.recurringPattern = recurringPattern;
        animalActivity.startDate = startDate;
        animalActivity.endDate = endDate;
        await animalActivity.save();
        await ZooEventService.generateMonthlyZooEventForAnimalActivity(
          animalActivity.animalActivityId,
        );
      }

      animalActivity.recurringPattern = recurringPattern;
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
  try {
    let animalActivity = await getAnimalActivityById(animalActivityId);

    const animals = [];
    const promises = [];

    for (let animalCode of animalCodes) {
      animals.push(await getAnimalByAnimalCode(animalCode));
    }
    promises.push(animalActivity.setAnimals(animals));

    for (const ze of await animalActivity.getZooEvents()) {
      if (compareDates(ze.eventStartDateTime, new Date()) >= 0) {
        promises.push(ze.setAnimals(animals));
        promises.push(ze.setEnclosure(await animals[0].getEnclosure()));
      }
    }
    for (const p of promises) await p;
    return;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function removeAnimalFromActivity(
  animalActivityId: number,
  animalCode: string,
) {
  try {
    let animalActivity = await getAnimalActivityById(animalActivityId);
    const animal = await getAnimalByAnimalCode(animalCode);
    await animalActivity.removeAnimal(animal);

    for (const ze of await animalActivity.getZooEvents()) {
      if (compareDates(ze.eventStartDateTime, new Date()) >= 0) {
        await ze.removeAnimal(animal);
      }
    }
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
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
  animalActivityId: number,
  dateTime: Date,
  durationInMinutes: number,
  observationQuality: Rating,
  details: string,
) {
  const keeper = await (await findEmployeeById(employeeId)).getKeeper();

  if (!keeper)
    throw { message: "No keeper found with employee ID : " + employeeId };

  const animalObservationAvtivity =
    await getAnimalActivityById(animalActivityId);

  if (animalObservationAvtivity.activityType != ActivityType.OBSERVATION)
    throw { message: "Not a observation log!" };

  try {
    const animalObservationLog = await AnimalObservationLog.create({
      dateTime: dateTime,
      durationInMinutes: durationInMinutes,
      observationQuality: observationQuality,
      details: details,
    });

    await animalObservationLog.setAnimals(
      await animalObservationAvtivity.getAnimals(),
    );
    await animalObservationLog.setAnimalActivity(animalObservationAvtivity);
    await keeper.addAnimalObservationLog(animalObservationLog);

    return animalObservationLog;
  } catch (error: any) {
    console.log(error);
    throw validationErrorHandler(error);
  }
}

export async function getAnimalObservationLogsByAnimalActivityId(
  animalActivityId: number,
) {
  try {
    return AnimalObservationLog.findAll({
      order: [["dateTime", "DESC"]],
      include: [
        {
          association: "keeper",
          required: false,
          include: [
            {
              association: "employee",
              required: false,
            },
          ],
        },
        {
          association: "animals",
          required: false,
          include: [
            {
              association: "animalActivities",
              required: false,
              where: {
                animalActivityId: animalActivityId,
              },
            },
          ],
        },
        {
          association: "animalActivity",
          required: true,
          where: {
            animalActivityId: animalActivityId,
          },
        },
      ],
    });
  } catch (error: any) {
    console.log(error);
    throw validationErrorHandler(error);
  }
}

export async function getAllAnimalObservationLogs() {
  return AnimalObservationLog.findAll({
    order: [["dateTime", "DESC"]],
  });
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
        required: false,
        include: [
          {
            association: "species",
            required: false,
          },
        ],
      },
      {
        association: "keeper",
        required: false,
        include: [
          {
            association: "employee",
            required: false,
          },
        ],
      },
    ],
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
    order: [["dateTime", "DESC"]],
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
        include: [
          {
            association: "employee",
            required: false,
          },
        ],
      },
    ],
  });
}

export async function getAnimalObservationLogsBySpeciesCode(
  speciesCode: string,
) {
  const species = await SpeciesService.getSpeciesByCode(speciesCode, []);
  let animals = await species.getAnimals();
  const logSet = new Set();
  const logs: AnimalObservationLog[] = [];
  for (const animal of animals) {
    for (const log of await animal.getAnimalObservationLogs({
      order: [["dateTime", "DESC"]],
    })) {
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
  dateTime: Date,
  durationInMinutes: number,
  observationQuality: Rating,
  details: string,
) {
  const animalObservationLog = await getAnimalObservationLogById(
    animalObservationLogId,
  );

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

export async function createAnimalActivityLog(
  employeeId: number,
  animalActivityId: number,
  activityType: ActivityType,
  dateTime: Date,
  durationInMinutes: number,
  sessionRating: Rating,
  animalReaction: Reaction,
  details: string,
) {
  const keeper = await (await findEmployeeById(employeeId)).getKeeper();
  const animalActivity = await getAnimalActivityById(animalActivityId);

  if (!keeper)
    throw { message: "No keeper found with employee ID : " + employeeId };

  try {
    const newAnimalActivityLog = await AnimalActivityLog.create({
      activityType: activityType,
      dateTime: dateTime,
      durationInMinutes: durationInMinutes,
      sessionRating: sessionRating,
      animalReaction: animalReaction,
      details: details,
    });

    await newAnimalActivityLog.setAnimals(await animalActivity.getAnimals());
    await keeper.addAnimalActivityLog(newAnimalActivityLog);
    await animalActivity.addAnimalActivityLog(newAnimalActivityLog);

    return newAnimalActivityLog;
  } catch (error: any) {
    console.log(error);
    throw validationErrorHandler(error);
  }
}

// export async function getAllAnimalObservationLogs() {
//   return AnimalObservationLog.findAll();
// }

export async function getAnimalActivityLogById(animalActivityLogId: number) {
  const animalActivityLog = await AnimalActivityLog.findOne({
    where: {
      animalActivityLogId: animalActivityLogId,
    },
    include: [
      {
        association: "animals",
        required: false,
        include: [
          {
            association: "species",
            required: false,
          },
        ],
      },
      {
        association: "keeper",
        required: false,
        include: [
          {
            association: "employee",
            required: false,
          },
        ],
      },
    ],
  });
  if (!animalActivityLog)
    throw {
      message: "Unable to find animalActivityLog with Id " + animalActivityLog,
    };
  return animalActivityLog;
}

export async function getAnimalActivityLogsByAnimalActivityId(
  animalActivityId: number,
) {
  try {
    return await AnimalActivityLog.findAll({
      include: [
        {
          association: "animals",
          required: false,
        },
        {
          association: "animalActivity",
          required: true,
          where: {
            animalActivityId: animalActivityId,
          },
        },
        {
          association: "keeper",
          required: false,
          include: [
            {
              association: "employee",
              required: false,
            },
          ],
        },
      ],
    });
  } catch (error: any) {
    console.log(error);
    throw validationErrorHandler(error);
  }
}

export async function getAnimalActivityLogsByAnimalCode(animalCode: string) {
  return AnimalActivityLog.findAll({
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
        include: [
          {
            association: "employee",
            required: false,
          },
        ],
      },
    ],
  });
}

export async function getAnimalActivityLogsBySpeciesCode(speciesCode: string) {
  const species = await SpeciesService.getSpeciesByCode(speciesCode, []);
  let animals = await species.getAnimals();
  const logSet = new Set();
  const logs: AnimalActivityLog[] = [];
  for (const animal of animals) {
    for (const log of await animal.getAnimalActivityLogs()) {
      if (!logSet.has(log.animalActivityLogId)) {
        logSet.add(log.animalActivityLogId);
        logs.push(log);
      }
    }
  }

  return logs;
}

export async function updateAnimalActivityLog(
  animalActivityLogId: number,
  activityType: ActivityType,
  dateTime: Date,
  durationInMinutes: number,
  sessionRating: Rating,
  animalReaction: Reaction,
  details: string,
  // animalCodes: string[],
) {
  const animalActivityLog = await getAnimalActivityLogById(animalActivityLogId);

  // await animalActivityLog.setAnimals([]);
  // for (const code of animalCodes) {
  //   const animal = await getAnimalByAnimalCode(code);
  //   animalActivityLog.addAnimal(animal);
  // }

  animalActivityLog.activityType = activityType;
  animalActivityLog.dateTime = dateTime;
  animalActivityLog.durationInMinutes = durationInMinutes;
  animalActivityLog.sessionRating = sessionRating;
  animalActivityLog.animalReaction = animalReaction;
  animalActivityLog.details = details;

  await animalActivityLog.save();
  return animalActivityLog;
}

export async function deleteAnimalActivityLogById(animalActivityLogId: number) {
  const animalActivityLog = await getAnimalActivityLogById(animalActivityLogId);
  return await animalActivityLog.destroy();
}

export async function createAnimalFeedingLog(
  employeeId: number,
  dateTime: Date,
  durationInMinutes: number,
  amountOffered: string,
  amountConsumed: string,
  amountLeftovers: string,
  presentationMethod: string,
  extraRemarks: string,
  feedingPlanId: number,
) {
  const keeper = await (await findEmployeeById(employeeId)).getKeeper();

  if (!keeper)
    throw { message: "No keeper found with employee ID : " + employeeId };

  const feedingPlan = await getFeedingPlanById(feedingPlanId);

  try {
    const newAnimalFeedingLog = await AnimalFeedingLog.create({
      dateTime: dateTime,
      durationInMinutes: durationInMinutes,
      amountOffered: amountOffered,
      amountConsumed: amountConsumed,
      amountLeftovers: amountLeftovers,
      presentationMethod: presentationMethod,
      extraRemarks: extraRemarks,
    });

    await newAnimalFeedingLog.setAnimals(await feedingPlan.getAnimals());
    await newAnimalFeedingLog.setFeedingPlan(feedingPlan);
    await keeper.addAnimalFeedingLog(newAnimalFeedingLog);

    return newAnimalFeedingLog;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

// export async function getAllAnimalObservationLogs() {
//   return AnimalObservationLog.findAll();
// }

export async function getAnimalFeedingLogById(animalFeedingLogId: number) {
  const animalFeedingLog = await AnimalFeedingLog.findOne({
    where: {
      animalFeedingLogId: animalFeedingLogId,
    },
    include: [
      {
        association: "animals",
        required: false,
        include: [
          {
            association: "species",
            required: false,
          },
        ],
      },
      {
        association: "keeper",
        required: false,
        include: [
          {
            association: "employee",
            required: false,
          },
        ],
      },
    ],
  });
  if (!animalFeedingLog)
    throw {
      message: "Unable to find animalFeedingLog with Id " + animalFeedingLog,
    };
  return animalFeedingLog;
}

export async function getAnimalFeedingLogByFeedingPlanId(
  feedingPlanId: number,
) {
  try {
    return AnimalFeedingLog.findAll({
      include: [
        {
          association: "animals",
          required: false,
        },
        {
          association: "keeper",
          required: false,
          include: [
            {
              association: "employee",
              required: false,
            },
          ],
        },
        {
          association: "feedingPlan",
          required: true,
          where: {
            feedingPlanId: feedingPlanId,
          },
        },
      ],
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAnimalFeedingLogsByAnimalCode(animalCode: string) {
  return AnimalFeedingLog.findAll({
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
        include: [
          {
            association: "employee",
            required: false,
          },
        ],
      },
    ],
  });
}

export async function getAnimalFeedingLogsBySpeciesCode(speciesCode: string) {
  const species = await SpeciesService.getSpeciesByCode(speciesCode, []);
  let animals = await species.getAnimals();
  const logSet = new Set();
  const logs: AnimalFeedingLog[] = [];
  for (const animal of animals) {
    for (const log of await animal.getAnimalFeedingLogs()) {
      if (!logSet.has(log.animalFeedingLogId)) {
        logSet.add(log.animalFeedingLogId);
        logs.push(log);
      }
    }
  }

  return logs;
}

export async function updateAnimalFeedingLog(
  animalFeedingLogId: number,
  dateTime: Date,
  durationInMinutes: number,
  amountOffered: string,
  amountConsumed: string,
  amountLeftovers: string,
  presentationMethod: string,
  extraRemarks: string,
) {
  const animalFeedingLog = await getAnimalFeedingLogById(animalFeedingLogId);

  animalFeedingLog.dateTime = dateTime;
  animalFeedingLog.durationInMinutes = durationInMinutes;
  animalFeedingLog.amountOffered = amountOffered;
  animalFeedingLog.amountConsumed = amountConsumed;
  animalFeedingLog.amountLeftovers = amountLeftovers;
  animalFeedingLog.presentationMethod = presentationMethod;
  animalFeedingLog.extraRemarks = extraRemarks;

  await animalFeedingLog.save();
  return animalFeedingLog;
}

export async function deleteAnimalFeedingLogById(animalFeedingLogId: number) {
  const animalFeedingLog = await getAnimalFeedingLogById(animalFeedingLogId);
  return animalFeedingLog.destroy();
}

//-- Animal Feeding Plan
// export async function getFeedingPlanByFeedingPlanId(feedingPlanId: number) {
//   let feedingPlanRecord = await FeedingPlan.findOne({
//     where: { feedingPlanId: feedingPlanId },
//     include: [
//       {
//         model: FeedingPlanSessionDetail,
//         required: false, // Include only if they exist
//         as: "feedingPlanSessionDetails",
//       },
//     ],
//   });

//   if (feedingPlanRecord) {
//     return feedingPlanRecord;
//   }
//   throw new Error("Invalid Feeding Plan Id!");
// }

export async function getAllFeedingPlans() {
  try {
    const allFeedingPlans = await FeedingPlan.findAll({
      // include: [Species, Animal],
      include: [
        {
          model: Species,
          required: true,
        },
        {
          model: Animal,
          required: false,
          as: "animals",
        },
      ],
    });
    return allFeedingPlans;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getFeedingPlansBySpeciesCode(speciesCode: string) {
  let result: FeedingPlan[] = [];
  let allFeedingPlans = await getAllFeedingPlans();
  if (allFeedingPlans) {
    for (let p of allFeedingPlans) {
      if (p.species?.speciesCode === speciesCode) {
        result.push(p);
      }
    }
  }
  if (result) {
    return result;
  }

  throw new Error("Invalid Species Code!");
}

export async function getFeedingPlansByAnimalCode(animalCode: string) {
  try {
    const animal = await getAnimalByAnimalCode(animalCode);

    if (animal) {
      return animal.feedingPlans;
    }
  } catch (error: any) {
    throw new Error("Invalid Animal Code!");
  }
}

export async function getFeedingPlanById(feedingPlanId: number) {
  try {
    let planRecord = await FeedingPlan.findOne({
      where: { feedingPlanId: feedingPlanId },
      include: [
        {
          model: FeedingPlanSessionDetail,
          required: false, // Include only if they exist
          as: "feedingPlanSessionDetails",
          include: [
            {
              model: FeedingItem,
              as: "feedingItems",
              required: false,
              include: [
                {
                  model: Animal,
                  as: "animal",
                  required: false,
                  include: [Species],
                },
              ],
            },
          ],
        },
        {
          model: Species,
          required: false, // Include only if they exist
          as: "species",
        },
        {
          model: Animal,
          required: false, // Include only if they exist
          as: "animals",
          include: [Species],
        },
      ],
    });
    if (!planRecord) {
      throw new Error("Unable to find feeding plan with id: " + feedingPlanId);
    }
    return planRecord;
  } catch (error: any) {
    throw new Error("Error when getting feeding plan by Id!");
  }
}
interface TempFeedingItem {
  foodCategory: string;
  amount: number;
  unit: string;
  animalCode: string;
}
interface TempFeedingPlanSessionDetail {
  dayOfTheWeek: DayOfWeek;
  eventTimingType: EventTimingType;
  durationInMinutes: number;
  isPublic: boolean;
  publicEventStartTime: string | null;
  feedingItems: TempFeedingItem[];
  requiredNumberOfKeeper: number;
}

export async function createFeedingPlan(
  speciesCode: string,
  animalCodes: string[],
  feedingPlanDesc: string,
  startDate: Date,
  endDate: Date,
  sessions: TempFeedingPlanSessionDetail[],
) {
  try {
    let animals: Animal[] = [];

    for (let i = 0; i < animalCodes.length; i++) {
      animals.push(await getAnimalByAnimalCode(animalCodes[i]));
    }

    let newPlan = {
      feedingPlanDesc: feedingPlanDesc,
      startDate: startDate,
      endDate: endDate,
      title: "Feeding plan for " + (await animals[0].getSpecies()).commonName,
    };

    let newPlanEntry = await FeedingPlan.create(newPlan);
    newPlanEntry.setSpecies(
      await SpeciesService.getSpeciesByCode(speciesCode, []),
    );
    newPlanEntry.setAnimals(animals);

    for (const i of sessions) {
      await createFeedingPlanSessionDetail(
        newPlanEntry.feedingPlanId,
        i.dayOfTheWeek,
        i.eventTimingType,
        i.durationInMinutes,
        i.isPublic,
        i.publicEventStartTime,
        i.feedingItems,
        i.requiredNumberOfKeeper,
      );
    }

    return newPlanEntry;
  } catch (error: any) {
    console.log(error);
    throw validationErrorHandler(error);
  }
}

export async function updateFeedingPlan(
  feedingPlanId: number,
  animalCodes: string[],
  feedingPlanDesc: string,
  startDate: Date,
  endDate: Date,
  title: string,
) {
  try {
    let planEntry = await getFeedingPlanById(feedingPlanId);
    const dateChange =
      compareDates(planEntry.startDate, startDate) != 0 ||
      compareDates(planEntry.endDate, endDate) != 0;

    planEntry.feedingPlanDesc = feedingPlanDesc;
    planEntry.startDate = startDate;
    planEntry.endDate = endDate;
    planEntry.title = title;

    await planEntry.save();

    let animals: Animal[] = [];
    for (let i = 0; i < animalCodes.length; i++) {
      animals.push(await getAnimalByAnimalCode(animalCodes[i]));
    }
    planEntry.setAnimals(animals);

    const promises = [];
    if (dateChange) {
      for (const feedingPlanSession of await planEntry.getFeedingPlanSessionDetails()) {
        promises.push(
          updateFeedingPlanSessionDetail(
            feedingPlanSession.feedingPlanSessionDetailId,
            feedingPlanSession.dayOfWeek,
            feedingPlanSession.eventTimingType,
            feedingPlanSession.durationInMinutes,
            null,
            feedingPlanSession.isPublic,
            feedingPlanSession.publicEventStartTime,
            feedingPlanSession.requiredNumberOfKeeper,
          ),
        );
      }
      for (const p of promises) await p;
    } else {
      for (const feedingPlanSession of await planEntry.getFeedingPlanSessionDetails()) {
        for (const ze of await feedingPlanSession.getZooEvents()) {
          if (compareDates(ze.eventStartDateTime, new Date()) >= 0) {
            ze.eventDescription = planEntry.feedingPlanDesc;
            promises.push(ze.save());
          }
        }
      }
    }

    return planEntry;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deleteFeedingPlanById(feedingPlanId: number) {
  let result = await FeedingPlan.destroy({
    where: { feedingPlanId: feedingPlanId },
  });
  if (result) {
    return result;
  }
  throw new Error("Invalid Feeding Plan Id!");
}

//-- Animal Feeding Plan Session Detail
export async function getAllFeedingPlanSessionDetails() {
  try {
    const allFeedingPlanSessionDetails = await FeedingPlanSessionDetail.findAll(
      {
        // include: [Species, Animal],
        include: [
          {
            model: FeedingPlan,
            required: true,
          },
          {
            model: FeedingItem,
            required: false,
          },
        ],
      },
    );
    return allFeedingPlanSessionDetails;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllFeedingPlanSessionDetailsByPlanId(
  feedingPlanId: number,
) {
  let result: FeedingPlanSessionDetail[] = [];
  let allFeedingPlanSessions = await getAllFeedingPlanSessionDetails();
  if (allFeedingPlanSessions) {
    for (let p of allFeedingPlanSessions) {
      if (p.feedingPlan?.feedingPlanId === feedingPlanId) {
        result.push(p);
      }
    }
  }
  if (result) {
    return result;
  }

  throw new Error("Invalid Feeding Plan ID Code!");
}

export async function getFeedingPlanSessionDetailById(
  feedingPlanSessionDetailId: number,
) {
  try {
    let planRecord = await FeedingPlanSessionDetail.findOne({
      where: { feedingPlanSessionDetailId: feedingPlanSessionDetailId },
      include: [
        {
          model: FeedingPlan,
          required: true,
        },
        {
          model: FeedingItem,
          required: false,
        },
      ],
    });
    if (!planRecord) {
      throw new Error(
        "Invalid Feeding Plan Detail ID Code: " + feedingPlanSessionDetailId,
      );
    }
    return planRecord;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}
// neeed to add EVent generator after Marcus done
export async function createFeedingPlanSessionDetail(
  feedingPlanId: number,
  dayOfWeek: DayOfWeek,
  eventTimingType: EventTimingType,
  durationInMinutes: number,
  isPublic: boolean,
  publicEventStartTime: string | null,
  items: TempFeedingItem[],
  requiredNumberOfKeeper: number,
) {
  let newSession = {
    dayOfWeek: dayOfWeek,
    eventTimingType: eventTimingType,
    durationInMinutes: durationInMinutes,
    isPublic: isPublic,
    publicEventStartTime: publicEventStartTime,
    requiredNumberOfKeeper: requiredNumberOfKeeper,
  };

  try {
    const feedingplan = await getFeedingPlanById(feedingPlanId);

    let newSessionEntry = await FeedingPlanSessionDetail.create(newSession);

    await newSessionEntry.setFeedingPlan(feedingplan);

    for (const i of items) {
      await createFeedingItem(
        newSessionEntry.feedingPlanSessionDetailId,
        i.animalCode,
        i.foodCategory,
        i.amount,
        i.unit,
      );
    }

    return await ZooEventService.generateMonthlyZooEventForFeedingPlanSession(
      newSessionEntry.feedingPlanSessionDetailId,
    );
  } catch (error: any) {
    console.log(error);
    throw validationErrorHandler(error);
  }
}
// neeed to add EVent generator after Marcus done
export async function updateFeedingPlanSessionDetail(
  feedingPlanSessionDetailId: number,
  dayOfWeek: DayOfWeek,
  eventTimingType: EventTimingType,
  durationInMinutes: number,
  items: TempFeedingItem[] | null,
  isPublic: boolean,
  publicEventStartTime: string | null,
  requiredNumberOfKeeper: number,
) {
  const feedingPlanSessionDetail = await getFeedingPlanSessionDetailById(
    feedingPlanSessionDetailId,
  );

  try {
    feedingPlanSessionDetail.dayOfWeek = dayOfWeek;
    feedingPlanSessionDetail.eventTimingType = eventTimingType;
    feedingPlanSessionDetail.durationInMinutes = durationInMinutes;
    feedingPlanSessionDetail.isPublic = isPublic;
    feedingPlanSessionDetail.publicEventStartTime = publicEventStartTime;
    feedingPlanSessionDetail.requiredNumberOfKeeper = requiredNumberOfKeeper;

    const promises = [];
    for (const ze of await feedingPlanSessionDetail.getZooEvents()) {
      if (compareDates(new Date(), ze.eventStartDateTime) <= 0) {
        promises.push(ze.destroy());
      }
    }
    for (const p of promises) await p;
    await feedingPlanSessionDetail.save();

    if (items) {
      let currentItems = await getAllFeedingItemsByPlanSessionId(
        feedingPlanSessionDetailId,
      );
      currentItems.forEach((item) => {
        deleteFeedingItemById(item.feedingItemId);
      });

      for (const i of items) {
        await createFeedingItem(
          feedingPlanSessionDetailId,
          i.animalCode,
          i.foodCategory,
          i.amount,
          i.unit,
        );
      }
    }

    return ZooEventService.generateMonthlyZooEventForFeedingPlanSession(
      feedingPlanSessionDetail.feedingPlanSessionDetailId,
    );
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deleteFeedingPlanSessionDetailById(
  feedingPlanSessionDetailId: number,
) {
  try {
    const promises: Promise<any>[] = [];
    let feedingPlanSessionDetail = await getFeedingPlanSessionDetailById(
      feedingPlanSessionDetailId,
    );
    (await feedingPlanSessionDetail.getZooEvents()).forEach((ze) => {
      if (compareDates(ze.eventStartDateTime, new Date()) > 0) {
        promises.push(ze.destroy());
      }
    });
    for (const p of promises) await p;
    const feedingPlan = await feedingPlanSessionDetail.getFeedingPlan();
    await feedingPlan.removeFeedingPlanSessionDetail(feedingPlanSessionDetail);
    await feedingPlanSessionDetail.setFeedingPlan(undefined);
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

//-- Animal Feeding Plan Food Item
export async function getAllFeedingItemsByPlanSessionId(
  feedingPlanSessionDetailId: number,
) {
  try {
    let result: FeedingItem[] = [];
    const feedingItems = await FeedingItem.findAll({
      include: [
        {
          model: FeedingPlanSessionDetail,
          required: true,
        },
        {
          model: Animal,
          required: true,
        },
      ],
    });
    if (feedingItems) {
      for (let i of feedingItems) {
        if (
          i.feedingPlanSessionDetail?.feedingPlanSessionDetailId ===
          feedingPlanSessionDetailId
        ) {
          result.push(i);
        }
      }
    }
    return result;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function createFeedingItem(
  feedingPlanSessionDetailId: number,
  animalCode: string,
  foodCategory: string,
  amount: number,
  unit: string,
) {
  let newItem = {
    foodCategory: foodCategory,
    amount: amount,
    unit: unit,
  };

  try {
    let newFeedingItemEntry = await FeedingItem.create(newItem);
    newFeedingItemEntry.setFeedingPlanSessionDetail(
      await getFeedingPlanSessionDetailById(feedingPlanSessionDetailId),
    );
    newFeedingItemEntry.setAnimal(await getAnimalByAnimalCode(animalCode));

    return newFeedingItemEntry;
  } catch (error: any) {
    console.log(error);
    throw validationErrorHandler(error);
  }
}

export async function updateFeedingItem(
  feedingItemId: number,
  foodCategory: string,
  amount: number,
  unit: string,
) {
  let updatedItem = {
    foodCategory: foodCategory,
    amount: amount,
    unit: unit,
  } as any;

  try {
    await FeedingItem.update(updatedItem, {
      where: { feedingItemId: feedingItemId },
    });
    return updatedItem;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deleteFeedingItemById(feedingItemId: number) {
  let result = await FeedingItem.destroy({
    where: { feedingItemId: feedingItemId },
  });
  if (result) {
    return result;
  }
  throw new Error("Invalid Feeding Item Id!");
}

// written by Jason
export async function getFeedingItemAmtRecoAllAnimalsOfSpecies(
  speciesCode: string,
  animalFeedCategory: string,
  // weekOrMeal: string,
) {
  interface RecoAmount {
    animalCode: string;
    weekOrMeal: string;
    animalFeedCategory: string;
    recoAmt: number | string | null;
  }

  // get all animals of current species
  let animals: Animal[] = await getAllAnimalsBySpeciesCode(speciesCode);

  let recoAmtsArray: RecoAmount[] = [];
  for (var animal of animals) {
    const curRecoAmountWeek = await getFeedingItemAmtReco(
      animal.animalCode,
      animalFeedCategory,
      "week",
    );
    let newRecoAmountWeek = {
      animalCode: animal.animalCode,
      weekOrMeal: "week",
      animalFeedCategory: animalFeedCategory,
      recoAmt: curRecoAmountWeek,
    };
    recoAmtsArray.push(newRecoAmountWeek);
    const curRecoAmountMeal = await getFeedingItemAmtReco(
      animal.animalCode,
      animalFeedCategory,
      "meal",
    );
    let newRecoAmountMeal = {
      animalCode: animal.animalCode,
      weekOrMeal: "meal",
      animalFeedCategory: animalFeedCategory,
      recoAmt: curRecoAmountMeal,
    };
    recoAmtsArray.push(newRecoAmountMeal);
  }
  if (recoAmtsArray.length > 0) {
    return recoAmtsArray;
  } else {
    throw new Error(
      "Unexpected error while getting recommended feeding amount!",
    );
  }
}

export async function getFeedingItemAmtReco(
  animalCode: string,
  animalFeedCategory: string,
  weekOrMeal: string,
) {
  let animal = await Animal.findOne({
    where: { animalCode: animalCode },
    include: [
      {
        model: Species,
        include: [
          { model: PhysiologicalReferenceNorms, required: false },
          { model: SpeciesDietNeed, required: false },
        ],
      },
      {
        model: AnimalWeight,
        required: false, // Include the Animal Weights only if they exist
      },
    ],
    attributes: {
      // Include virtual fields
      include: ["age", "growthStage"],
    },
  });

  //if animal, growth stage, diet needs, weight record not empty
  if (
    animal &&
    animal.growthStage &&
    animal.species?.speciesDietNeeds &&
    animal.species?.physiologicalReferenceNorms &&
    animal.animalWeights
  ) {
    //get lastest weight record
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

    // Find the physiological reference information for the given species and growth stage
    let physiologicalNorm = null;
    for (let p of animal.species.physiologicalReferenceNorms) {
      if ((p.growthStage = animal.growthStage)) {
        physiologicalNorm = p;
      }
    }

    // Find the dietary information for the given food category
    const dietaryInfo = await SpeciesDietNeed.findOne({
      where: {
        animalFeedCategory: animalFeedCategory,
        growthStage: animal.growthStage,
      },
    });
    if (latestWeightRecord && dietaryInfo && physiologicalNorm) {
      // Calculate the recommended amount based on weight distribution and dietary information
      if (weekOrMeal.toUpperCase() == "MEAL") {
        if (animal.sex == AnimalSex.MALE) {
          return calculateFeedingItemAmtReco(
            dietaryInfo.amountPerMealGramMale,
            latestWeightRecord.weightInKg,
            physiologicalNorm.minWeightMaleKg,
            physiologicalNorm.maxWeightMaleKg,
          );
        } else if (animal.sex == AnimalSex.FEMALE) {
          return calculateFeedingItemAmtReco(
            dietaryInfo.amountPerMealGramFemale,
            latestWeightRecord.weightInKg,
            physiologicalNorm.minWeightFemaleKg,
            physiologicalNorm.maxWeightFemaleKg,
          );
        } else {
          // Handle cases where animal sex is nonbinary or unknown
          return "No dietary data found!";
        }
      } else if (weekOrMeal.toUpperCase() == "WEEK") {
        if (animal.sex == AnimalSex.MALE) {
          return calculateFeedingItemAmtReco(
            dietaryInfo.amountPerWeekGramMale,
            latestWeightRecord.weightInKg,
            physiologicalNorm.minWeightMaleKg,
            physiologicalNorm.maxWeightMaleKg,
          );
        } else if (animal.sex == AnimalSex.FEMALE) {
          return calculateFeedingItemAmtReco(
            dietaryInfo.amountPerWeekGramFemale,
            latestWeightRecord.weightInKg,
            physiologicalNorm.minWeightFemaleKg,
            physiologicalNorm.maxWeightFemaleKg,
          );
        } else {
          // Handle cases where animal sex is nonbinary or unknown
          return "No dietary data found!";
        }
      } else {
        throw new Error(
          "Please enter MEAL or WEEK to calculate recommended amount!",
        );
      }
    } else {
      // Handle cases where dietary information is missing
      return "No dietary data found!";
    }
  } else {
    return "No dietary data found!";
  }
}

async function calculateFeedingItemAmtReco(
  recommendedAmount: number,
  animalWeight: number,
  lowerWeightRange: number,
  upperWeightRange: number,
) {
  // Calculate the average weight within the specified range
  const averageWeight = (lowerWeightRange + upperWeightRange) / 2;

  // Calculate the weight difference from the average weight
  const weightDifference = animalWeight - averageWeight;

  // Calculate the ratio of weightDifference
  const ratio = weightDifference / (upperWeightRange - averageWeight);

  // for ration outside of range -1 ~ 1, add moderator
  let moderator = 0;
  if (ratio < -1) {
    moderator = ratio + 1;
  } else if (ratio > 1) {
    moderator = ratio - 1;
  }
  // Calculate the adjustment factor
  const adjustmentFactor = 1 + 0.1 * ratio - 0.05 * moderator;

  // Adjust the recommended amount within the adjustment factor
  let result = recommendedAmount * adjustmentFactor;

  const formattedNumber: string = result.toFixed(2);
  const roundedResult: number = parseFloat(formattedNumber);

  return roundedResult;
}
