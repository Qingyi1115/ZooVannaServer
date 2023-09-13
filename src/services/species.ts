import { Request } from 'express'
import { handleFileUpload } from "../helpers/multerProcessFile";
import fs from 'fs';

export async function createNewSpecies(newBody: any, req: Request) {
    let newSpecies = {
        name: "test",
        imageUrl: "",
    } as any

    try {
        const uploadedPath = await handleFileUpload(req, 'D:/capstoneUploads/species');
        newSpecies.imageUrl = uploadedPath;
        return newSpecies
    } catch (error) {
        // throw validationErrorHandler(error);
        console.log("error!")
        console.log(error)
    }
}