import { Request, Response } from "express";
import { Species } from "models/species";

import { createNewEmployee, findEmployeeByEmail } from "../services/user";
import { createNewSpecies } from "../services/species";

export async function createSpecies(req: Request, res: Response) {
    try {
        console.log("create species in controller")
        // console.log(req)
        // console.log("--")
        console.log(req.body)
        console.log("-----")
        console.log(req.file)
        console.log("---")
        // const { email } = (req as any).locals.jwtPayload
        // const employee = await findEmployeeByEmail(email);

        // if (!((await employee.getPlanningStaff())?.plannerType == PlannerType.OPERATIONS_MANAGER)) {
        //     return res.status(403).json({error: "Access Denied! Operation managers only!"});
        // }

        const newBody = req.body

        // if ([facilityName, xCoordinate, yCoordinate, facilityDetail, facilityDetailJson].includes(undefined)) {
        //     console.log("Missing field(s): ", { facilityName, xCoordinate, yCoordinate, facilityDetail, facilityDetailJson })
        //     return res.status(400).json({ error: "Missing information!" })
        // }

        let species = await createNewSpecies(newBody, req);

        return res.status(200).json({ species })
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}