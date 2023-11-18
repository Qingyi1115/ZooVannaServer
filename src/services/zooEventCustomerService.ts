import { ZooEvent } from "../models/ZooEvent";
import { Op, Sequelize } from "Sequelize";
import { validationErrorHandler } from "../helpers/errorHandler";
import { PublicEvent } from "../models/PublicEvent";
import { EventType } from "../models/Enumerated";

export async function getAllPublishedPublicZooEvents(include: any[] = []) {
  try {
    const today = new Date(Date.now());
    return await ZooEvent.findAll({
      include: include,
      where: {
        eventNotificationDate: { [Op.lte]: today },
        eventEndDateTime: { [Op.gte]: today },
        eventIsPublic: true,
      },
      order: [["eventStartDateTime", "ASC"]],
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllUniquePublicZooEventsToday(
  include: any[] = [],
  type: EventType,
) {
  try {
    console.log("-------inside service-------");
    const today = new Date(Date.now());
    console.log(today);
    const endToday = new Date(Date.now());
    endToday.setHours(23, 59, 59);
    console.log(endToday);
    const todayEvents = await ZooEvent.findAll({
      include: include,
      where: {
        eventNotificationDate: { [Op.lte]: today },
        eventStartDateTime: { [Op.gte]: today },
        eventEndDateTime: { [Op.lte]: endToday },
        eventIsPublic: true,
        eventType: type,
      },
      order: [["eventStartDateTime", "ASC"]],
    });

    // Process the results to get the earliest event for each publicEvent
    const uniqueEvents = todayEvents.reduce(
      (acc: Record<string, ZooEvent>, event) => {
        const publicEventId =
          event.publicEventSession!.publicEvent!.publicEventId;
        if (
          !acc[publicEventId] ||
          event.eventStartDateTime < acc[publicEventId].eventStartDateTime
        ) {
          acc[publicEventId] = event;
        }
        return acc;
      },
      {},
    );

    return Object.values(uniqueEvents);
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getPublishedPublicZooEvent(
  zooEventId: number,
  include: any[] = [],
) {
  try {
    const today = new Date(Date.now());
    return await ZooEvent.findOne({
      include: include,
      where: {
        eventNotificationDate: { [Op.lte]: today },
        eventEndDateTime: { [Op.gte]: today },
        eventIsPublic: true,
        zooEventId: zooEventId,
      },
    });
  } catch (error: any) {
    throw { message: error.message };
  }
}

export async function getAllPublicEvents(include: any[] = []) {
  try {
    const today = new Date(Date.now());
    today.setHours(0, 0, 0);
    return await PublicEvent.findAll({
      include: include,
      where: {
        [Op.or]: [
          { endDate: { [Op.gte]: today } }, // End date is greater than or equal to today
          { endDate: null }, // Or end date is null
        ],
      },
      order: [["startDate", "ASC"]],
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
