import { Request, Response } from "express";
import { Species } from "models/species";

import { createNewEmployee, findEmployeeByEmail } from "../services/user";
import { createNewSpecies } from "../services/species";

export async function createSpecies(req: Request, res: Response) {
    try {
        // const { email } = (req as any).locals.jwtPayload
        // const employee = await findEmployeeByEmail(email);

        // if (!((await employee.getPlanningStaff())?.plannerType == PlannerType.OPERATIONS_MANAGER)) {
        //     return res.status(403).json({error: "Access Denied! Operation managers only!"});
        // }

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
            nativeContinent,
            selectedBiomes,
            groupSexualDynamic,
            habitatOrExhibit,
            generalDietPreference,
        } = req.body;

        // if (
        //     [
        //         commonName,
        //         scientificName,
        //         aliasName,
        //         conservationStatus,
        //         domain,
        //         kingdom,
        //         phylum,
        //         speciesClass,
        //         order,
        //         family,
        //         genus,
        //         nativeContinent,
        //         selectedBiomes,
        //         groupSexualDynamic,
        //         habitatOrExhibit,
        //         generalDietPreference,
        //     ].includes(undefined)
        // ) {
        //     console.log("Missing field(s): ", {
        //         commonName,
        //         scientificName,
        //         aliasName,
        //         conservationStatus,
        //         domain,
        //         kingdom,
        //         phylum,
        //         speciesClass,
        //         order,
        //         family,
        //         genus,
        //         nativeContinent,
        //         selectedBiomes,
        //         groupSexualDynamic,
        //         habitatOrExhibit,
        //         generalDietPreference,
        //     });
        //     return res.status(400).json({ error: "Missing information!" });
        // }

        // have to pass in req for image uploading
        let species = await createNewSpecies(req);

        return res.status(200).json({ species });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}