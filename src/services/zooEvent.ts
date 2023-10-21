import { EventTimingType, EventType } from "../models/enumerated";
import { validationErrorHandler } from "../helpers/errorHandler";
import * as AnimalService from "./animal";
import { ZooEvent } from "../models/zooEvent";
import { ANIMAL_ACTIVITY_NOTIFICATION_HOURS, HOUR_IN_MILLISECONDS } from "../helpers/staticValues";

export async function createAnimalActivityZooEvent(
  animalActivityId: number,
  eventStartDateTime: Date,
  eventDurationHrs: number,
  eventTiming: EventTimingType | null,
  eventDescription: string
) {
  const animalActivity = await AnimalService.getAnimalActivityById(animalActivityId);
  try {
    const newZooEvent = await ZooEvent.create({
      eventName: animalActivity.title,
      eventStartDateTime: eventStartDateTime,
      eventDurationHrs: eventDurationHrs,
      eventTiming: eventTiming,
      eventDescription: eventDescription,
      eventIsPublic: false,
      eventNotificationDate : new Date(eventStartDateTime.getTime() - HOUR_IN_MILLISECONDS * ANIMAL_ACTIVITY_NOTIFICATION_HOURS),
    });
    
    await animalActivity.addZooEvent(newZooEvent);
    return animalActivity;
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
              "animal",
          ]
      });

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

export async function updateZooEventById(
  zooEventId: number,
  zooEventAttributes: any
) {
  const zooEvent : any = await getZooEventById(zooEventId);

  for (const [field, v] of Object.entries(zooEventAttributes)) {
    zooEvent[field] = v;
  }

  try {
    await zooEvent.save();
    return zooEvent;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}
