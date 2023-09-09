import { Request, Response } from "express";
import { findEmployeeByEmail } from "../services/user";
import { PlannerType } from "models/enumerated";
import { createNewFacility } from "services/assetFacility";

export async function createFacility(req: Request, res: Response) {
    
    try {
        const { email } = (req as any).locals.jwtPayload
        const employee =  await findEmployeeByEmail(email);
        
        if (!((await employee.getPlanningStaff())?.plannerType == PlannerType.OPERATIONS_MANAGER)) {
            return res.status(403).json({error: "Access Denied! Operation managers only!"});
        }

        const { facilityName, xCoordinate, yCoordinate, facilityDetail, facilityDetailJson } = req.body

        if ([facilityName, xCoordinate, yCoordinate, facilityDetail, facilityDetailJson].includes(undefined)){
            console.log("Missing field(s): ",{facilityName, xCoordinate, yCoordinate, facilityDetail, facilityDetailJson})
            return res.status(400).json({error:"Missing information!"})
        }

        let facility = await createNewFacility(facilityName, xCoordinate, yCoordinate, facilityDetail, facilityDetailJson);

        return res.status(200).json({facility:  facility.toJSON()})
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}