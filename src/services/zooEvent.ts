import { EventTimingType, EventType } from "../models/enumerated";
import { validationErrorHandler } from "../helpers/errorHandler";
import { ZooEvent } from "../models/zooEvent";
import { Employee } from "../models/employee";
import { AnimalActivity } from "../models/animalActivity";
import { AnimalActivitySession } from "../models/animalActivitySession";

export async function getAllZooEvents(includes: string[]) {
    try {
        const zooEvents = await ZooEvent.findAll({ include: includes });
        return zooEvents;
    } catch (error: any) {
        throw validationErrorHandler(error);
    }
}

export async function getZooEventById(
    zooEventId:number,
) {
    try {
        const zooEvent = await ZooEvent.findOne({
            where:{zooEventId:zooEventId},
            include:[
                "planningStaff",
                "keepers",
                "enclosure",
                "animal",
                "inHouse",
                "animalClinic",
                "animalActivitySession",
            ]
        });

        return zooEvent;
    } catch (error: any) {
        throw validationErrorHandler(error);
    }
}

export async function getAnimalActivitySessionById(animalActivitySessionId:number){
    try {
        const zooEvent = await AnimalActivitySession.findOne({
            where:{animalActivitySessionId:animalActivitySessionId},
            include:[
                "planningStaff",
                "keepers",
                "enclosure",
                "animal",
                "inHouse",
                "animalClinic",
                "animalActivitySession",
            ]
        });

        return zooEvent;
    } catch (error: any) {
        throw validationErrorHandler(error);
    }

}

export async function createNewInternalZooEvent(
    eventName: string, 
    eventNotificationDate: Date,
    eventStartDateTime:Date,
    eventEndDateTime : Date,
    eventDurationHrs:number,
    isFlexible: boolean,
    eventTiming: EventTimingType,
    eventDescription: string,
    eventIsPublic:boolean,
    eventType:EventType,
    planningStaffEmployeeId:number,
    animalActivitySessionId:number
  ) {
    try {

        const planningStaff = await (await Employee.findOne({
            where:{employeeId:planningStaffEmployeeId}
        }))?.getPlanningStaff();
        if (!planningStaff) throw { message:"Unable to find planning staff with employeeId: " + planningStaffEmployeeId}

        const animalActivitySession = await getAnimalActivitySessionById(animalActivitySessionId);
        if (!animalActivitySession) throw {message:"Unable to find activity session with Id: " + animalActivitySession}

        const newZooEvent = await ZooEvent.create({
            eventName:eventName,
            eventNotificationDate:eventNotificationDate,
            eventStartDateTime:eventStartDateTime,
            eventEndDateTime : eventEndDateTime,
            eventDurationHrs:eventDurationHrs,
            isFlexible: isFlexible,
            eventTiming: eventTiming,
            eventDescription: eventDescription,
            eventIsPublic:eventIsPublic,
            eventType:eventType
        });

        await animalActivitySession.setZooEvent(newZooEvent);
        await planningStaff.addZooEvent(newZooEvent);

        return newZooEvent;
    } catch (error: any) {
        throw validationErrorHandler(error);
    }
}

export async function updateZooEventDetails(
    zooEventId:number,
    eventName: string, 
    eventNotificationDate: Date,
    eventStartDateTime:Date,
    eventEndDateTime : Date,
    eventDurationHrs:number,
    isFlexible: boolean,
    eventTiming: EventTimingType,
    eventDescription: string,
    eventIsPublic:boolean,
    eventType:EventType,
  ) {
    try {
        const zooEvent = await ZooEvent.findOne({
            where:{zooEventId:zooEventId}
        });
        if (!zooEvent) throw {message:"Unable to find Zoo Event with Id: " + zooEventId}

        zooEvent.eventName = eventName;
        zooEvent.eventNotificationDate = eventNotificationDate;
        zooEvent.eventStartDateTime = eventStartDateTime;
        zooEvent.eventEndDateTime = eventEndDateTime;
        zooEvent.eventDurationHrs = eventDurationHrs;
        zooEvent.isFlexible = isFlexible;
        zooEvent.eventTiming = eventTiming;
        zooEvent.eventDescription = eventDescription;
        zooEvent.eventIsPublic = eventIsPublic;
        zooEvent.eventType = eventType;

        await zooEvent.save();

        return zooEvent;
    } catch (error: any) {
        throw validationErrorHandler(error);
    }
}

export async function deleteZooEvent(
    zooEventId:number,
  ) {
    try {
        const zooEvent = await ZooEvent.findOne({
            where:{zooEventId:zooEventId}
        });
        if (!zooEvent) throw {message:"Unable to find Zoo Event with Id: " + zooEventId}

        return await zooEvent.destroy();
    } catch (error: any) {
        throw validationErrorHandler(error);
    }
}

