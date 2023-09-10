import { validationErrorHandler } from "../helpers/errorHandler";
import { Facility } from "../models/facility";


export async function createNewFacility(facilityName:string, xCoordinate:number, yCoordinate:number, facilityDetail:string, facilityDetailJson:any) {
    let newFacility = {
        facilityName: facilityName,
        xCoordinate: xCoordinate,
        yCoordinate: yCoordinate,
    } as any
    newFacility[facilityDetail] = facilityDetailJson;

    try{
        return Facility.create(newFacility,{
            include:[{
                association : facilityDetail
            }]
        });
    } catch (error: any) {
        throw validationErrorHandler(error);
    }
}

export async function getFacilityById(facilityId:number) {

    try{
        return Facility.findOne({
            where:{"facilityId":facilityId}
        });
    } catch (error: any) {
        throw validationErrorHandler(error);
    }
}

