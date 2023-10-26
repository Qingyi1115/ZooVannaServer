import { Request, Response } from "express";
import * as ZooEvent from "../services/zooEvent";
import { findEmployeeByEmail } from "../services/employee";
import { PlannerType } from "../models/enumerated";

export async function getAllZooEvents(req: Request, res: Response) {
  const { email } = (req as any).locals.jwtPayload;
  const employee = await findEmployeeByEmail(email);

  // Check authentication

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
    "keepers",
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

  try {
    const zooEvents = await ZooEvent.getAllZooEvents(
      new Date(startDate),
      new Date(endDate),
      _includes
    );
    return res.status(200).json({zooEvents:zooEvents.map(ze=>ze.toJSON())});
  } catch (error: any) {
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
      
      eventNotificationDate,
      eventEndDateTime,
    );
    return res.status(200).json({zooEvent:newZooEvent});
  } catch (error: any) {
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
      zooEventIds.forEach((zooEventId:string) => Number(zooEventId)),
      employeeIds.forEach((employeeId:string) => Number(employeeId)),
    );
    return res.status(200).json({result:"success"});
  } catch (error: any) {
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
      zooEventIds.forEach((zooEventId:string) => Number(zooEventId)),
      employeeIds.forEach((employeeId:string) => Number(employeeId)),
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
