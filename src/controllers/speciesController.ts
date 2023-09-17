import { Request, Response } from "express";
import { Species } from "models/species";

import { createNewEmployee, findEmployeeByEmail } from "../services/employee";
import * as SpeciesService from "../services/species";

import { handleFileUpload } from "../helpers/multerProcessFile";

export async function getAllSpecies(req: Request, res: Response) {
    try {
        const allSpecies = await SpeciesService.getAllSpecies();
        return res.status(200).json(allSpecies);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export async function getSpeciesByCode(req: Request, res: Response) {
    const { speciesCode } = req.params;

    if (speciesCode == undefined) {
        console.log("Missing field(s): ", {
            speciesCode,
        });
        return res.status(400).json({ error: "Missing information!" });
    }

    try {
        const species = await SpeciesService.getSpeciesByCode(speciesCode);
        return res.status(200).json(species);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
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
            process.env.IMG_URL_ROOT! + "species", //"D:/capstoneUploads/species",
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
            nativeBiomes,
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
                nativeBiomes,
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
                nativeBiomes,
                groupSexualDynamic,
                habitatOrExhibit,
                generalDietPreference,
            });
            return res.status(400).json({ error: "Missing information!" });
        }

        // have to pass in req for image uploading
        let species = await SpeciesService.createNewSpecies(
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
            nativeBiomes,
            groupSexualDynamic,
            habitatOrExhibit,
            generalDietPreference,
            imageUrl,
        );

        return res.status(200).json({ species });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export async function updateSpecies(req: Request, res: Response) {
    try {
        const imageUrl = await handleFileUpload(
            req,
            process.env.IMG_URL_ROOT! + "species", //"D:/capstoneUploads/species",
        );
        const {
            speciesCode,
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
            nativeBiomes,
            groupSexualDynamic,
            habitatOrExhibit,
            generalDietPreference,
        } = req.body;

        if (
            [
                speciesCode,
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
                nativeBiomes,
                groupSexualDynamic,
                habitatOrExhibit,
                generalDietPreference,
            ].includes(undefined)
        ) {
            console.log("Missing field(s): ", {
                speciesCode,
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
                nativeBiomes,
                groupSexualDynamic,
                habitatOrExhibit,
                generalDietPreference,
            });
            return res.status(400).json({ error: "Missing information!" });
        }

        // have to pass in req for image uploading
        let species = await SpeciesService.updateSpecies(
            speciesCode,
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
            nativeBiomes,
            groupSexualDynamic,
            habitatOrExhibit,
            generalDietPreference,
            imageUrl,
        );

        return res.status(200).json({ species });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export async function deleteSpeciesByCode(req: Request, res: Response) {
    const { speciesCode } = req.params;

    if (speciesCode == undefined) {
        console.log("Missing field(s): ", {
            speciesCode,
        });
        return res.status(400).json({ error: "Missing information!" });
    }

    try {
        const species = await SpeciesService.deleteSpeciesByCode(speciesCode);
        return res.status(200).json(species);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}