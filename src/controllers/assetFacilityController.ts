import { Request, Response } from "express";
import { findEmployeeByEmail } from "../services/user";
import { PlannerType } from "../models/enumerated";
import { createNewFacility, getFacilityById } from "../services/assetFacility";
import { Facility } from "models/facility";

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

        const { facilityId, facilityName, xCoordinate, yCoordinate , facilityDetailJson} = req.body

        if (!facilityId || [facilityName, xCoordinate, yCoordinate, facilityDetailJson].every(field => field === undefined)){
            return res.status(400).json({error:"Missing information!"})
        }

        let facility = await getFacilityById(Number(facilityId)) as any; 
        
        if (!facility) return res.status(400).json({ error: "Unknown facilityId " + facilityId });
        for (const [field,v] of Object.entries({"facilityName":facilityName, "xCoordinate":xCoordinate, "yCoordinate":yCoordinate})){
            if (v !== undefined){
                facility[field] = v;
            }
        }

        const p1 : Promise<Facility> = facility.save();

        if (facilityDetailJson !== undefined) {
            const facilityDetail = await facility.getFacilityDetail();
            if (facilityDetail === undefined) throw {message: "Unable to find facilityDetail for facilityId " + facilityId}
            for (const [field,v] of Object.entries(facilityDetailJson)){
                facilityDetail[field] = v;
            }
            await facilityDetail.save();
        }
        await p1;
        return res.status(200).json({facility:  facility.toJSON()})
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}