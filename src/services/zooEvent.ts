import { EventTimingType, RecurringPattern } from "../models/enumerated";
import { validationErrorHandler } from "../helpers/errorHandler";
import * as AnimalService from "./animal";
import { ZooEvent } from "../models/zooEvent";
import { ADVANCE_DAYS_FOR_ZOO_EVENT_GENERATION, ANIMAL_ACTIVITY_NOTIFICATION_HOURS, DAY_IN_MILLISECONDS, HOUR_IN_MILLISECONDS } from "../helpers/staticValues";
import { compareDates } from "../helpers/others";

function loopCallbackDateIntervals(
  callback: Function,
  startDate:Date,
  endDate: Date,
  interval: number,
  isMonthly: boolean
):Promise<any>[]{
  let promises: Promise<any>[] = [];
  while (compareDates(startDate, endDate) < 0){
    promises.push(callback(startDate));
    if (!isMonthly){
      startDate = new Date(startDate.getTime() + interval);
    } else{
      let lastday = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth() + (interval > 0 ? 1 : -1), 0)).getDate();
      startDate = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth() + (interval > 0 ? 1 : -1), Math.min(lastday, interval)));
    }
  }
  return promises;
}

export async function generateMonthlyZooEventForAnimalActivity(animalActivityId:number){
  const animalActivity = await AnimalService.getAnimalActivityById(animalActivityId);
  const zooEvents = await animalActivity.getZooEvents();

  let earliestDate = compareDates(new Date(), animalActivity.startDate) > 0 ? new Date() : animalActivity.startDate;
  earliestDate = new Date(Date.UTC(earliestDate.getFullYear(), earliestDate.getMonth(), earliestDate.getDate()));
  if (zooEvents.length> 0){
    earliestDate = zooEvents.reduce((a, b)=>compareDates(a.eventStartDateTime, b.eventStartDateTime) > 0 ? b : a).eventStartDateTime;
  }

  if (compareDates(new Date(), animalActivity.endDate) > 0) return animalActivity;
  let latestDate = compareDates(new Date(Date.now() + DAY_IN_MILLISECONDS * ADVANCE_DAYS_FOR_ZOO_EVENT_GENERATION) , animalActivity.endDate) < 0 
  ? new Date(Date.now() + DAY_IN_MILLISECONDS * ADVANCE_DAYS_FOR_ZOO_EVENT_GENERATION) 
  : animalActivity.endDate ;
  latestDate =new Date(Date.UTC(latestDate.getFullYear(), latestDate.getMonth(), latestDate.getDate()));

  let interval = 0;
  switch(animalActivity.recurringPattern){
    case RecurringPattern.DAILY: interval = DAY_IN_MILLISECONDS; break;
    case RecurringPattern.WEEKLY: interval = DAY_IN_MILLISECONDS * 7; break;
  }

  let iKeepMyPromises : Promise<any>[] = [];

  if (animalActivity.recurringPattern == RecurringPattern.NON_RECURRING){
    return createAnimalActivityZooEvent(
      animalActivity.animalActivityId,
      animalActivity.startDate,
      animalActivity.durationInMinutes,
      animalActivity.eventTimingType,
      animalActivity.details
    );
  } else if (animalActivity.recurringPattern == RecurringPattern.MONTHLY){
    if (!animalActivity.dayOfMonth) throw {error : "animalActivity day of month missing!"}
    iKeepMyPromises = loopCallbackDateIntervals(
      (date: Date)=>{
          return createAnimalActivityZooEvent(
            animalActivity.animalActivityId,
            date,
            animalActivity.durationInMinutes,
            animalActivity.eventTimingType,
            animalActivity.details
        );
      }, 
      earliestDate,
      latestDate,
      animalActivity.dayOfMonth,
      true
    );
  } else {
    iKeepMyPromises = loopCallbackDateIntervals(
      (date: Date)=>{
          return createAnimalActivityZooEvent(
            animalActivity.animalActivityId,
            date,
            animalActivity.durationInMinutes,
            animalActivity.eventTimingType,
            animalActivity.details
        );
      }, 
      earliestDate,
      latestDate,
      interval,
      false
    );
  }
  
  for (const p of iKeepMyPromises){
    await p;
  }
  return animalActivity;
}

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
