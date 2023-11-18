import { Op } from "Sequelize";
import cron from "node-cron";
import { validationErrorHandler } from "../helpers/errorHandler";
import {
  compareDates,
  getNextDayOfMonth,
  getNextDayOfWeek,
} from "../helpers/others";
import {
  ADVANCE_DAYS_FOR_ZOO_EVENT_GENERATION,
  ANIMAL_ACTIVITY_NOTIFICATION_HOURS,
  ANIMAL_FEEDING_NOTIFICATION_HOURS,
  DAY_IN_MILLISECONDS,
  HOUR_IN_MILLISECONDS,
  MINUTES_IN_MILLISECONDS,
} from "../helpers/staticValues";
import { Employee } from "../models/Employee";
import {
  ActivityType,
  DayOfWeek,
  EventTimingType,
  EventType,
  RecurringPattern,
} from "../models/Enumerated";
import { Keeper } from "../models/Keeper";
import { ZooEvent } from "../models/ZooEvent";
import * as AnimalService from "./animalService";
import * as EmployeeService from "./employeeService";
import * as AssetFacilityService from "./assetFacilityService";
import { PublicEvent } from "../models/PublicEvent";
import { PublicEventSession } from "../models/PublicEventSession";
import { InHouse } from "../models/InHouse";
import { Animal } from "../models/Animal";

cron.schedule("0 0 0 1 1 *", async () => {
  for (const animalAct of await AnimalService.getAllAnimalActivities()) {
    generateMonthlyZooEventForAnimalActivity(animalAct.animalActivityId);
  }

  for (const feedingplansessiondetail of await AnimalService.getAllFeedingPlanSessionDetails()) {
    generateMonthlyZooEventForFeedingPlanSession(
      feedingplansessiondetail.feedingPlanSessionDetailId,
    );
  }

  for (const publicEvent of (await getAllPublicEvents()).filter(
    (ev) => ev.endDate && compareDates(ev.endDate, new Date()) >= 0,
  )) {
    generateMonthlyZooEventForPublicEvent(publicEvent.publicEventId);
  }
});

function loopCallbackDateIntervals(
  callback: Function,
  startDate: Date,
  endDate: Date,
  interval: number,
  isMonthly: boolean,
): Promise<any>[] {
  let promises: Promise<any>[] = [];
  while (compareDates(startDate, endDate) <= 0) {
    promises.push(callback(startDate));
    if (!isMonthly) {
      startDate = new Date(startDate.getTime() + interval);
    } else {
      let lastday = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + (interval > 0 ? 2 : 0),
        0,
      ).getDate();
      startDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + (interval > 0 ? 1 : -1),
        Math.min(lastday, interval),
      );
    }
  }
  return promises;
}

export async function generateMonthlyZooEventForAnimalActivity(
  animalActivityId: number,
) {
  const animalActivity =
    await AnimalService.getAnimalActivityById(animalActivityId);
  const zooEvents = await animalActivity.getZooEvents();

  let startDate =
    compareDates(new Date(), animalActivity.startDate) > 0
      ? new Date()
      : animalActivity.startDate;
  startDate = new Date(
    Date.UTC(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
    ),
  );
  if (zooEvents.length > 0) {
    const latestEventDate = zooEvents.reduce((a, b) =>
      compareDates(a.eventStartDateTime, b.eventStartDateTime) > 0 ? a : b,
    ).eventStartDateTime;
    startDate =
      compareDates(latestEventDate, startDate) > 0
        ? latestEventDate
        : startDate;
    let lastday = new Date(
      Date.UTC(startDate.getFullYear(), startDate.getMonth() + 1, 0),
    ).getDate();

    startDate =
      animalActivity.recurringPattern == RecurringPattern.DAILY
        ? new Date(startDate.getTime() + DAY_IN_MILLISECONDS)
        : animalActivity.recurringPattern == RecurringPattern.WEEKLY
          ? new Date(startDate.getTime() + DAY_IN_MILLISECONDS * 7)
          : animalActivity.recurringPattern == RecurringPattern.MONTHLY
            ? new Date(
              Date.UTC(
                startDate.getFullYear(),
                startDate.getMonth() + 1,
                Math.min(lastday, animalActivity.dayOfMonth || 1),
              ),
            )
            : startDate;
  }

  if (compareDates(new Date(), animalActivity.endDate) > 0)
    return animalActivity;
  let lastDate =
    compareDates(
      new Date(
        Date.now() +
        DAY_IN_MILLISECONDS * ADVANCE_DAYS_FOR_ZOO_EVENT_GENERATION,
      ),
      animalActivity.endDate,
    ) < 0
      ? new Date(
        Date.now() +
        DAY_IN_MILLISECONDS * ADVANCE_DAYS_FOR_ZOO_EVENT_GENERATION,
      )
      : animalActivity.endDate;
  lastDate = new Date(
    Date.UTC(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate()),
  );

  let interval = 0;
  switch (animalActivity.recurringPattern) {
    case RecurringPattern.DAILY:
      interval = DAY_IN_MILLISECONDS;
      break;
    case RecurringPattern.WEEKLY:
      interval = DAY_IN_MILLISECONDS * 7;
      break;
  }

  let iKeepMyPromises: Promise<any>[] = [];

  if (animalActivity.recurringPattern == RecurringPattern.NON_RECURRING) {
    if (zooEvents.length == 0) {
      iKeepMyPromises.push(
        createAnimalActivityZooEvent(
          animalActivity.animalActivityId,
          animalActivity.startDate,
          animalActivity.durationInMinutes,
          animalActivity.eventTimingType,
          animalActivity.details,
          animalActivity.requiredNumberOfKeeper,
        ),
      );
    }
  } else if (animalActivity.recurringPattern == RecurringPattern.MONTHLY) {
    if (!animalActivity.dayOfMonth)
      throw { error: "animalActivity day of month missing!" };
    iKeepMyPromises = loopCallbackDateIntervals(
      (date: Date) => {
        return createAnimalActivityZooEvent(
          animalActivity.animalActivityId,
          date,
          animalActivity.durationInMinutes,
          animalActivity.eventTimingType,
          animalActivity.details,
          animalActivity.requiredNumberOfKeeper,
        );
      },
      getNextDayOfMonth(startDate, animalActivity.dayOfMonth),
      lastDate,
      animalActivity.dayOfMonth,
      true,
    );
  } else {
    let dayOfWeekNumber = 0;
    switch (animalActivity.dayOfWeek) {
      case DayOfWeek.MONDAY:
        dayOfWeekNumber = 1;
        break;
      case DayOfWeek.TUESDAY:
        dayOfWeekNumber = 2;
        break;
      case DayOfWeek.WEDNESDAY:
        dayOfWeekNumber = 3;
        break;
      case DayOfWeek.THURSDAY:
        dayOfWeekNumber = 4;
        break;
      case DayOfWeek.FRIDAY:
        dayOfWeekNumber = 5;
        break;
      case DayOfWeek.SATURDAY:
        dayOfWeekNumber = 6;
        break;
    }
    iKeepMyPromises = loopCallbackDateIntervals(
      (date: Date) => {
        return createAnimalActivityZooEvent(
          animalActivity.animalActivityId,
          date,
          animalActivity.durationInMinutes,
          animalActivity.eventTimingType,
          animalActivity.details,
          animalActivity.requiredNumberOfKeeper,
        );
      },
      animalActivity.recurringPattern == RecurringPattern.WEEKLY
        ? getNextDayOfWeek(startDate, dayOfWeekNumber)
        : startDate,
      lastDate,
      interval,
      false,
    );
  }

  for (const p of iKeepMyPromises) {
    await p;
  }
  return animalActivity;
}

