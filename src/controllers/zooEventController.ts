import { Request, Response } from "express";
import { compareDates } from "../helpers/others";
import { DAY_IN_MILLISECONDS } from "../helpers/staticValues";
import { PlannerType, RecurringPattern } from "../models/Enumerated";
import { findEmployeeByEmail } from "../services/employeeService";
import * as ZooEventService from "../services/zooEventService";
import { handleFileUpload } from "../helpers/multerProcessFile";

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
    //     .json({ error: "Access Denied! Planning Staff only!" });

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
      if (includes.includes(role)) {
        _includes.push({
          association: role,
          required: false
        });
      }
    }

    if (includes.includes("feedingPlanSessionDetail")) {
      _includes.push({
        association: "feedingPlanSessionDetail",
        required: false,
        include: {
          association: "feedingPlan",
          required: false
        }
      });
    }

    if (includes.includes("keepers")) {
      _includes.push({
        association: "keepers",
        required: false,
        include: {
          association: "employee",
          required: false
        }
      });
    }

    const keeper = await employee.getKeeper();
    if (employee.superAdmin && await employee.getPlanningStaff()) {
      const zooEvents = await ZooEventService.getAllZooEvents(
        new Date(startDate),
        new Date(endDate),
        _includes
      );
      return res.status(200).json({ zooEvents: zooEvents.map(ze => ze.toJSON()) });
    } else if (keeper) {
      const zooEvents = await keeper.getZooEvents({
        include: _includes
      });
      return res.status(200).json({ zooEvents: zooEvents.map(ze => ze.toJSON()) });
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
    const zooEvent = await ZooEventService.getZooEventById(Number(zooEventId));
    return res.status(200).json({ zooEvent: zooEvent });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateZooEventSingle(req: Request, res: Response) {
  const { email } = (req as any).locals.jwtPayload;
  const employee = await findEmployeeByEmail(email);

  // Check authentication

  const { zooEventDetails } = req.body;

  const { zooEventId } = req.params;

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

  const field: any = {};

  for (const attribute of [
    "eventName",
    "eventDescription",
    "eventIsPublic",
    "eventType",
    "eventTiming",
  ]) {
    if (attribute in zooEventDetails) field[attribute] = zooEventDetails[attribute];
  }

  for (const attribute of [
    "eventNotificationDate",
    "eventStartDateTime",
    "eventEndDateTime",
  ]) {
    if (attribute in zooEventDetails) field[attribute] = new Date(zooEventDetails[attribute]);
  }
  if ("eventDurationHrs" in zooEventDetails) field["eventDurationHrs"] = Number(zooEventDetails["eventDurationHrs"]);
  try {
    const zooEvent = await ZooEventService.updateZooEventById(
      Number(zooEventId),
      field
    );
    return res.status(200).json({ zooEvent: zooEvent.toJSON() });
  } catch (error: any) {
    console.log("error", error)
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
      details: (eventIsPublic ? [eventDurationHrs, eventTiming] : [eventNotificationDate, eventEndDateTime]),
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const newZooEvent = await ZooEventService.updateZooEventIncludeFuture(
      Number(zooEventId),
      eventName,
      eventDescription,
      eventIsPublic,
      eventType,
      eventStartDateTime,
      requiredNumberOfKeeper,

      eventDurationHrs,
      eventTiming,

      eventIsPublic ? new Date(eventNotificationDate) : new Date(),
      eventIsPublic ? new Date(eventEndDateTime) : new Date(),
    );
    return res.status(200).json({ zooEvent: newZooEvent.toJSON() });
  } catch (error: any) {
    console.log("error", error)
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
    await ZooEventService.assignZooEventKeeper(
      zooEventIds.map((zooEventId: string) => Number(zooEventId)),
      employeeIds.map((employeeId: string) => Number(employeeId)),
    );
    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    console.log("error", error)
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
    await ZooEventService.removeKeeperfromZooEvent(
      zooEventIds.map((zooEventId: string) => Number(zooEventId)),
      employeeIds.map((employeeId: string) => Number(employeeId)),
    );
    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function autoAssignKeeperToZooEvent(req: Request, res: Response) {
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
        .json({ error: "Access Denied! Planning Staff only!" });

    const { endDate } = req.body;

    if (endDate === undefined) {
      console.log({ endDate });
      return res.status(400).json({ error: "Missing information!" })
    }

    return res.status(200).json({ zooEvents: await ZooEventService.autoAssignKeeperToZooEvent(new Date(endDate)) });
  } catch (error: any) {
    console.log("error", error);
    res.status(400).json({ error: error.message });
  }

}

export async function deleteZooEvent(req: Request, res: Response) {
  const { email } = (req as any).locals.jwtPayload;
  const employee = await findEmployeeByEmail(email);

  // Check authentication
  const { zooEventId } = req.params;

  try {
    const newZooEvent = await ZooEventService.deleteZooEvent(
      Number(zooEventId)
    );
    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getKeepersForZooEvent(req: Request, res: Response) {
  const { email } = (req as any).locals.jwtPayload;
  const employee = await findEmployeeByEmail(email);

  // Check authentication
  const { zooEventId } = req.params;

  try {
    const [availiableKeepers, currentKeepers] = await ZooEventService.getKeepersForZooEvent(
      Number(zooEventId)
    );
    return res.status(200).json({
      availiableKeepers: availiableKeepers,
      currentKeepers: currentKeepers
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

  const eventStartDateTimes: Date[] = [];
  const sDT = new Date(eventStartDate);
  let eDT = new Date(eventEndDate);
  eDT = new Date(eDT.getFullYear(), eDT.getMonth(), eDT.getDate(), 0, 0, 0, 0);
  let dateLoop = new Date(sDT.getFullYear(), sDT.getMonth(), sDT.getDate(), 0, 0, 0, 0);
  while (compareDates(eDT, dateLoop) >= 0) {
    eventStartDateTimes.push(dateLoop);
    dateLoop = new Date(dateLoop.getTime() + DAY_IN_MILLISECONDS);
  }
  console.log("eventStartDateTimes", eventStartDateTimes)
  try {
    const zooEvents = await ZooEventService.createEmployeeAbsence(
      Number(employeeId),
      eventName,
      eventDescription,
      eventStartDateTimes
    );
    return res.status(200).json({ zooEvents: zooEvents.map(ze => ze.toJSON()) });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllEmployeeAbsence(req: Request, res: Response) {
  const { email } = (req as any).locals.jwtPayload;
  const employee = await findEmployeeByEmail(email);

  // Check authentication

  try {
    const zooEvents = await ZooEventService.getAllEmployeeAbsence();
    return res.status(200).json({ zooEvents: zooEvents.map(ze => ze.toJSON()) });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}


export async function createPublicEvent(req: Request, res: Response) {
  try {

    // Check authentication
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);
    // const planningStaff = await employee.getPlanningStaff();

    if (
      !employee.superAdmin &&
      !(await employee.getPlanningStaff())
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Planning Staff only!" });

    const imageUrl = await handleFileUpload(
      req,
      process.env.IMG_URL_ROOT! + "zooEvent", //"D:/capstoneUploads/animalFeed",
    );

    const {
      eventType,
      title,
      details,
      startDate,
      endDate,
      animalCodes,
      keeperEmployeeIds,
      inHouseId,
    } = req.body;
    if (
      [
        eventType,
        title,
        details,
        startDate,
        animalCodes,
        keeperEmployeeIds,
        inHouseId,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        eventType,
        title,
        details,
        startDate,
        animalCodes,
        keeperEmployeeIds,
        inHouseId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }
    console.log("field(s): ", {
      eventType,
      title,
      details,
      startDate,
      animalCodes,
      keeperEmployeeIds,
      inHouseId,
    });

    const publicEvent = await ZooEventService.createPublicEvent(
      eventType,
      title,
      details,
      imageUrl,
      new Date(Number(startDate)),
      endDate ? new Date(Number(endDate)) : null,
      animalCodes,
      keeperEmployeeIds,
      Number(inHouseId),
    );
    return res.status(200).json({ publicEvent: publicEvent.toJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAllPublicEvents(req: Request, res: Response) {
  try {

    // Check authentication
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);
    // const planningStaff = await employee.getPlanningStaff();

    if (
      !employee.superAdmin &&
      !(await employee.getPlanningStaff())
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Planning Staff only!" });

    const publicEvents = await ZooEventService.getAllPublicEvents(
      [
        {
          association: "animals",
          required: false,
          include: [{
            association: "species",
            required: true
          }]
        },
        {
          association: "keepers",
          required: false,
          include: [{
            association: "employee",
            required: true
          }]
        },
        {
          association: "inHouse",
          required: false,
          include: [{
            association: "facility",
            required: true
          }]
        },
        {
          association: "publicEventSessions",
          required: false
        },

      ]
    );
    return res.status(200).json({ publicEvents: publicEvents.map(e => e.toJSON()) });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getPublicEventById(req: Request, res: Response) {
  try {

    // Check authentication
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);
    // const planningStaff = await employee.getPlanningStaff();

    if (
      !employee.superAdmin &&
      !(await employee.getPlanningStaff())
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Planning Staff only!" });

    const { publicEventId } = req.params;
    if (
      [publicEventId
      ].includes("")
    ) {
      console.log("Missing field(s): ", {
        publicEventId
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    const publicEvent = await ZooEventService.getPublicEventById(
      Number(publicEventId),
      [
        {
          association: "animals",
          required: false,
          include: [{
            association: "species",
            required: true
          }]
        }, {
          association: "keepers",
          required: false,
          include: [{
            association: "employee",
            required: true
          }]
        },
        {
          association: "inHouse",
          required: false,
          include: [{
            association: "facility",
            required: true
          }]
        },
        {
          association: "publicEventSessions",
          required: false
        }
      ]
    );
    return res.status(200).json({ publicEvent: publicEvent.toJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function updatePublicEventById(req: Request, res: Response) {
  try {

    // Check authentication
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);
    // const planningStaff = await employee.getPlanningStaff();

    if (
      !employee.superAdmin &&
      !(await employee.getPlanningStaff())
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Planning Staff only!" });

    const { publicEventId } = req.params;
    const {
      eventType,
      title,
      details,
      startDate,
      endDate,
      animalCodes,
      keeperEmployeeIds,
      inHouseId,
    } = req.body;

    if (
      [publicEventId,
        eventType,
        title,
        details,
        startDate,
        endDate,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        publicEventId,
        eventType,
        title,
        details,
        startDate,
        endDate,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    await ZooEventService.updatePublicEventById(
      Number(publicEventId),
      eventType,
      title,
      details,
      null,
      new Date(startDate),
      endDate ? new Date(endDate) : null,
      animalCodes,
      keeperEmployeeIds,
      inHouseId,
    );
    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function enablePublicEventById(req: Request, res: Response) {
  try {

    // Check authentication
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);
    // const planningStaff = await employee.getPlanningStaff();

    if (
      !employee.superAdmin &&
      !(await employee.getPlanningStaff())
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Planning Staff only!" });

    const { publicEventId } = req.params;

    if (
      publicEventId == "" || publicEventId === undefined
    ) {
      console.log("Missing field(s): ", {
        publicEventId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    await ZooEventService.enablePublicEventById(Number(publicEventId));

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function disablePublicEventById(req: Request, res: Response) {
  try {

    // Check authentication
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);
    // const planningStaff = await employee.getPlanningStaff();

    if (
      !employee.superAdmin &&
      !(await employee.getPlanningStaff())
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Planning Staff only!" });

    const { publicEventId } = req.params;

    if (
      publicEventId == "" || publicEventId === undefined
    ) {
      console.log("Missing field(s): ", {
        publicEventId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    await ZooEventService.disablePublicEventById(Number(publicEventId));

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function updatePublicEventImageById(req: Request, res: Response) {
  try {

    // Check authentication
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);
    // const planningStaff = await employee.getPlanningStaff();

    if (
      !employee.superAdmin &&
      !(await employee.getPlanningStaff())
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Planning Staff only!" });

    const { publicEventId } = req.params;

    const publicEvent = await ZooEventService.getPublicEventById(Number(publicEventId), []);

    const imageUrl = await handleFileUpload(
      req,
      process.env.IMG_URL_ROOT! + "zooEvent", //"D:/capstoneUploads/animalFeed",
    );



    await ZooEventService.updatePublicEventById(
      Number(publicEventId),
      publicEvent.eventType,
      publicEvent.title,
      publicEvent.details,
      imageUrl,
      new Date(publicEvent.startDate),
      publicEvent.endDate,
      null,
      null,
      null,
    );
    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}


export async function deletePublicEventById(req: Request, res: Response) {
  try {

    // Check authentication
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);
    // const planningStaff = await employee.getPlanningStaff();

    if (
      !employee.superAdmin &&
      !(await employee.getPlanningStaff())
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Planning Staff only!" });

    const { publicEventId } = req.params;

    if ([publicEventId].includes("")) {
      return res.status(400).json({ error: "Missing information!" });
    }

    const publicEvent = await ZooEventService.deletePublicEventById(Number(publicEventId));

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function createPublicEventSession(req: Request, res: Response) {
  try {

    // Check authentication
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);
    // const planningStaff = await employee.getPlanningStaff();

    if (
      !employee.superAdmin &&
      !(await employee.getPlanningStaff())
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Planning Staff only!" });

    const { publicEventId } = req.params;

    const {
      recurringPattern,
      dayOfWeek,
      dayOfMonth,
      durationInMinutes,
      time,
      daysInAdvanceNotification,
      oneDate
    } = req.body;
    if (
      [
        publicEventId,
        recurringPattern,
        durationInMinutes,
        time,
        daysInAdvanceNotification,
      ].includes(undefined) ||
      publicEventId == ""
    ) {
      console.log("Missing field(s): ", {
        publicEventId,
        recurringPattern,
        dayOfWeek,
        dayOfMonth,
        durationInMinutes,
        time,
        daysInAdvanceNotification,
        oneDate
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    const newPublicEventSession = await ZooEventService.createPublicEventSession(
      Number(publicEventId),
      recurringPattern,
      dayOfWeek,
      dayOfMonth,
      durationInMinutes,
      time,
      daysInAdvanceNotification,
      recurringPattern == RecurringPattern.NON_RECURRING ? new Date(oneDate) : null
    );
    return res.status(200).json({ publicEventSession: newPublicEventSession.toJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAllPublicEventSessions(req: Request, res: Response) {
  try {

    // Check authentication
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);
    // const planningStaff = await employee.getPlanningStaff();

    if (
      !employee.superAdmin &&
      !(await employee.getPlanningStaff())
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Planning Staff only!" });


    const publicEventSessions = await ZooEventService.getAllPublicEventSessions([
      {
        association: "publicEvent",
        require: false
      }, {
        association: "zooEvents",
        require: false
      },
    ]);

    return res.status(200).json({ publicEventSessions: publicEventSessions.map(session => session.toJSON()) });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAllPublicEventSessionsByPublicEventId(req: Request, res: Response) {
  try {

    // Check authentication
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);
    // const planningStaff = await employee.getPlanningStaff();

    if (
      !employee.superAdmin &&
      !(await employee.getPlanningStaff())
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Planning Staff only!" });

    const { publicEventId } = req.params;


    const publicEventSessions = await ZooEventService.getAllPublicEventSessions([
      {
        association: "publicEvent",
        require: true,
        where: {
          publicEventId: publicEventId
        }
      }, {
        association: "zooEvents",
        require: false
      },
    ]);

    return res.status(200).json({ publicEventSessions: publicEventSessions.map(session => session.toJSON()) });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getPublicEventSessionById(req: Request, res: Response) {
  try {

    // Check authentication
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);
    // const planningStaff = await employee.getPlanningStaff();

    if (
      !employee.superAdmin &&
      !(await employee.getPlanningStaff())
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Planning Staff only!" });

    const { publicEventSessionId } = req.params;

    if ([publicEventSessionId].includes("")) {
      return res.status(400).json({ error: "Missing information!" });
    }


    const publicEventSession = await ZooEventService.getPublicEventSessionById(Number(publicEventSessionId),
      [
        {
          association: "publicEvent",
          require: false
        }, {
          association: "zooEvents",
          require: false
        },
      ]);

    return res.status(200).json({ publicEventSession: publicEventSession });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function updatePublicEventSessionById(req: Request, res: Response) {
  try {

    // Check authentication
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);
    // const planningStaff = await employee.getPlanningStaff();

    if (
      !employee.superAdmin &&
      !(await employee.getPlanningStaff())
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Planning Staff only!" });

    const { publicEventSessionId } = req.params;
    const {
      recurringPattern,
      dayOfWeek,
      dayOfMonth,
      durationInMinutes,
      time,
      daysInAdvanceNotification
    } = req.body;

    if ([
      recurringPattern,
      durationInMinutes,
      time,
      daysInAdvanceNotification
    ].includes(undefined) || publicEventSessionId == "") {
      console.log({
        recurringPattern,
        dayOfWeek,
        dayOfMonth,
        durationInMinutes,
        time,
        daysInAdvanceNotification
      })
      return res.status(400).json({ error: "Missing information!" });
    }


    await ZooEventService.updatePublicEventSessionById(
      Number(publicEventSessionId),
      recurringPattern,
      dayOfWeek,
      dayOfMonth,
      durationInMinutes,
      time,
      daysInAdvanceNotification
    );

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function deletePublicEventSessionById(req: Request, res: Response) {
  try {

    // Check authentication
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);
    // const planningStaff = await employee.getPlanningStaff();

    if (
      !employee.superAdmin &&
      !(await employee.getPlanningStaff())
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Planning Staff only!" });

    const { publicEventSessionId } = req.params;
    if (publicEventSessionId == "") {
      return res.status(400).json({ error: "Missing information!" });
    }


    await ZooEventService.deletePublicEventSessionById(
      Number(publicEventSessionId),
    );

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}
