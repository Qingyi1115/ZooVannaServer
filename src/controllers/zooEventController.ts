import { Request, Response } from "express";
import * as ZooEvent from "../services/zooEvent";
import { findEmployeeByEmail } from "../services/employee";
import { PlannerType } from "../models/enumerated";
import { compareDates } from "../helpers/others";
import { DAY_IN_MILLISECONDS } from "../helpers/staticValues";

export async function getAllZooEvents(req: Request, res: Response) {
  try {

  // Check authentication
  const { email } = (req as any).locals.jwtPayload;
  const employee = await findEmployeeByEmail(email);
  // const planningStaff = await employee.getPlanningStaff();

  // if (
  //   !employee.superAdmin &&
  //   !planningStaff &&
  //   !(await employee.getKeeper())
  // )
  //   return res
  //     .status(403)
  //     .json({ error: "Access Denied! Operation managers only!" });
    
  const { startDate, endDate, includes = [] } = req.body;
  if (
    [
      startDate,
      endDate,
    ].includes(undefined)
  ) {
    console.log("Missing field(s): ", {
      startDate,
      endDate,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  const _includes: any[] = [];
  for (const role of [
    "planningStaff",
    "enclosure",
    "animals",
    "inHouse",
    "animalActivity",
  ]) {
    if (includes.includes(role)){
      _includes.push({
        association:role,
        required:false
      });
    } 
  }

  if (includes.includes("feedingPlanSessionDetail")) {
    _includes.push({
      association: "feedingPlanSessionDetail",
      required:false,
      include:{
        association:"feedingPlan",
        required:false
      }
    });
  }

  if (includes.includes("keepers")) {
    _includes.push({
      association: "keepers",
      required:false,
      include:{
        association:"employee",
        required:false
      }
    });
  }

  const keeper = await employee.getKeeper();
  if (employee.superAdmin && await employee.getPlanningStaff()){
    const zooEvents = await ZooEvent.getAllZooEvents(
      new Date(startDate),
      new Date(endDate),
      _includes
    );
    return res.status(200).json({zooEvents:zooEvents.map(ze=>ze.toJSON())});
  }else if (keeper){
    const zooEvents = await keeper.getZooEvents({
      include:_includes
    });
    return res.status(200).json({zooEvents:zooEvents.map(ze=>ze.toJSON())});
  }

  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getZooEventById(req: Request, res: Response) {
  const { email } = (req as any).locals.jwtPayload;
  const employee = await findEmployeeByEmail(email);

  // Check authentication

  const { zooEventId } = req.params;
  try {
    const zooEvent = await ZooEvent.getZooEventById(Number(zooEventId));
    return res.status(200).json({zooEvent:zooEvent});
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateZooEventSingle(req: Request, res: Response) {
  const { email } = (req as any).locals.jwtPayload;
  const employee = await findEmployeeByEmail(email);

  // Check authentication

  const { zooEventDetails } = req.body;

   const {zooEventId} = req.params;

  if ([
    zooEventId,
    zooEventDetails, 
  ].includes(undefined)) {
    console.log("Missing field(s): ", {
      zooEventId, 
      zooEventDetails
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  const field : any = {};

  for (const attribute of [
    "eventName", 
    "eventDescription",
    "eventIsPublic",
    "eventType",
    "eventTiming",
  ]){
    if (attribute in zooEventDetails) field[attribute] = zooEventDetails[attribute];
  }

  for (const attribute of [
    "eventNotificationDate", 
    "eventStartDateTime",
    "eventEndDateTime",
  ]){
    if (attribute in zooEventDetails) field[attribute] = new Date(zooEventDetails[attribute]);
  }
  if ("eventDurationHrs" in zooEventDetails) field["eventDurationHrs"] = Number(zooEventDetails["eventDurationHrs"]);
  try {
    const zooEvent = await ZooEvent.updateZooEventById(
      Number(zooEventId),
      field
    );
    return res.status(200).json({zooEvent:zooEvent.toJSON()});
  } catch (error: any) {
    console.log("error",error)
    res.status(400).json({ error: error.message });
  }
}

export async function updateZooEventIncludeFuture(req: Request, res: Response) {
  const { email } = (req as any).locals.jwtPayload;
  const employee = await findEmployeeByEmail(email);

  const { 
    eventName, 
    eventDescription,
    eventIsPublic,
    eventType,
    eventStartDateTime,
    requiredNumberOfKeeper,

    eventDurationHrs,
    eventTiming,
    
    eventNotificationDate,
    eventEndDateTime,
   } = req.body;

   const { zooEventId } = req.params;

  if ([
    eventName, 
    eventDescription,
    eventIsPublic,
    eventType,
    eventStartDateTime,
    requiredNumberOfKeeper,
    eventIsPublic,
  ].includes(undefined) || zooEventId == "") {
    console.log("Missing field(s): ", {
      zooEventId, 
      eventName, 
      eventDescription,
      eventIsPublic,
      eventType,
      details: (eventIsPublic? [eventDurationHrs, eventTiming]:[eventNotificationDate, eventEndDateTime]),
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const newZooEvent = await ZooEvent.updateZooEventIncludeFuture(
      Number(zooEventId),
      eventName, 
      eventDescription,
      eventIsPublic,
      eventType,
      eventStartDateTime,
      requiredNumberOfKeeper,
  
      eventDurationHrs,
      eventTiming,
      
      eventIsPublic? new Date(eventNotificationDate) : new Date(),
      eventIsPublic ? new Date(eventEndDateTime) : new Date(),
    );
    return res.status(200).json({zooEvent:newZooEvent.toJSON()});
  } catch (error: any) {
    console.log("error",error)
    res.status(400).json({ error: error.message });
  }
}

export async function assignZooEventKeeper(req: Request, res: Response) {
  const { email } = (req as any).locals.jwtPayload;
  const employee = await findEmployeeByEmail(email);

  const { 
    zooEventIds, 
    employeeIds,
   } = req.body;


  if ([
    zooEventIds, 
    employeeIds,
  ].includes(undefined)) {

    console.log("Missing field(s): ", {
      zooEventIds, 
      employeeIds,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    await ZooEvent.assignZooEventKeeper(
      zooEventIds.map((zooEventId:string) => Number(zooEventId)),
      employeeIds.map((employeeId:string) => Number(employeeId)),
    );
    return res.status(200).json({result:"success"});
  } catch (error: any) {
    console.log("error",error)
    res.status(400).json({ error: error.message });
  }
}

export async function removeKeeperfromZooEvent(req: Request, res: Response) {
  const { email } = (req as any).locals.jwtPayload;
  const employee = await findEmployeeByEmail(email);

  const { 
    zooEventIds, 
    employeeIds,
   } = req.body;


  if ([
    zooEventIds, 
    employeeIds,
  ].includes(undefined)) {

    console.log("Missing field(s): ", {
      zooEventIds, 
      employeeIds,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    await ZooEvent.removeKeeperfromZooEvent(
      zooEventIds.map((zooEventId:string) => Number(zooEventId)),
      employeeIds.map((employeeId:string) => Number(employeeId)),
    );
    return res.status(200).json({result:"success"});
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function autoAssignKeeperToZooEvent(req: Request, res: Response){
    try {
      const { email } = (req as any).locals.jwtPayload;
      const employee = await findEmployeeByEmail(email);
  
      if (!employee.superAdmin && (
        !(
          (await employee.getPlanningStaff())?.plannerType ==
          PlannerType.OPERATIONS_MANAGER
        ) &&
        !(await employee.getGeneralStaff()))
      )
        return res
          .status(403)
          .json({ error: "Access Denied! Operation managers only!" });



      return res.status(200).json({zooEvents : await ZooEvent.autoAssignKeeperToZooEvent()});
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }

}

export async function deleteZooEvent(req: Request, res: Response) {
  const { email } = (req as any).locals.jwtPayload;
  const employee = await findEmployeeByEmail(email);

  // Check authentication
   const {zooEventId} = req.params;

  try {
    const newZooEvent = await ZooEvent.deleteZooEvent(
      Number(zooEventId)
    );
    return res.status(200).json({result:"success"});
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getKeepersForZooEvent(req: Request, res: Response) {
  const { email } = (req as any).locals.jwtPayload;
  const employee = await findEmployeeByEmail(email);

  // Check authentication
   const {zooEventId} = req.params;

  try {
    const [availiableKeepers, currentKeepers] = await ZooEvent.getKeepersForZooEvent(
      Number(zooEventId)
    );
    return res.status(200).json({
      availiableKeepers:availiableKeepers,
      currentKeepers:currentKeepers
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function createEmployeeAbsence(req: Request, res: Response) {
  const { email } = (req as any).locals.jwtPayload;
  const employee = await findEmployeeByEmail(email);

  // Check authentication
  const { employeeId } = req.params;
  const { eventName, eventDescription, eventStartDate, eventEndDate } = req.body;

  if (
    [
      employeeId,
      eventName,
      eventDescription,
      eventStartDate,
      eventEndDate
    ].includes(undefined)
  ) {
    console.log("Missing field(s): ", {
      employeeId,
      eventName,
      eventDescription,
      eventStartDate,
      eventEndDate
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  const eventStartDateTimes:Date[] = [];
  const sDT = new Date(eventStartDate);
  let eDT = new Date(eventEndDate);
  eDT = new Date(eDT.getFullYear(), eDT.getMonth(), eDT.getDate(), 0, 0, 0, 0);
  let dateLoop = new Date(sDT.getFullYear(), sDT.getMonth(), sDT.getDate(), 0, 0, 0, 0);
  while (compareDates(eDT, dateLoop)>= 0){
    eventStartDateTimes.push(dateLoop);
    dateLoop =new Date(dateLoop.getTime() + DAY_IN_MILLISECONDS);
  }

  try {
    const zooEvents = await ZooEvent.createEmployeeAbsence(
      Number(employeeId),
      eventName,
      eventDescription,
      eventStartDateTimes
    );
    return res.status(200).json({zooEvents : zooEvents.map(ze=>ze.toJSON())});
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllEmployeeAbsence(req: Request, res: Response) {
  const { email } = (req as any).locals.jwtPayload;
  const employee = await findEmployeeByEmail(email);

  // Check authentication

  try {
    const zooEvents = await ZooEvent.getAllEmployeeAbsence();
    return res.status(200).json({zooEvents : zooEvents.map(ze=>ze.toJSON())});
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}


