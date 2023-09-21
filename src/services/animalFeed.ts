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

export async function getAllAnimalFeed(
    includes: string[] = []
) {
    try {
        const allAnimalFeed = await AnimalFeed.findAll({
            include:includes
        });
        return allAnimalFeed;
    } catch (error: any) {
        throw validationErrorHandler(error);
    }
}

export async function getAnimalFeedByName(animalFeedName: string, includes: string[] = []) {
    let result = await AnimalFeed.findOne({
        where: { animalFeedName: animalFeedName },
        include:includes
    });
    if (result) {
        return result;
    }
    throw { error: "Invalid animal feed name!" };
}

export async function deleteAnimalFeedByName(animalFeedName: string) {
    let result = await AnimalFeed.destroy({
        where: { animalFeedName: animalFeedName },
    });
    if (result) {
        return result;
    }
    throw { error: "Invalid animal feed name!" };
}

export async function updateAnimalFeed(
    animalFeedName: string,
    animalFeedCategory: AnimalFeedCategory) {

    let updatedAnimalFeed = {
        animalFeedName: animalFeedName,
        animalFeedCategory: animalFeedCategory
    } as any;

    console.log(updatedAnimalFeed)

    try {
        let animalFeed = await AnimalFeed.update(updatedAnimalFeed, {
            where: { animalFeedName: animalFeedName },
        });
    } catch (error: any) {
        throw validationErrorHandler(error);
    }
}

export async function updateAnimalFeedImage(
    animalFeedName:string,
    imageUrl: string
    ) {

    let updatedAnimalFeed = {
        imageUrl: imageUrl
    } as any;

    console.log(updatedAnimalFeed)

    try {
        let animalFeed = await AnimalFeed.update(updatedAnimalFeed, {
            where: { animalFeedName: animalFeedName },
        });
    } catch (error: any) {
        throw validationErrorHandler(error);
    }
}