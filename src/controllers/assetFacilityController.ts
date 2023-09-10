import { Request, Response } from "express";
import { findEmployeeByEmail } from "../services/user";
import { PlannerType } from "../models/enumerated";
import { createNewFacility, getFacilityById } from "../services/assetFacility";

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

export async function updateFacility(req: Request, res: Response) {
    try {
        const { email } = (req as any).locals.jwtPayload
        const employee =  await findEmployeeByEmail(email);
        
        if (!((await employee.getPlanningStaff())?.plannerType == PlannerType.OPERATIONS_MANAGER)) {
            return res.status(403).json({error: "Access Denied! Operation managers only!"});
        }

        const { facilityId, facilityName, xCoordinate, yCoordinate } = req.body

        if (!facilityId || [facilityName, xCoordinate, yCoordinate].every(field => field === undefined)){
            return res.status(400).json({error:"Missing information!"})
        }

        let facility = await getFacilityById(Number(facilityId)) as any; 
        console.log(facility);
        
        if (!facility) return res.status(400).json({ error: "Unknown facilityId " + facilityId });
        for (const [field,v] of Object.entries({"facilityName":facilityName, "xCoordinate":xCoordinate, "yCoordinate":yCoordinate})){
            if (v !== undefined){
                facility[field] = v;
            }
        }
        await facility.save();
        return res.status(200).json({facility:  facility.toJSON()})
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}