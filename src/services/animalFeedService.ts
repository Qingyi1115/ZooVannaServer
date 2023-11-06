import { AnimalFeedCategory } from "models/Enumerated";
import { validationErrorHandler } from "../helpers/errorHandler";
import { AnimalFeed } from "../models/AnimalFeed";

export async function createNewAnimalFeed(
  animalFeedName: string,
  animalFeedImageUrl: string,
  animalFeedCategory: AnimalFeedCategory,
) {
  let newAnimalFeed = {
    animalFeedName: animalFeedName,
    animalFeedImageUrl: animalFeedImageUrl,
    animalFeedCategory: animalFeedCategory,
  } as any;

  console.log(newAnimalFeed);

  try {
    return AnimalFeed.create(newAnimalFeed);
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllAnimalFeed(includes: string[] = []) {
  try {
    const allAnimalFeed = await AnimalFeed.findAll({
      include: includes,
    });
    return allAnimalFeed;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAnimalFeedByName(
  animalFeedName: string,
  includes: string[] = [],
) {
  let result = await AnimalFeed.findOne({
    where: { animalFeedName: animalFeedName },
    include: includes,
  });
  if (result) {
    return result;
  }
  throw { message: "Invalid animal feed name!" };
}

export async function getAnimalFeedById(
  animalFeedId: number,
  includes: string[] = [],
) {
  let result = await AnimalFeed.findOne({
    where: { animalFeedId: animalFeedId },
    include: includes,
  });
  if (result) {
    return result;
  }
  throw { message: "Invalid animal feed id!" };
}

export async function deleteAnimalFeedByName(animalFeedName: string) {
  let result = await AnimalFeed.destroy({
    where: { animalFeedName: animalFeedName },
  });
  if (result) {
    return result;
  }
  throw { message: "Invalid animal feed name!" };
}

export async function updateAnimalFeed(
  animalFeedId: number,
  animalFeedName: string,
  animalFeedCategory: AnimalFeedCategory,
  animalFeedImageUrl: string,
) {
  let updatedAnimalFeed = {
    animalFeedId: animalFeedId,
    animalFeedName: animalFeedName,
    animalFeedCategory: animalFeedCategory,
    animalFeedImageUrl: animalFeedImageUrl,
  } as any;

  // console.log(updatedAnimalFeed)

  try {
    let animalFeed = await AnimalFeed.update(updatedAnimalFeed, {
      where: { animalFeedId: animalFeedId },
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function updateAnimalFeedImage(
  animalFeedName: string,
  imageUrl: string,
) {
  let updatedAnimalFeed = {
    imageUrl: imageUrl,
  } as any;

  console.log(updatedAnimalFeed);

  try {
    let animalFeed = await AnimalFeed.update(updatedAnimalFeed, {
      where: { animalFeedName: animalFeedName },
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}
