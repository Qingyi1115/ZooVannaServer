import { Request } from "express";
import { validationErrorHandler } from "../helpers/errorHandler";
import { AnimalFeed } from "../models/animalFeed";
import { AnimalFeedCategory } from "models/enumerated";

export async function createNewAnimalFeed(
    animalFeedName: string,
    animalFeedImageUrl: string,
    animalFeedCategory: AnimalFeedCategory) {

    let newAnimalFeed = {
        animalFeedName: animalFeedName,
        animalFeedImageUrl: animalFeedImageUrl,
        animalFeedCategory: animalFeedCategory
    } as any;

    console.log(newAnimalFeed)

    try {
        return AnimalFeed.create(newAnimalFeed)
    } catch (error: any) {
        throw validationErrorHandler(error);
    }
}

export async function getAnimalFeed() { }
export async function setAnimalFeed() { }
export async function deleteAnimalFeed() { }