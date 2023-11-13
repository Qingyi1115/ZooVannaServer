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