export async function createPublicSessionZooEvent(
  publicEventSessionId: number,
  date: Date,
  durationInMinutes: number,
  daysInAdvanceNotification: number,
  details: string,
  title: string,
  imageUrl: string,
  eventType: EventType,
  keepers: Keeper[],
  inHouse: InHouse,
  animals: Animal[],
) {
  const publicEventSession =
    await getPublicEventSessionById(publicEventSessionId);
  const newZooEvent = await ZooEvent.create({
    eventName: title,
    eventDescription: details,
    eventIsPublic: true,
    eventType: eventType,
    eventStartDateTime: date,
    eventNotificationDate: new Date(
      date.getTime() - daysInAdvanceNotification * DAY_IN_MILLISECONDS,
    ),
    requiredNumberOfKeeper: keepers.length,
    eventEndDateTime: new Date(
      date.getTime() + durationInMinutes * MINUTES_IN_MILLISECONDS,
    ),
    imageUrl: imageUrl,
  });

  await newZooEvent.setPublicEventSession(publicEventSession);
  await newZooEvent.setInHouse(inHouse);
  await newZooEvent.setAnimals(animals);
}

async function generateMonthlyZooEventForPublicEventSession(
  session: PublicEventSession,
) {
  const publicEvent = await session.getPublicEvent();
  const zooEvents = await session.getZooEvents();
  const keepers = await publicEvent.getKeepers();
  const inHouse = await publicEvent.getInHouse();
  const animals = await publicEvent.getAnimals();

  let startDate =
    compareDates(new Date(), publicEvent.startDate) > 0
      ? new Date()
      : publicEvent.startDate;
  startDate = new Date(
    Date.UTC(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
    ),
  );
  const time = session.time.split(":").map((numStr) => Number(numStr));

  if (zooEvents.length > 0) {
    const latestEventDate = zooEvents.reduce((a, b) =>
      compareDates(a.eventStartDateTime, b.eventStartDateTime) > 0 ? a : b,
    ).eventStartDateTime;
    startDate =
      compareDates(latestEventDate, startDate) > 0
        ? latestEventDate
        : startDate;
    let lastday = new Date(
      Date.UTC(startDate.getFullYear(), startDate.getMonth() + 1, 0),
    ).getDate();

    startDate =
      session.recurringPattern == RecurringPattern.DAILY
        ? new Date(startDate.getTime() + DAY_IN_MILLISECONDS)
        : session.recurringPattern == RecurringPattern.WEEKLY
          ? new Date(startDate.getTime() + DAY_IN_MILLISECONDS * 7)
          : session.recurringPattern == RecurringPattern.MONTHLY
            ? new Date(
              Date.UTC(
                startDate.getFullYear(),
                startDate.getMonth() + 1,
                Math.min(lastday, session.dayOfMonth || 1),
              ),
            )
            : startDate;
  }

  if (publicEvent.endDate && compareDates(new Date(), publicEvent.endDate) > 0)
    return;
  let lastDate = !publicEvent.endDate
    ? new Date(
      Date.now() +
      DAY_IN_MILLISECONDS * ADVANCE_DAYS_FOR_ZOO_EVENT_GENERATION,
    )
    : compareDates(
      new Date(
        Date.now() +
        DAY_IN_MILLISECONDS * ADVANCE_DAYS_FOR_ZOO_EVENT_GENERATION,
      ),
      publicEvent.endDate,
    ) < 0
      ? new Date(
        Date.now() +
        DAY_IN_MILLISECONDS * ADVANCE_DAYS_FOR_ZOO_EVENT_GENERATION,
      )
      : publicEvent.endDate;
  lastDate = new Date(
    Date.UTC(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate()),
  );

  let interval = 0;
  switch (session.recurringPattern) {
    case RecurringPattern.DAILY:
      interval = DAY_IN_MILLISECONDS;
      break;
    case RecurringPattern.WEEKLY:
      interval = DAY_IN_MILLISECONDS * 7;
      break;
  }

  let iKeepMyPromises: Promise<any>[] = [];

  if (session.recurringPattern == RecurringPattern.NON_RECURRING) {
    return;
  } else if (session.recurringPattern == RecurringPattern.MONTHLY) {
    if (!session.dayOfMonth) throw { error: "session day of month missing!" };

    const startDT = getNextDayOfMonth(startDate, session.dayOfMonth);
    startDT.setHours(time[0], time[1]);
    iKeepMyPromises = loopCallbackDateIntervals(
      (date: Date) => {
        return createPublicSessionZooEvent(
          session.publicEventSessionId,
          date,
          session.durationInMinutes,
          session.daysInAdvanceNotification,
          publicEvent.details,
          publicEvent.title,
          publicEvent.imageUrl,
          publicEvent.eventType,
          keepers,
          inHouse,
          animals,
        );
      },
      startDT,
      lastDate,
      session.dayOfMonth,
      true,
    );
  } else {
    let dayOfWeekNumber = 0;
    switch (session.dayOfWeek) {
      case DayOfWeek.MONDAY:
        dayOfWeekNumber = 1;
        break;
      case DayOfWeek.TUESDAY:
        dayOfWeekNumber = 2;
        break;
      case DayOfWeek.WEDNESDAY:
        dayOfWeekNumber = 3;
        break;
      case DayOfWeek.THURSDAY:
        dayOfWeekNumber = 4;
        break;
      case DayOfWeek.FRIDAY:
        dayOfWeekNumber = 5;
        break;
      case DayOfWeek.SATURDAY:
        dayOfWeekNumber = 6;
        break;
    }
    const startDT =
      session.recurringPattern == RecurringPattern.WEEKLY
        ? getNextDayOfWeek(startDate, dayOfWeekNumber)
        : startDate;
    startDT.setHours(time[0], time[1]);

    iKeepMyPromises = loopCallbackDateIntervals(
      (date: Date) => {
        return createPublicSessionZooEvent(
          session.publicEventSessionId,
          date,
          session.durationInMinutes,
          session.daysInAdvanceNotification,
          publicEvent.details,
          publicEvent.title,
          publicEvent.imageUrl,
          publicEvent.eventType,
          keepers,
          inHouse,
          animals,
        );
      },
      startDT,
      lastDate,
      interval,
      false,
    );
  }

  for (const p of iKeepMyPromises) {
    await p;
  }
  return session;
}

