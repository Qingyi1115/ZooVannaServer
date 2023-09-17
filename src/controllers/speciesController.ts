import { Request, Response } from "express";
import { Species } from "models/species";


import { createNewEmployee, findEmployeeByEmail } from "../services/employee";
import * as SpeciesService from "../services/species";

import { handleFileUpload } from "../helpers/multerProcessFile";

export async function getAllSpecies(req: Request, res: Response) {

    try{
        const allSpecies = await SpeciesService.getAllSpecies();
        return res.status(200).json(allSpecies);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export async function getSpeciesByCode(req: Request, res: Response) {

    // try{
    //     const species = await SpeciesService.getSpeciesByCodFromDB();
    //     return res.status(200).json(species);
    // } catch (error: any) {
    //     res.status(400).json({ error: error.message });
    // }
}

export async function createSpecies(req: Request, res: Response) {
    try {
        // const { email } = (req as any).locals.jwtPayload
        // const employee = await findEmployeeByEmail(email);

        // if (!((await employee.getPlanningStaff())?.plannerType == PlannerType.OPERATIONS_MANAGER)) {
        //     return res.status(403).json({error: "Access Denied! Operation managers only!"});
        // }


        const imageUrl = await handleFileUpload(
            req,
            process.env.IMG_URL_ROOT! + "species" , //"D:/capstoneUploads/species",
        );
        const {
            commonName,
            scientificName,
            aliasName,
            conservationStatus,
            domain,
            kingdom,
            phylum,
            speciesClass,
            order,
            family,
            genus,
            educationalDescription,
            nativeContinent,
            selectedBiomes,
            groupSexualDynamic,
            habitatOrExhibit,
            generalDietPreference,
        } = req.body;

        if (
            [
                commonName,
                scientificName,
                aliasName,
                conservationStatus,
                domain,
                kingdom,
                phylum,
                speciesClass,
                order,
                family,
                genus,
                educationalDescription,
                nativeContinent,
                selectedBiomes,
                groupSexualDynamic,
                habitatOrExhibit,
                generalDietPreference,
            ].includes(undefined)
        ) {
            console.log("Missing field(s): ", {
                commonName,
                scientificName,
                aliasName,
                conservationStatus,
                domain,
                kingdom,
                phylum,
                speciesClass,
                order,
                family,
                genus,
                educationalDescription,
                nativeContinent,
                selectedBiomes,
                groupSexualDynamic,
                habitatOrExhibit,
                generalDietPreference,
            });
            return res.status(400).json({ error: "Missing information!" });
        }

        // have to pass in req for image uploading
        let species = await SpeciesService.createNewSpecies(commonName,
            scientificName,
            aliasName,
            conservationStatus,
            domain,
            kingdom,
            phylum,
            speciesClass,
            order,
            family,
            genus,
            educationalDescription,
            nativeContinent,
            selectedBiomes,
            groupSexualDynamic,
            habitatOrExhibit,
            generalDietPreference,
            imageUrl);

        return res.status(200).json({ species });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

