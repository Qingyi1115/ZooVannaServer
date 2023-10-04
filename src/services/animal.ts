import { Request } from "express";
import { Op } from "Sequelize";
import { validationErrorHandler } from "../helpers/errorHandler";
import { Animal } from "../models/animal";
import { Species } from "../models/species";
import { SpeciesEnclosureNeed } from "../models/speciesEnclosureNeed";
import { PhysiologicalReferenceNorms } from "../models/physiologicalReferenceNorms";
import { AnimalGrowthStage, AnimalStatus } from "../models/enumerated";
import { AnimalWeight } from "../models/animalWeight";
import * as SpeciesService from "../services/species";

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
  //   try {
  //     const allAnimals = await Animal.findAll({ include: [Species] });
  //     return allAnimals;
  //   } catch (error: any) {
  //     throw validationErrorHandler(error);
  //   }

  let result = await Species.findOne({
    where: { speciesCode: speciesCode },
    include: Animal, //eager fetch here!!
  });

  if (result) {
    let animalBySpecies = await result.animals;
    //   await result.getPhysiologicalRefNorm();
    return animalBySpecies;
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
  growthStage: string,
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
    growthStage: growthStage,
    animalStatus: animalStatus,
    imageUrl: imageUrl,
  } as any;

  console.log(newAnimal);

  try {
    let newAnimalEntry = await Animal.create(newAnimal);

    newAnimalEntry.setSpecies(
      await SpeciesService.getSpeciesByCode(speciesCode, []),
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
  growthStage: string,
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
    growthStage: growthStage,
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
            ],
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
            ],
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
  try {
    await deleteAnimalLineage(childAnimalCode, parentAnimalCode);
    await addAnimalLineage(childAnimalCode, newParentAnimalCode);
  } catch (error: any) {
    throw new Error(error);
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

export async function checkIsSafeBreeding( // <--NOT WORKING, need recursion
  animalCode1: string,
  animalCode2: string,
) {
  if (!animalCode1 || !animalCode2) {
    return false; // At least one animal not found
  }

  let animal1 = await getLineageByAnimalCode(animalCode1);
  let animal2 = await getLineageByAnimalCode(animalCode2);

  if (animal1 && animal2) {
    // check if animal1 is animal2's parent
    // if (await animal1.isParentOf(animal2.animalId)) {
    //   return false;
    // }
    // // check if animal2 is animal1's parent
    // if (await animal2.isParentOf(animal1.animalId)) {
    //   return false;
    // }

    // check if have same parents
    let parentIds1 = animal1.parents!.map((parent: any) => parent.animalId);
    parentIds1.push(animal1.animalId);

    console.log("parentIds1: " + parentIds1);
    let parentIds2 = animal2.parents!.map((parent: any) => parent.animalId);
    parentIds2.push(animal2.animalId);
    console.log("parentIds2: " + parentIds2);

    let commonParents = parentIds1.filter((parentId) =>
      parentIds2.includes(parentId),
    );
    if (commonParents.length > 0) {
      return false; // Found common parents within three degrees
    }

    commonParents = parentIds2.filter((parentId) =>
      parentIds1.includes(parentId),
    );

    if (commonParents.length > 0) {
      return false; // Found common parents within three degrees
    }

    return true;
  }
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
