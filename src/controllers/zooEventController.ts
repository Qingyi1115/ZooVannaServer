import { Request, Response } from "express";
import * as ZooEvent from "../services/zooEvent";
import { findEmployeeByEmail } from "../services/employee";

export async function getAllZooEvents(req: Request, res: Response) {
  const { email } = (req as any).locals.jwtPayload;
  const employee = await findEmployeeByEmail(email);

  // Check authentication

  const { includes = [] } = req.body;

  const _includes: string[] = [];
  for (const role of [
    "planningStaff",
    "keepers",
    "enclosure",
    "animal",
    "inHouse",
    "animalActivitySession",
  ]) {
    if (includes.includes(role)) _includes.push(role);
  }

  try {
    const zooEvents = await ZooEvent.getAllZooEvents(_includes);
    return res.status(200).json({zooEvents:zooEvents});
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getZooEvent(req: Request, res: Response) {
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

export async function createNewInternalZooEvent(req: Request, res: Response) {
  const { email } = (req as any).locals.jwtPayload;
  const employee = await findEmployeeByEmail(email);

  // Check authentication

  const { 
    eventName, 
    eventNotificationDate,
    eventStartDateTime,
    eventEndDateTime,
    eventDurationHrs,
    isFlexible,
    eventTiming,
    eventDescription,
    eventIsPublic,
    eventType,
    planningStaffEmployeeId,
    animalActivitySessionId,
   } = req.body;

  if ([
    eventName, 
    eventNotificationDate,
    eventStartDateTime,
    eventEndDateTime,
    eventDurationHrs,
    isFlexible,
    eventTiming,
    eventDescription,
    eventIsPublic,
    eventType,
    planningStaffEmployeeId,
    animalActivitySessionId
  ].includes(undefined)) {
    console.log("Missing field(s): ", {
      eventName, 
      eventNotificationDate,
      eventStartDateTime,
      eventEndDateTime,
      eventDurationHrs,
      isFlexible,
      eventTiming,
      eventDescription,
      eventIsPublic,
      eventType,
      planningStaffEmployeeId,
      animalActivitySessionId
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const newZooEvent = await ZooEvent.createNewInternalZooEvent(
      eventName, 
      new Date(eventNotificationDate),
      new Date(eventStartDateTime),
      new Date(eventEndDateTime),
      Number(eventDurationHrs),
      isFlexible,
      eventTiming,
      eventDescription,
      eventIsPublic,
      eventType,
      Number(planningStaffEmployeeId),
      Number(animalActivitySessionId)
    );
    return res.status(200).json({zooEvent:newZooEvent});
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateZooEventDetails(req: Request, res: Response) {
  const { email } = (req as any).locals.jwtPayload;
  const employee = await findEmployeeByEmail(email);

  // Check authentication

  const { 
    eventName, 
    eventNotificationDate,
    eventStartDateTime,
    eventEndDateTime,
    eventDurationHrs,
    isFlexible,
    eventTiming,
    eventDescription,
    eventIsPublic,
    eventType
   } = req.body;

   const {zooEventId} = req.params;

  if ([
    zooEventId,
    eventName, 
    eventNotificationDate,
    eventStartDateTime,
    eventEndDateTime,
    eventDurationHrs,
    isFlexible,
    eventTiming,
    eventDescription,
    eventIsPublic,
    eventType
  ].includes(undefined)) {
    console.log("Missing field(s): ", {
      eventName, 
      eventNotificationDate,
      eventStartDateTime,
      eventEndDateTime,
      eventDurationHrs,
      isFlexible,
      eventTiming,
      eventDescription,
      eventIsPublic,
      eventType
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const newZooEvent = await ZooEvent.updateZooEventDetails(
      Number(zooEventId),
      eventName, 
      new Date(eventNotificationDate),
      new Date(eventStartDateTime),
      new Date(eventEndDateTime),
      Number(eventDurationHrs),
      isFlexible,
      eventTiming,
      eventDescription,
      eventIsPublic,
      eventType
    );
    return res.status(200).json({zooEvent:newZooEvent});
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
