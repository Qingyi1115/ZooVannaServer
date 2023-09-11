import { SensorType } from "models/enumerated";
import { validationErrorHandler } from "../helpers/errorHandler";
import { Facility } from "../models/facility";
import { Sensor } from "models/sensor";


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

export async function addSensorByFacilityId(facilityId:number, sensorType: SensorType, sensorName: string) : Promise<Sensor> {

    try{
        const facility = await Facility.findOne({where:{"facilityId":facilityId}});
        if (!facility) throw {message: "Unable to find facilityId " + facilityId}

        const newSensor = await Sensor.create({
            sensorType: sensorType,
            sensorName: sensorName
        } as any);

        await facility.addSensor(newSensor);
        return newSensor;

    } catch (error: any) {
        throw validationErrorHandler(error);
    }
}