export async function generateMonthlyZooEventForPublicEvent(
  publicEventId: number,
) {
  const publicEvent = await getPublicEventById(publicEventId, []);
  const promises: Promise<any>[] = [];
  (await publicEvent.getPublicEventSessions())
    .filter(
      (session) => session.recurringPattern != RecurringPattern.NON_RECURRING,
    )
    .forEach((session) =>
      promises.push(generateMonthlyZooEventForPublicEventSession(session)),
    );
  for (const p of promises) await p;
}

export async function createAnimalActivityZooEvent(
  animalActivityId: number,
  eventStartDateTime: Date,
  eventDurationHrs: number,
  eventTiming: EventTimingType | null,
  eventDescription: string,
  requiredNumberOfKeeper: number,
) {
  const animalActivity =
    await AnimalService.getAnimalActivityById(animalActivityId);
  const imageURL = (await (await animalActivity.getAnimals())[0]?.getSpecies())
    ?.imageUrl;

  try {
    const newZooEvent = await ZooEvent.create({
      eventName: animalActivity.title,
      eventDescription: eventDescription,
      eventIsPublic: false,
      eventType: animalActivity.activityType as any,
      eventStartDateTime: eventStartDateTime,
      eventNotificationDate: new Date(
        eventStartDateTime.getTime() -
        HOUR_IN_MILLISECONDS * ANIMAL_ACTIVITY_NOTIFICATION_HOURS,
      ),
      eventDurationHrs: eventDurationHrs,
      eventTiming: eventTiming,
      eventEndDateTime: null,
      requiredNumberOfKeeper: requiredNumberOfKeeper,
      imageUrl: imageURL,
    });

    await newZooEvent.setAnimals(await animalActivity.getAnimals());
    await newZooEvent.setEnclosure(
      await (await animalActivity.getAnimals())[0]?.getEnclosure(),
    );

    await animalActivity.addZooEvent(newZooEvent);
    return animalActivity;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function generateMonthlyZooEventForFeedingPlanSession(
  feedingPlanSessionDetailId: number,
) {
  const feedingPlanSessionDetail =
    await AnimalService.getFeedingPlanSessionDetailById(
      feedingPlanSessionDetailId,
    );
  const feedingPlan = await feedingPlanSessionDetail.getFeedingPlan();
  const zooEvents = await feedingPlanSessionDetail.getZooEvents();

  // Get start date for the generation
  let startDate =
    compareDates(new Date(), feedingPlan.startDate) > 0
      ? new Date()
      : feedingPlan.startDate;
  startDate = new Date(
    Date.UTC(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
    ),
  );
  if (zooEvents.length > 0) {
    const latestEventDate = zooEvents.reduce((a, b) =>
      compareDates(a.eventStartDateTime, b.eventStartDateTime) > 0 ? a : b,
    ).eventStartDateTime;
    startDate =
      compareDates(latestEventDate, startDate) > 0
        ? latestEventDate
        : startDate;
    startDate = new Date(startDate.getTime() + DAY_IN_MILLISECONDS * 7);
  }

  // Get end date for generation
  if (compareDates(new Date(), feedingPlan.endDate) > 0)
    return feedingPlanSessionDetail;
  let lastDate =
    compareDates(
      new Date(
        Date.now() +
        DAY_IN_MILLISECONDS * ADVANCE_DAYS_FOR_ZOO_EVENT_GENERATION,
      ),
      feedingPlan.endDate,
    ) < 0
      ? new Date(
        Date.now() +
        DAY_IN_MILLISECONDS * ADVANCE_DAYS_FOR_ZOO_EVENT_GENERATION,
      )
      : feedingPlan.endDate;
  lastDate = new Date(
    Date.UTC(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate()),
  );

  let interval = DAY_IN_MILLISECONDS * 7;

  let iKeepMyPromises: Promise<any>[] = [];

  let dayOfWeekNumber = 0;
  switch (feedingPlanSessionDetail.dayOfWeek) {
    case DayOfWeek.MONDAY:
      dayOfWeekNumber = 1;
      break;
    case DayOfWeek.TUESDAY:
      dayOfWeekNumber = 2;
      break;
    case DayOfWeek.WEDNESDAY:
      dayOfWeekNumber = 3;
      break;
    case DayOfWeek.THURSDAY:
      dayOfWeekNumber = 4;
      break;
    case DayOfWeek.FRIDAY:
      dayOfWeekNumber = 5;
      break;
    case DayOfWeek.SATURDAY:
      dayOfWeekNumber = 6;
      break;
  }

  iKeepMyPromises = loopCallbackDateIntervals(
    (date: Date) => {
      return createFeedingPlanSessionDetailZooEvent(
        feedingPlanSessionDetail.feedingPlanSessionDetailId,
        date,
        feedingPlanSessionDetail.durationInMinutes / 60,
        feedingPlanSessionDetail.eventTimingType,
        feedingPlan.feedingPlanDesc,
        feedingPlanSessionDetail.isPublic,
        feedingPlanSessionDetail.publicEventStartTime || "",
        feedingPlanSessionDetail.requiredNumberOfKeeper,
      );
    },
    getNextDayOfWeek(startDate, dayOfWeekNumber),
    lastDate,
    interval,
    false,
  );

  for (const p of iKeepMyPromises) {
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
  requiredNumberOfKeeper: number,
) {
  const feedingPlanSessionDetail =
    await AnimalService.getFeedingPlanSessionDetailById(
      feedingPlanSessionDetailId,
    );
  const feedingPlan = await feedingPlanSessionDetail.getFeedingPlan();
  const imageUrl = (await (await feedingPlan.getAnimals())[0]?.getSpecies())
    ?.imageUrl;
  try {
    if (eventIsPublic) {
      eventStartDateTime.setHours(
        parseInt(publicEventStartTime?.substring(0, 2)),
      );
      eventStartDateTime.setMinutes(
        parseInt(publicEventStartTime?.substring(3, 5)),
      );
    }
    const newZooEvent = await ZooEvent.create({
      eventName:
        "Feeding session for " + (await feedingPlan.getSpecies()).aliasName,
      eventStartDateTime: eventStartDateTime,
      eventDurationHrs: eventDurationHrs,
      eventTiming: eventTiming,
      eventDescription: eventDescription,
      eventIsPublic: eventIsPublic,
      eventType: eventIsPublic
        ? EventType.CUSTOMER_FEEDING
        : EventType.EMPLOYEE_FEEDING,
      eventNotificationDate: new Date(
        eventStartDateTime.getTime() -
        HOUR_IN_MILLISECONDS * ANIMAL_FEEDING_NOTIFICATION_HOURS,
      ),
      requiredNumberOfKeeper: requiredNumberOfKeeper,
      eventEndDateTime: eventIsPublic
        ? new Date(
          eventStartDateTime.getTime() +
          eventDurationHrs * HOUR_IN_MILLISECONDS,
        )
        : null,
      imageUrl: eventIsPublic ? imageUrl : undefined,
    });

    newZooEvent.setAnimals(await feedingPlan.getAnimals());
    newZooEvent.setEnclosure(
      await (await feedingPlan.getAnimals())[0]?.getEnclosure(),
    );

    await feedingPlanSessionDetail.addZooEvent(newZooEvent);
    return feedingPlanSessionDetail;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getZooEventById(zooEventId: number) {
  try {
    const zooEvent = await ZooEvent.findOne({
      where: { zooEventId: zooEventId },
      include: [
        {
          association: "planningStaff",
          required: false,
          include: [
            {
              association: "employee",
              required: false,
            },
          ],
        },
        {
          association: "keepers",
          required: false,
          include: [
            {
              association: "employee",
              required: false,
            },
            {
              association: "zooEvents",
              required: false,
            },
          ],
        },
        {
          association: "animals",
          required: false,
        },
        {
          association: "inHouse",
          required: false,
          include: [
            {
              association: "facility",
              required: false,
            },
          ],
        },
        {
          association: "animalActivity",
          required: false,
          include: [
            {
              association: "enrichmentItems",
              required: false,
            },
          ],
        },
        {
          association: "feedingPlanSessionDetail",
          required: false,
          include: [
            {
              association: "feedingPlan",
              required: false,
            },
          ],
        },
        {
          association: "enclosure",
          required: false,
        },
        {
          association: "publicEventSession",
          required: false,
          include: [
            {
              association: "publicEvent",
              required: false,
            },
          ],
        }, {
          association: "employee",
          required: false,
        }
      ],
    });

    if (!zooEvent) throw { message: "Zoo event not found id:" + zooEventId };

    return zooEvent;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deleteZooEvent(zooEventId: number) {
  try {
    const zooEvent = await ZooEvent.findOne({
      where: { zooEventId: zooEventId },
    });
    if (!zooEvent)
      throw { message: "Unable to find Zoo Event with Id: " + zooEventId };

    return await zooEvent.destroy();
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getKeepersForZooEvent(zooEventId: number) {
  try {
    const zooEvent = await getZooEventById(zooEventId);
    const currentKeepers = zooEvent.keepers;

    let availiableKeepers = (
      await Keeper.findAll({
        include: [
          {
            association: "employee",
          },
          {
            association: "zooEvents",
            required: false,
          },
          {
            association: "enclosures",
            required: false,
          },
        ],
      })
    ).filter(
      (keeper) =>
        !currentKeepers?.find(
          (kp) => kp.employee?.employeeId == keeper.employee?.employeeId,
        ),
    );

    availiableKeepers = availiableKeepers.filter((keeper) => {
      const [zooEventStart, zooEventEnd] = zooEvent.eventIsPublic
        ? [zooEvent.eventStartDateTime, zooEvent.eventEndDateTime]
        : convertEventTimingTypeToDate(
          zooEvent.eventStartDateTime,
          zooEvent.eventTiming as EventTimingType,
        );

      return !keeper.zooEvents?.find((ze) => {
        const [zeStart, zeEnd] = ze.eventIsPublic
          ? [ze.eventStartDateTime, ze.eventEndDateTime]
          : convertEventTimingTypeToDate(
            ze.eventStartDateTime,
            ze.eventTiming as EventTimingType,
          );
        return (
          compareDates(zeStart, zooEventEnd as Date) < 0 &&
          compareDates(zeEnd as Date, zooEventStart) > 0
        );
      });
    });

    return [availiableKeepers, currentKeepers];
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function updateZooEventById(
  zooEventId: number,
  zooEventAttributes: any,
) {
  const zooEvent: any = await getZooEventById(zooEventId);

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
  zooEventId: number,
  eventName: string,
  eventDescription: string,
  eventIsPublic: boolean,
  eventType: EventType,
  eventStartDateTime: number,
  requiredNumberOfKeeper: number,
  // Internal
  eventDurationHrs: number,
  eventTiming: EventTimingType,
  // Public
  eventNotificationDate: Date,
  eventEndDateTime: Date,
) {
  const zooEvent: ZooEvent = await getZooEventById(zooEventId);

  zooEvent.eventName = eventName;
  zooEvent.eventDescription = eventDescription;
  zooEvent.eventIsPublic = eventIsPublic;
  zooEvent.eventType = eventType;
  zooEvent.requiredNumberOfKeeper = requiredNumberOfKeeper;
  const originalStartDateTime = new Date(zooEvent.eventStartDateTime.getTime());
  const deltaStartDateTime =
    eventStartDateTime - zooEvent.eventStartDateTime.getTime();
  const iKeepMyPromises: Promise<any>[] = [];

  if (eventIsPublic) {
    const feedingPlanSessionDetail =
      await zooEvent.getFeedingPlanSessionDetail();
    if (feedingPlanSessionDetail) {
      const feedingPlan = await feedingPlanSessionDetail.getFeedingPlan();
      // Update future events
      (await feedingPlanSessionDetail.getZooEvents()).forEach((ze) => {
        if (compareDates(ze.eventStartDateTime, originalStartDateTime) >= 0) {
          ze.eventStartDateTime = new Date(
            ze.eventStartDateTime.getTime() + deltaStartDateTime,
          );
          ze.eventName = eventName;
          ze.eventDescription = eventDescription;
          ze.eventIsPublic = eventIsPublic;
          ze.eventType = EventType.CUSTOMER_FEEDING;
          ze.eventDurationHrs = eventDurationHrs;
          ze.eventTiming = eventTiming;
          ze.requiredNumberOfKeeper = requiredNumberOfKeeper;
          ze.eventNotificationDate = eventNotificationDate;
          ze.eventEndDateTime = new Date(
            ze.eventStartDateTime.getTime() +
            eventDurationHrs * HOUR_IN_MILLISECONDS,
          );
          iKeepMyPromises.push(ze.save());
        }
      });
      // Update generator
      feedingPlanSessionDetail.isPublic = eventIsPublic;
      feedingPlanSessionDetail.eventTimingType = eventTiming;
      feedingPlanSessionDetail.durationInMinutes = eventDurationHrs * 60;
      feedingPlanSessionDetail.requiredNumberOfKeeper = requiredNumberOfKeeper;

      const dayOfWeekMap: any = {
        _1: DayOfWeek.MONDAY,
        _2: DayOfWeek.TUESDAY,
        _3: DayOfWeek.WEDNESDAY,
        _4: DayOfWeek.THURSDAY,
        _5: DayOfWeek.FRIDAY,
        _6: DayOfWeek.SATURDAY,
        _0: DayOfWeek.SUNDAY,
      };
      const dateObj = new Date(eventStartDateTime);
      const day = "_" + dateObj.getDay().toString();
      feedingPlanSessionDetail.dayOfWeek = dayOfWeekMap[day];
      let hrstr = dateObj.getHours().toString();
      if (hrstr.length == 1) hrstr = "0" + hrstr;
      let minstr = dateObj.getHours().toString();
      if (minstr.length == 1) minstr = "0" + minstr;
      feedingPlanSessionDetail.publicEventStartTime = "" + hrstr + ":" + minstr;

      iKeepMyPromises.push(feedingPlanSessionDetail.save());
    } else {
      throw { message: "Public event not implemented for this yet!" };
    }
  } else {
    // Internal event
    const animalActivity = await zooEvent.getAnimalActivity();
    const feedingPlanSessionDetail =
      await zooEvent.getFeedingPlanSessionDetail();
    if (animalActivity) {
      // Update future events
      (await animalActivity.getZooEvents()).forEach((ze) => {
        if (compareDates(ze.eventStartDateTime, originalStartDateTime) >= 0) {
          ze.eventStartDateTime = new Date(
            ze.eventStartDateTime.getTime() + deltaStartDateTime,
          );
          ze.eventName = eventName;
          ze.eventDescription = eventDescription;
          ze.eventIsPublic = eventIsPublic;
          ze.eventType = eventType;
          ze.eventDurationHrs = eventDurationHrs;
          ze.eventTiming = eventTiming;
          ze.requiredNumberOfKeeper = requiredNumberOfKeeper;
          iKeepMyPromises.push(ze.save());
        }
      });
      // Update generator
      animalActivity.title = eventName;
      animalActivity.details = eventDescription;
      animalActivity.durationInMinutes = eventDurationHrs * 60;
      animalActivity.eventTimingType = eventTiming;
      animalActivity.requiredNumberOfKeeper = requiredNumberOfKeeper;
      if (animalActivity.recurringPattern == RecurringPattern.MONTHLY) {
        animalActivity.dayOfMonth = new Date(eventStartDateTime).getDay();
      } else if (animalActivity.recurringPattern == RecurringPattern.WEEKLY) {
        const dayOfWeekMap: any = {
          _1: DayOfWeek.MONDAY,
          _2: DayOfWeek.TUESDAY,
          _3: DayOfWeek.WEDNESDAY,
          _4: DayOfWeek.THURSDAY,
          _5: DayOfWeek.FRIDAY,
          _6: DayOfWeek.SATURDAY,
          _0: DayOfWeek.SUNDAY,
        };
        const day = "_" + new Date(eventStartDateTime).getDay().toString();
        animalActivity.dayOfWeek = dayOfWeekMap[day];
      }
      iKeepMyPromises.push(animalActivity.save());
    } else if (feedingPlanSessionDetail) {
      const feedingPlan = await feedingPlanSessionDetail.getFeedingPlan();
      // Update future events
      (await feedingPlanSessionDetail.getZooEvents()).forEach((ze) => {
        if (compareDates(ze.eventStartDateTime, originalStartDateTime) >= 0) {
          ze.eventStartDateTime = new Date(
            ze.eventStartDateTime.getTime() + deltaStartDateTime,
          );
          ze.eventName = eventName;
          ze.eventDescription = eventDescription;
          ze.eventIsPublic = eventIsPublic;
          ze.eventType = eventType;
          ze.eventDurationHrs = eventDurationHrs;
          ze.eventTiming = eventTiming;
          ze.requiredNumberOfKeeper = requiredNumberOfKeeper;
          iKeepMyPromises.push(ze.save());
        }
      });
      // Update generator
      feedingPlanSessionDetail.isPublic = eventIsPublic;
      feedingPlanSessionDetail.eventTimingType = eventTiming;
      feedingPlanSessionDetail.durationInMinutes = eventDurationHrs * 60;
      feedingPlanSessionDetail.requiredNumberOfKeeper = requiredNumberOfKeeper;
      const dayOfWeekMap: any = {
        _1: DayOfWeek.MONDAY,
        _2: DayOfWeek.TUESDAY,
        _3: DayOfWeek.WEDNESDAY,
        _4: DayOfWeek.THURSDAY,
        _5: DayOfWeek.FRIDAY,
        _6: DayOfWeek.SATURDAY,
        _0: DayOfWeek.SUNDAY,
      };
      const day = "_" + new Date(eventStartDateTime).getDay().toString();
      feedingPlanSessionDetail.dayOfWeek = dayOfWeekMap[day];
      iKeepMyPromises.push(feedingPlanSessionDetail.save());
    } else {
      throw { message: "Unknown zoo event generator!" };
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
  employeeIds: number[],
) {
  try {
    const zooEvents = await ZooEvent.findAll({
      where: {
        zooEventId: {
          [Op.or]: zooEventIds,
        },
      },
    });

    for (const zooEventId of zooEventIds) {
      if (!zooEvents.find((ze) => ze.zooEventId == zooEventId))
        throw { mesage: "Unable to find zoo event with Id " + zooEventId };
    }

    const employees = await Employee.findAll({
      where: {
        employeeId: {
          [Op.or]: employeeIds,
        },
      },
    });

    for (const empId of employeeIds) {
      if (!employees.find((e) => e.employeeId == empId))
        throw { mesage: "Unable to find Keeper with employee Id " + empId };
    }

    const keepers = [];
    for (const emp of employees) {
      const keeper = await emp.getKeeper();
      if (!keeper)
        throw {
          message: "Keeper does not exist on employee :" + emp.employeeName,
        };
      keepers.push(keeper);
    }

    const promises = [];
    for (const keeper of keepers) {
      for (const zooEvent of zooEvents) {
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
  employeeIds: number[],
) {
  try {
    const zooEvents = await ZooEvent.findAll({
      where: {
        zooEventId: {
          [Op.or]: zooEventIds,
        },
      },
    });

    for (const zooEventId of zooEventIds) {
      if (!zooEvents.find((ze) => ze.zooEventId == zooEventId))
        throw { mesage: "Unable to find zoo event with Id " + zooEventId };
    }

    const employees = await Employee.findAll({
      where: {
        employeeId: {
          [Op.or]: employeeIds,
        },
      },
    });

    for (const empId of employeeIds) {
      if (!employees.find((e) => e.employeeId == empId))
        throw { mesage: "Unable to find Keeper with employee Id " + empId };
    }

    const keepers = [];
    for (const emp of employees) {
      const keeper = await emp.getKeeper();
      if (!keeper)
        throw {
          message: "Keeper does not exist on employee :" + emp.employeeName,
        };
      keepers.push(keeper);
    }

    const promises = [];
    for (const keeper of keepers) {
      for (const zooEvent of zooEvents) {
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
  endDate: Date,
  includes: string[],
) {
  try {
    const zooEvent = await ZooEvent.findAll({
      where: {
        eventStartDateTime: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          association: "planningStaff",
          required: false,
          include: [
            {
              association: "employee",
              required: false,
            },
          ],
        }, {
          association: "employee",
          required:false
        }, {
          association: "keepers",
          required: false,
          include: [
            {
              association: "employee",
              required: false,
            },
            {
              association: "zooEvents",
              required: false,
            },
          ],
        },
        {
          association: "animals",
          required: false,
        },
        {
          association: "inHouse",
          required: false,
          include: [
            {
              association: "facility",
              required: false,
            },
          ],
        },
        {
          association: "animalActivity",
          required: false,
          include: [
            {
              association: "enrichmentItems",
              required: false,
            },
          ],
        },
        {
          association: "feedingPlanSessionDetail",
          required: false,
          include: [
            {
              association: "feedingPlan",
              required: false,
            },
          ],
        },
        {
          association: "enclosure",
          required: false,
        },
      ],
    });

    return zooEvent;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

function convertEventTimingTypeToDate(
  date: Date,
  eventTimingType: EventTimingType,
) {
  switch (eventTimingType) {
    case EventTimingType.MORNING:
      return [
        new Date(date.getFullYear(), date.getMonth(), date.getDay(), 7),
        new Date(date.getFullYear(), date.getMonth(), date.getDay(), 12),
      ];
    case EventTimingType.AFTERNOON:
      return [
        new Date(date.getFullYear(), date.getMonth(), date.getDay(), 12),
        new Date(date.getFullYear(), date.getMonth(), date.getDay(), 18),
      ];
    case EventTimingType.EVENING:
      return [
        new Date(date.getFullYear(), date.getMonth(), date.getDay(), 18),
        new Date(date.getFullYear(), date.getMonth(), date.getDay(), 22),
      ];
  }
}

async function greedyAssign(
  zooEvent: ZooEvent,
  zooEvents: ZooEvent[],
  keepers: Keeper[],
) {
  // console.log("greedyAssign",keepers)
  for (const ze of zooEvents) await ze.reload();
  await zooEvent.reload();
  for (const kp of keepers) await kp.reload();
  const [zooEventStart, zooEventEnd] = zooEvent.eventIsPublic
    ? [zooEvent.eventStartDateTime, zooEvent.eventEndDateTime]
    : convertEventTimingTypeToDate(
      zooEvent.eventStartDateTime,
      zooEvent.eventTiming as EventTimingType,
    );
  // console.log("zooEventStart, zooEventEnd", zooEventStart, zooEventEnd);

  const eventClashed = zooEvents.filter((ze) => {
    const [zeStart, zeEnd] = ze.eventIsPublic
      ? [ze.eventStartDateTime, ze.eventEndDateTime]
      : convertEventTimingTypeToDate(
        ze.eventStartDateTime,
        ze.eventTiming as EventTimingType,
      );
    return (
      compareDates(zeStart, zooEventEnd as Date) < 0 &&
      compareDates(zeEnd as Date, zooEventStart) > 0
    );
  });
  // console.log("eventClashed", eventClashed);

  const availableKeeper = keepers.filter((keeper) => {
    // Filter only availiable keepers given
    return (
      keeper.enclosures?.find(
        (enclosure) => zooEvent.enclosure?.enclosureId == enclosure.enclosureId,
      ) &&
      !keeper.zooEvents?.find((keeperze) =>
        eventClashed.find(
          (zeclashed) => zeclashed.zooEventId == keeperze.zooEventId,
        ),
      )
    );
  });

  const sortedKeeper = availableKeeper
    .map((keeper) => {
      // sum opportunity cos per keeper
      return {
        totalCost: eventClashed
          .filter((zeClashed) => {
            // filter for events that may be assigned to this keeper
            return keeper.enclosures?.find(
              (enclosure) =>
                zeClashed.enclosure?.enclosureId == enclosure.enclosureId,
            );
          })
          .map((zeClashed) => {
            // Obtain number of keepers availiable for this ze
            // returnreq keepers / number of keepers
            const noOfKeepers = keepers.filter((keeper) => {
              // Filter only availiable keepers given
              return (
                keeper.enclosures?.find(
                  (enclosure) =>
                    zeClashed.enclosure?.enclosureId == enclosure.enclosureId,
                ) &&
                !keeper.zooEvents?.find((keeperze) =>
                  eventClashed.find(
                    (zeclashed) => zeclashed.zooEventId == keeperze.zooEventId,
                  ),
                )
              );
            }).length;

            return zeClashed.requiredNumberOfKeeper / noOfKeepers;
          })
          .reduce((costA, costB) => {
            return costA + costB;
          }),
        keeper: keeper,
      };
    })
    .sort((a, b) => a.totalCost - b.totalCost);

  if (sortedKeeper.length > 0) {
    await zooEvent.addKeeper(sortedKeeper[0].keeper);
  }
}

function shuffleArray(array: any[]) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function doesEventClash(ze1: ZooEvent, ze2: ZooEvent) {
  const [ze1Start, ze1End] = ze1.eventIsPublic || ze1.eventType == EventType.EMPLOYEE_ABSENCE
    ? [ze1.eventStartDateTime, ze1.eventEndDateTime]
    : convertEventTimingTypeToDate(
      ze1.eventStartDateTime,
      ze1.eventTiming as EventTimingType,
    );
  const [ze2Start, ze2End] = ze2.eventIsPublic || ze1.eventType == EventType.EMPLOYEE_ABSENCE
    ? [ze2.eventStartDateTime, ze2.eventEndDateTime]
    : convertEventTimingTypeToDate(
      ze2.eventStartDateTime,
      ze2.eventTiming as EventTimingType,
    );
  const doesEventClashResult = (
    compareDates(ze1Start, ze2End as Date) < 0 &&
    compareDates(ze1End as Date, ze2Start) > 0
  );
  return doesEventClashResult;
}

export async function autoAssignKeeperToZooEvent(
  endDate: Date
) {
  try {
    console.log("autoAssignKeeperToZooEvent");

    const zooEvents = await ZooEvent.findAll({
      where: {
        eventStartDateTime: {
          [Op.between]: [
            new Date(),
            endDate,
          ],
        },
      },
      order: [["eventStartDateTime", "DESC"]],
      include: [
        {
          association: "keepers",
          required: false,
          include: [
            {
              association: "employee",
            },
          ],
        },
        {
          association: "enclosure",
        },
        {
          association: "animalActivity",
          required: false,
        },
        {
          association: "feedingPlanSessionDetail",
          required: false,
        },
      ],
    });

    let keepers = await Keeper.findAll({
      include: [
        {
          association: "zooEvents",
          required: false,
          where: {
            eventStartDateTime: {
              [Op.between]: [
                new Date(Date.now() - DAY_IN_MILLISECONDS * 1),
                new Date(Date.now() + DAY_IN_MILLISECONDS * 90),
              ],
            },
          },
          order: ["eventStartDateTime", "DESC"],
        },
        {
          association: "enclosures",
        },
        {
          association: "employee",
        },
      ],
    });

    // for (let zooEvent of zooEvents){
    //   for (let i = 0; i < zooEvent.requiredNumberOfKeeper; i++){
    //       await greedyAssign(zooEvent, zooEvents, keepers);
    //   }
    // }

    shuffleArray(keepers);
    for (const zooEvent of zooEvents) {
      while (
        (await zooEvent.getKeepers()).length < zooEvent.requiredNumberOfKeeper
      ) {
        let notFound = false;

        for (let index = 0; index < keepers.length; index++) {
          const keeper = keepers[index];
          if (
            keeper.enclosures?.find(
              (enclosure) =>
                zooEvent.enclosure?.enclosureId == enclosure.enclosureId,
            ) &&
            !(await keeper.getZooEvents()).find((ze) =>
              doesEventClash(ze, zooEvent),
            ) && 
            !((await (await keeper.getEmployee()).getZooEvents({
              where: {
                eventStartDateTime: {
                  [Op.between]: [
                    new Date(Date.now() - DAY_IN_MILLISECONDS * 1),
                    new Date(Date.now() + DAY_IN_MILLISECONDS * 90),
                  ],
                },
              },
            })).find((ze) =>
            doesEventClash(ze, zooEvent)))
          ) {
            // console.log("keeper", keeper.employee?.employeeName, zooEvent.zooEventId, zooEvent.eventStartDateTime, (await keeper.getZooEvents()),
            // ((await (await keeper.getEmployee()).getZooEvents())));
            const selKeeper = keepers.splice(index, 1)[0];
            await selKeeper.addZooEvent(zooEvent);
            keepers.push(selKeeper);
            break;
          }
          if (index == keepers.length - 1) {
            notFound = true;
          }
        }
        if (notFound) {
          break;
        }
      }
    }
    return zooEvents;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function createEmployeeAbsence(
  employeeId: number,
  eventName: string,
  eventDescription: string,
  eventStartDateTimes: Date[],
) {
  try {
    const employee = await EmployeeService.findEmployeeById(employeeId);

    const promises = [];

    for (const esdt of eventStartDateTimes) {
      promises.push(
        ZooEvent.create({
          eventName: eventName,
          eventDescription: eventDescription,
          eventIsPublic: false,
          eventType: EventType.EMPLOYEE_ABSENCE,
          eventStartDateTime: esdt,
          eventNotificationDate: esdt,
          requiredNumberOfKeeper: 0,
          eventDurationHrs: 24 * DAY_IN_MILLISECONDS,
          eventTiming: null,
          eventEndDateTime: new Date(esdt.getTime() + DAY_IN_MILLISECONDS),
        }),
      );
    }

    const zooEvents = [];

    for (const p of promises) {
      const zooEvent = await p;
      await zooEvent.setEmployee(employee);
      zooEvents.push(zooEvent);
    }

    return zooEvents;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllEmployeeAbsence() {
  try {
    return ZooEvent.findAll({
      where: {
        eventType: EventType.EMPLOYEE_ABSENCE,
      },
      include: [
        {
          association: "keepers",
          required: true,
        },
      ],
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function createPublicEvent(
  eventType: EventType,
  title: string,
  details: string,
  imageUrl: string,
  startDate: Date,
  endDate: Date | null,
  animalCodes: string[],
  keeperEmployeeIds: number[],
  inHouseId: number,
) {
  try {
    const animals = [];
    for (const code of animalCodes) {
      animals.push(await AnimalService.getAnimalByAnimalCode(code));
    }

    const keepers = [];
    for (const id of keeperEmployeeIds) {
      keepers.push(await EmployeeService.getKeeperByEmployeeId(id));
    }

    const inHouse =
      await AssetFacilityService.getInHouseByFacilityId(inHouseId);

    const newPublicEvent = await PublicEvent.create({
      eventType: eventType,
      title: title,
      details: details,
      imageUrl: imageUrl,
      startDate: startDate,
      endDate: endDate,
      isDisabled: false
    });

    await newPublicEvent.setAnimals(animals);
    await newPublicEvent.setKeepers(keepers);
    await newPublicEvent.setInHouse(inHouse);

    return newPublicEvent;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllPublicEvents(include: any[] = []) {
  try {
    return await PublicEvent.findAll({
      include: include,
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getPublicEventById(
  publicEventId: number,
  include: any[] = [],
) {
  try {
    const publicEvent = await PublicEvent.findOne({
      where: {
        publicEventId: publicEventId,
      },
      include: include,
    });

    if (!publicEvent)
      throw { message: "Public Event not found with id: " + publicEvent };

    return publicEvent;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function updatePublicEventById(
  publicEventId: number,
  eventType: EventType,
  title: string,
  details: string,
  imageUrl: string | null,
  startDate: Date,
  endDate: Date | null,
  animalCodes: string[] | null,
  keeperEmployeeIds: number[] | null,
  inHouseId: number | null,
) {
  try {
    const publicEvent = await getPublicEventById(publicEventId, []);

    publicEvent.eventType = eventType;
    publicEvent.title = title;
    publicEvent.details = details;
    publicEvent.startDate = startDate;
    publicEvent.endDate = endDate;

    if (imageUrl) {
      publicEvent.imageUrl = imageUrl;
    }
    await publicEvent.save();

    const zooEvents = [];
    const promises = [];

    for (const session of (await publicEvent.getPublicEventSessions())) {
      for (const ze of (await session.getZooEvents())) {
        if (compareDates(ze.eventStartDateTime, new Date()) >= 0) {
          if (endDate && ze.eventEndDateTime && compareDates(endDate, ze.eventEndDateTime) <= 0) {
            await ze.destroy();
          } else {
            zooEvents.push(ze);
          }
        }
      }

      await generateMonthlyZooEventForPublicEventSession(session);
    }
    


    if (animalCodes) {
      const animals = [];
      for (const code of animalCodes) {
        animals.push(await AnimalService.getAnimalByAnimalCode(code));
      }
      await publicEvent.setAnimals(animals);
      for (const ze of zooEvents) {
        await ze.setAnimals(animals);
        promises.push(ze.save());
      }
    }

    if (keeperEmployeeIds) {
      const keepers = [];
      for (const id of keeperEmployeeIds) {
        keepers.push(await EmployeeService.getKeeperByEmployeeId(id));
      }
      await publicEvent.setKeepers(keepers);
      for (const ze of zooEvents) {
        await ze.setKeepers(keepers);
        promises.push(ze.save());
      }
    }

    if (inHouseId) {
      const inHouse =
        await AssetFacilityService.getInHouseByFacilityId(inHouseId);
      await publicEvent.setInHouse(inHouse);
      for (const ze of zooEvents) {
        await ze.setInHouse(inHouse);
        promises.push(ze.save());
      }
    }

    for (const p of promises) await p;
    return publicEvent.save();
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function enablePublicEventById(
  publicEventId: number
) {
  try {
    const publicEvent = await getPublicEventById(publicEventId, []);

    publicEvent.isDisabled = false;
    await publicEvent.save();

    for (const session of (await publicEvent.getPublicEventSessions())) {
      await generateMonthlyZooEventForPublicEventSession(session);
    }
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function disablePublicEventById(
  publicEventId: number
) {
  try {
    const publicEvent = await getPublicEventById(publicEventId, []);

    publicEvent.isDisabled = true;
    const promises = []
    promises.push(publicEvent.save());
    for (const session of (await publicEvent.getPublicEventSessions())) {
      if (session.recurringPattern == RecurringPattern.NON_RECURRING) {
        const p2 = [];
        for (const ze of (await session.getZooEvents())) {
          p2.push(ze.destroy());
        }
        for (const p2p of p2) await p2p;
        promises.push(session.destroy());
      } else {
        for (const ze of (await session.getZooEvents())) {
          promises.push(ze.destroy());
        }
      }
    }

    for (const p of promises) await p;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deletePublicEventById(publicEventId: number) {
  try {
    const publicEvent = await getPublicEventById(publicEventId, []);
    for (const session of (await publicEvent.getPublicEventSessions())) {
      const promises = [];
      for (const ev of (await session.getZooEvents())) {
        promises.push(ev.destroy());
      }
      for (const p of promises) await p;
      await session.destroy();
    }
    return publicEvent.destroy();
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function createPublicEventSession(
  publicEventId: number,
  recurringPattern: RecurringPattern,
  dayOfWeek: DayOfWeek | null,
  dayOfMonth: number | null,
  durationInMinutes: number,
  time: string,
  daysInAdvanceNotification: number,
  oneDate: Date | null,
) {
  try {
    const publicEvent = await getPublicEventById(publicEventId, []);
    if (recurringPattern == RecurringPattern.NON_RECURRING && !oneDate)
      throw { message: "Date of non recurring event not specified!" };
    if (recurringPattern == RecurringPattern.MONTHLY && !dayOfMonth)
      throw { message: "Date of monthly event not specified!" };
    if (recurringPattern == RecurringPattern.WEEKLY && !dayOfWeek)
      throw { message: "Date of weekly event not specified!" };

    const data = {
      recurringPattern: recurringPattern,
      dayOfWeek: dayOfWeek,
      dayOfMonth: dayOfMonth,
      durationInMinutes: durationInMinutes,
      time: time,
      daysInAdvanceNotification: daysInAdvanceNotification,
    };
    const newPublicEventSession = await PublicEventSession.create(data);

    await newPublicEventSession.setPublicEvent(publicEvent);

    if (recurringPattern == RecurringPattern.NON_RECURRING) {
      createPublicSessionZooEvent(
        newPublicEventSession.publicEventSessionId,
        oneDate as Date,
        durationInMinutes,
        daysInAdvanceNotification,
        publicEvent.details,
        publicEvent.title,
        publicEvent.imageUrl,
        publicEvent.eventType,
        await publicEvent.getKeepers(),
        await publicEvent.getInHouse(),
        await publicEvent.getAnimals(),
      );
    }

    await generateMonthlyZooEventForPublicEventSession(newPublicEventSession);

    return newPublicEventSession;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllPublicEventSessions(include: any[] = []) {
  try {
    return await PublicEventSession.findAll({
      include: include,
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getPublicEventSessionById(
  publicEventSessionId: number,
  include: any[] = [],
) {
  try {
    const publicEventSession = await PublicEventSession.findOne({
      where: {
        publicEventSessionId: publicEventSessionId,
      },
      include: include,
    });

    if (!publicEventSession)
      throw {
        message: "Public Event not found with id: " + publicEventSessionId,
      };

    return publicEventSession;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function updatePublicEventSessionById(
  publicEventSessionId: number,
  recurringPattern: RecurringPattern,
  dayOfWeek: DayOfWeek,
  dayOfMonth: number,
  durationInMinutes: number,
  time: string,
  daysInAdvanceNotification: number,
) {
  try {
    const publicEventsession = await getPublicEventSessionById(
      publicEventSessionId,
      [],
    );

    const promises = [];
    for (const ze of await publicEventsession.getZooEvents()) {
        promises.push(ze.destroy());
    }
    for (const p of promises) await p;

    if (publicEventsession.recurringPattern != recurringPattern) {
      publicEventsession.recurringPattern = recurringPattern;
      publicEventsession.dayOfWeek = dayOfWeek;
      publicEventsession.dayOfMonth = dayOfMonth;

    }
    publicEventsession.durationInMinutes = durationInMinutes;
    publicEventsession.time = time;
    publicEventsession.daysInAdvanceNotification = daysInAdvanceNotification;
    await publicEventsession.save();

    return generateMonthlyZooEventForPublicEventSession(publicEventsession);
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deletePublicEventSessionById(
  publicEventSessionId: number,
) {
  try {
    const publicEventSession =
      await getPublicEventSessionById(publicEventSessionId);
    const promises = [];
    for (const ev of (await publicEventSession.getZooEvents()) ) {
      promises.push(ev.destroy());
    }
    for (const p of promises) await p;
    return publicEventSession.destroy();
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}
