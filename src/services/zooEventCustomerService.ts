import { ZooEvent } from "../models/ZooEvent";
import { Op, Sequelize } from "Sequelize";
import { validationErrorHandler } from "../helpers/errorHandler";
import { PublicEvent } from "../models/PublicEvent";

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
        startDate: { [Op.gte]: today },
      },
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
