import { Request, Response } from "express";
import { Species } from "models/species";

import { createNewEmployee, findEmployeeByEmail } from "../services/employee";
import { createNewSpecies } from "../services/species";

import { handleFileUpload } from "../helpers/multerProcessFile";

export async function createSpecies(req: Request, res: Response) {
    try {
        // const { email } = (req as any).locals.jwtPayload
        // const employee = await findEmployeeByEmail(email);

        // if (!((await employee.getPlanningStaff())?.plannerType == PlannerType.OPERATIONS_MANAGER)) {
        //     return res.status(403).json({error: "Access Denied! Operation managers only!"});
        // }


        const imageUrl = await handleFileUpload(
            req,
            "D:/capstoneUploads/species",
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
        let species = await createNewSpecies(commonName,
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
