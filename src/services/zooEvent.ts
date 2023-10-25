import { DayOfWeek, EventTimingType, EventType, RecurringPattern } from "../models/enumerated";
import { validationErrorHandler } from "../helpers/errorHandler";
import * as AnimalService from "./animal";
import { ZooEvent } from "../models/zooEvent";
import { ADVANCE_DAYS_FOR_ZOO_EVENT_GENERATION, ANIMAL_ACTIVITY_NOTIFICATION_HOURS, ANIMAL_FEEDING_NOTIFICATION_HOURS, DAY_IN_MILLISECONDS, HOUR_IN_MILLISECONDS, MINUTES_IN_MILLISECONDS } from "../helpers/staticValues";
import { compareDates, getNextDayOfMonth, getNextDayOfWeek } from "../helpers/others";
import { Op } from "Sequelize";
import { Employee } from "../models/employee";

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

  let startDate = compareDates(new Date(), animalActivity.startDate) > 0 ? new Date() : animalActivity.startDate;
  startDate = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
  if (zooEvents.length> 0){
    const latestEventDate = zooEvents.reduce((a, b)=>compareDates(a.eventStartDateTime, b.eventStartDateTime) > 0 ? a : b).eventStartDateTime;
    startDate = compareDates(latestEventDate, startDate) > 0 ? latestEventDate : startDate;
    let lastday = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth() + 1, 0)).getDate();
    
    startDate = animalActivity.recurringPattern == RecurringPattern.DAILY?
    new Date(startDate.getTime() + DAY_IN_MILLISECONDS) 
    : animalActivity.recurringPattern == RecurringPattern.WEEKLY?
    new Date(startDate.getTime() + DAY_IN_MILLISECONDS * 7)
    : animalActivity.recurringPattern == RecurringPattern.MONTHLY?
    new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth() + 1, Math.min(lastday, animalActivity.dayOfMonth || 1)))
    : startDate;
  }

  if (compareDates(new Date(), animalActivity.endDate) > 0) return animalActivity;
  let lastDate = compareDates(new Date(Date.now() + DAY_IN_MILLISECONDS * ADVANCE_DAYS_FOR_ZOO_EVENT_GENERATION) , animalActivity.endDate) < 0 
  ? new Date(Date.now() + DAY_IN_MILLISECONDS * ADVANCE_DAYS_FOR_ZOO_EVENT_GENERATION) 
  : animalActivity.endDate ;
  lastDate =new Date(Date.UTC(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate()));

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
      getNextDayOfMonth(startDate, animalActivity.dayOfMonth),
      lastDate,
      animalActivity.dayOfMonth,
      true
    );
  } else {
    let dayOfWeekNumber = 0;
    switch(animalActivity.dayOfWeek){
      case DayOfWeek.MONDAY: dayOfWeekNumber = 1; break;
      case DayOfWeek.TUESDAY: dayOfWeekNumber = 2; break;
      case DayOfWeek.WEDNESDAY: dayOfWeekNumber = 3; break;
      case DayOfWeek.THURSDAY: dayOfWeekNumber = 4; break;
      case DayOfWeek.FRIDAY: dayOfWeekNumber = 5; break;
      case DayOfWeek.SATURDAY: dayOfWeekNumber = 6; break;
    }
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
      getNextDayOfWeek(startDate, dayOfWeekNumber),
      lastDate,
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
  eventDescription: string,
) {
  const animalActivity = await AnimalService.getAnimalActivityById(animalActivityId);
  // const imageURL = (await (await animalActivity.getAnimals())[0].getSpecies()).imageUrl;
  try {
    const newZooEvent = await ZooEvent.create({
      eventName: animalActivity.title,
      eventDescription: eventDescription,
      eventIsPublic: false,
      eventType: animalActivity.activityType as any,
      eventStartDateTime: eventStartDateTime,
      eventNotificationDate : new Date(eventStartDateTime.getTime() - HOUR_IN_MILLISECONDS * ANIMAL_ACTIVITY_NOTIFICATION_HOURS),
      eventDurationHrs: eventDurationHrs,
      eventTiming: eventTiming,
      eventEndDateTime: null
      });
    
    await animalActivity.addZooEvent(newZooEvent);
    return animalActivity;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function generateMonthlyZooEventForFeedingPlanSession(feedingPlanSessionDetailId:number){
  const feedingPlanSessionDetail = await AnimalService.getFeedingPlanSessionDetailById(feedingPlanSessionDetailId);
  const feedingPlan = await feedingPlanSessionDetail.getFeedingPlan();
  const zooEvents = await feedingPlanSessionDetail.getZooEvents();

  // Get start date for the generation
  let startDate = compareDates(new Date(), feedingPlan.startDate) > 0 ? new Date() : feedingPlan.startDate;
  startDate = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
  if (zooEvents.length> 0){
    const latestEventDate = zooEvents.reduce((a, b)=>compareDates(a.eventStartDateTime, b.eventStartDateTime) > 0 ? a : b).eventStartDateTime;
    startDate = compareDates(latestEventDate, startDate) > 0 ? latestEventDate : startDate;
    startDate = new Date(startDate.getTime() + DAY_IN_MILLISECONDS * 7)
  }

  // Get end date for generation
  if (compareDates(new Date(), feedingPlan.endDate) > 0) return feedingPlanSessionDetail;
  let lastDate = compareDates(new Date(Date.now() + DAY_IN_MILLISECONDS * ADVANCE_DAYS_FOR_ZOO_EVENT_GENERATION) , feedingPlan.endDate) < 0 
  ? new Date(Date.now() + DAY_IN_MILLISECONDS * ADVANCE_DAYS_FOR_ZOO_EVENT_GENERATION) 
  : feedingPlan.endDate ;
  lastDate =new Date(Date.UTC(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate()));

  let interval = DAY_IN_MILLISECONDS * 7;

  let iKeepMyPromises : Promise<any>[] = [];
  
  let dayOfWeekNumber = 0;
  switch(feedingPlanSessionDetail.dayOfWeek){
    case DayOfWeek.MONDAY: dayOfWeekNumber = 1; break;
    case DayOfWeek.TUESDAY: dayOfWeekNumber = 2; break;
    case DayOfWeek.WEDNESDAY: dayOfWeekNumber = 3; break;
    case DayOfWeek.THURSDAY: dayOfWeekNumber = 4; break;
    case DayOfWeek.FRIDAY: dayOfWeekNumber = 5; break;
    case DayOfWeek.SATURDAY: dayOfWeekNumber = 6; break;
  }
  
  iKeepMyPromises = loopCallbackDateIntervals(
    (date: Date)=>{
        return createFeedingPlanSessionDetailZooEvent(
          feedingPlanSessionDetail.feedingPlanSessionDetailId,
          date,
          feedingPlanSessionDetail.durationInMinutes,
          feedingPlanSessionDetail.eventTimingType,
          feedingPlan.feedingPlanDesc,
          feedingPlanSessionDetail.isPublic,
          feedingPlanSessionDetail.publicEventStartTime || ""
      );
    }, 
    getNextDayOfWeek(startDate, dayOfWeekNumber),
    lastDate,
    interval,
    false
  );
  
  for (const p of iKeepMyPromises){
    await p;
  }
  return feedingPlanSessionDetail;
}

export async function createFeedingPlanSessionDetailZooEvent(
  feedingPlanSessionDetailId: number,
  eventStartDateTime: Date,
  eventDurationHrs: number,
  eventTiming: EventTimingType | null,
  eventDescription: string,
  eventIsPublic: boolean,
  publicEventStartTime: string,
) {
  const feedingPlanSessionDetail = await AnimalService.getFeedingPlanSessionDetailById(feedingPlanSessionDetailId);
  const feedingPlan = (await feedingPlanSessionDetail.getFeedingPlan());
  const imageUrl = (await (await feedingPlan.getAnimals())[1].getSpecies()).imageUrl;
  try {
    if (eventIsPublic){
      eventStartDateTime.setHours(parseInt(publicEventStartTime?.substring(0, 2)));
      eventStartDateTime.setMinutes(parseInt(publicEventStartTime?.substring(3, 5)));
    }
    const newZooEvent = await ZooEvent.create({
      eventName: "Feeding session for " + (await feedingPlan.getSpecies()).aliasName,
      eventStartDateTime: eventStartDateTime,
      eventDurationHrs: eventDurationHrs,
      eventTiming: eventTiming,
      eventDescription: eventDescription,
      eventIsPublic: eventIsPublic,
      eventNotificationDate : new Date(eventStartDateTime.getTime() - HOUR_IN_MILLISECONDS * ANIMAL_FEEDING_NOTIFICATION_HOURS),
      eventEndDateTime : eventIsPublic? new Date(eventStartDateTime.getTime() + eventDurationHrs * HOUR_IN_MILLISECONDS) : null,
      imageUrl: eventIsPublic? imageUrl: undefined
    });
    
    await feedingPlanSessionDetail.addZooEvent(newZooEvent);
    return feedingPlanSessionDetail;
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
            "animalActivity",
          ]
      });

      if (!zooEvent) throw {message:"Zoo event not found id:" + zooEventId}

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

export async function updateZooEventIncludeFuture(
  zooEventId : number,
  eventName : string, 
  eventDescription : string,
  eventIsPublic : boolean,
  eventType : EventType,
  eventStartDateTime : number,
  // Internal
  eventDurationHrs : number,
  eventTiming : EventTimingType,
  // Public
  eventNotificationDate : number,
  eventEndDateTime : number,
) {
  const zooEvent : ZooEvent = await getZooEventById(zooEventId);
  
  zooEvent.eventName = eventName;
  zooEvent.eventDescription = eventDescription;
  zooEvent.eventIsPublic = eventIsPublic;
  zooEvent.eventType = eventType;
  const originalStartDateTime = zooEvent.eventStartDateTime;
  const deltaStartDateTime = eventStartDateTime - zooEvent.eventStartDateTime.getTime();
  const iKeepMyPromises: Promise<any>[] = [];

  if (eventIsPublic){
    throw {message:"Not yet implemented!"}
  }else{
    // Internal event
    const animalActivity = await zooEvent.getAnimalActivity();
    if (animalActivity){
      // Update future events
      (await animalActivity.getZooEvents()).forEach(ze=>{
        if (compareDates(ze.eventStartDateTime, originalStartDateTime) >= 0){
          ze.eventStartDateTime = new Date(ze.eventStartDateTime.getTime() + deltaStartDateTime);
          ze.eventName = eventName;
          ze.eventDescription = eventDescription;
          ze.eventIsPublic = eventIsPublic;
          ze.eventType = eventType;
          ze.eventDurationHrs = eventDurationHrs;
          ze.eventTiming = eventTiming;
          iKeepMyPromises.push(ze.save());
        }
      });
      // Update generator
      animalActivity.title = eventName;
      animalActivity.details = eventDescription;
      animalActivity.durationInMinutes = eventDurationHrs * 60;
      animalActivity.eventTimingType = eventTiming;
      if (animalActivity.recurringPattern == RecurringPattern.MONTHLY){
        animalActivity.dayOfMonth= new Date(eventStartDateTime).getDay();
      }else if (animalActivity.recurringPattern == RecurringPattern.WEEKLY){
        const dayOfWeekMap : any = {
          _1:DayOfWeek.MONDAY,
          _2:DayOfWeek.TUESDAY,
          _3:DayOfWeek.WEDNESDAY,
          _4:DayOfWeek.THURSDAY,
          _5:DayOfWeek.FRIDAY,
          _6:DayOfWeek.SATURDAY,
          _0:DayOfWeek.SUNDAY
        };
        const day = "_" + new Date(eventStartDateTime).getDay().toString();
        animalActivity.dayOfWeek= dayOfWeekMap[day];
      }
      iKeepMyPromises.push(animalActivity.save());
    }else{

    }
  }
  
  for (const p of iKeepMyPromises) await p;
  try {
    return await zooEvent.reload();
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function assignZooEventKeeper(
  zooEventIds: number[],
  employeeIds : number[]
) {
  try {
    const zooEvents = await ZooEvent.findAll({
        where:{
          zooEventId:{
            [Op.or]: zooEventIds
          }
        }
    });

    for (const zooEventId of zooEventIds){
      if (!zooEvents.find(ze=>ze.zooEventId == zooEventId)) throw {mesage:"Unable to find zoo event with Id " + zooEventId}
    }

    const employees = await Employee.findAll({
        where:{
          employeeId:{
            [Op.or]: employeeIds
          }
        }
    });

    for (const empId of employeeIds){
      if (!employees.find(e=>e.employeeId == empId)) throw {mesage:"Unable to find Keeper with employee Id " + empId}
    }

    const keepers = [];
    for (const emp of employees) {
      const keeper = (await emp.getKeeper());
      if (!keeper) throw {message:"Keeper does not exist on employee :" + emp.employeeName}
      keepers.push(keeper);
    }

    const promises = [];
    for (const keeper of keepers) {
      for (const zooEvent of zooEvents){
        promises.push(keeper.addZooEvent(zooEvent));
      }
    }
    
    for (const p of promises) await p;
  } catch (error: any) {
      throw validationErrorHandler(error);
  }
}

export async function removeKeeperfromZooEvent(
  zooEventIds: number[],
  employeeIds : number[]
) {
  try {
    const zooEvents = await ZooEvent.findAll({
        where:{
          zooEventId:{
            [Op.or]: zooEventIds
          }
        }
    });

    for (const zooEventId of zooEventIds){
      if (!zooEvents.find(ze=>ze.zooEventId == zooEventId)) throw {mesage:"Unable to find zoo event with Id " + zooEventId}
    }

    const employees = await Employee.findAll({
        where:{
          employeeId:{
            [Op.or]: employeeIds
          }
        }
    });

    for (const empId of employeeIds){
      if (!employees.find(e=>e.employeeId == empId)) throw {mesage:"Unable to find Keeper with employee Id " + empId}
    }

    const keepers = [];
    for (const emp of employees) {
      const keeper = (await emp.getKeeper());
      if (!keeper) throw {message:"Keeper does not exist on employee :" + emp.employeeName}
      keepers.push(keeper);
    }

    const promises = [];
    for (const keeper of keepers) {
      for (const zooEvent of zooEvents){
        promises.push(keeper.removeZooEvent(zooEvent));
      }
    }
    
    for (const p of promises) await p;
  } catch (error: any) {
      throw validationErrorHandler(error);
  }
}

export async function getAllZooEvents(
  startDate: Date,
  endDate : Date,
  includes : string[]
) {
  try {
      const zooEvent = await ZooEvent.findAll({
          where:{
            eventStartDateTime:{
              [Op.between]:[startDate, endDate]
            }
          },
          include:includes
      });

      return zooEvent;
  } catch (error: any) {
      throw validationErrorHandler(error);
  }
}
