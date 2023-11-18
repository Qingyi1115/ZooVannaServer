import { Request, Response } from "express";
import { compareDates } from "../helpers/others";
import { DAY_IN_MILLISECONDS } from "../helpers/staticValues";
import { PlannerType, RecurringPattern } from "../models/Enumerated";
import { findCustomerByEmail } from "../services/customerService";
import * as ZooEventCustomerService from "../services/zooEventCustomerService";
import { handleFileUpload } from "../helpers/multerProcessFile";

export async function getAllPublishedPublicZooEvents(
  req: Request,
  res: Response,
) {
  try {
    const publicZooEvents =
      await ZooEventCustomerService.getAllPublishedPublicZooEvents([
        {
          association: "animals",
          required: false,
          include: [
            {
              association: "species",
              required: true,
            },
          ],
        },
        {
          association: "keepers",
          required: false,
          include: [
            {
              association: "employee",
              required: true,
            },
          ],
        },
        {
          association: "inHouse",
          required: false,
          include: [
            {
              association: "facility",
              required: true,
            },
          ],
        },
        {
          association: "publicEventSession",
          required: false,
        },
      ]);
    return res
      .status(200)
      .json({ result: publicZooEvents.map((e) => e.toJSON()) });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getPublishedPublicZooEvent(req: Request, res: Response) {
  try {
    const { zooEventId } = req.params;
    console.log("zoo event id " + zooEventId);
    const result = await ZooEventCustomerService.getPublishedPublicZooEvent(
      Number(zooEventId),
      [
        {
          association: "animals",
          required: false,
          include: [
            {
              association: "species",
              required: true,
            },
          ],
        },
        {
          association: "keepers",
          required: false,
          include: [
            {
              association: "employee",
              required: true,
            },
          ],
        },
        {
          association: "inHouse",
          required: false,
          include: [
            {
              association: "facility",
              required: true,
            },
          ],
        },
        {
          association: "publicEventSession",
          required: false,
        },
      ],
    );

    return res.status(200).json({ result: result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllPublicEvents(req: Request, res: Response) {
  try {
    const publicEvents = await ZooEventCustomerService.getAllPublicEvents([
      {
        association: "animals",
        required: false,
        include: [
          {
            association: "species",
            required: true,
          },
        ],
      },
      {
        association: "keepers",
        required: false,
        include: [
          {
            association: "employee",
            required: true,
          },
        ],
      },
      {
        association: "inHouse",
        required: false,
        include: [
          {
            association: "facility",
            required: true,
          },
        ],
      },
      {
        association: "publicEventSessions",
        required: false,
      },
    ]);

    console.log(publicEvents);
    return res
      .status(200)
      .json({ result: publicEvents.map((e) => e.toJSON()) });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAllUniquePublicZooEventsToday(
  req: Request,
  res: Response,
) {
  try {
    console.log("inside controller");

    const {
      type
    } = req.body;

    if (
      [
        type
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        type
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    const publicEvents =
      await ZooEventCustomerService.getAllUniquePublicZooEventsToday([
        {
          association: "animals",
          required: false,
          include: [
            {
              association: "species",
              required: true,
            },
          ],
        },
        {
          association: "keepers",
          required: false,
          include: [
            {
              association: "employee",
              required: true,
            },
          ],
        },
        {
          association: "inHouse",
          required: false,
          include: [
            {
              association: "facility",
              required: true,
            },
          ],
        },
        {
          association: "publicEventSession",
          required: true,
          include: [{
            association: "publicEvent",
            required: true
          }]
        },
      ], type);

    console.log(publicEvents);
    return res
      .status(200)
      .json({ result: publicEvents.map((e) => e.toJSON()) });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getPublicEventById(req: Request, res: Response) {
  try {
    const { publicEventId } = req.params;
    if ([publicEventId].includes("")) {
      console.log("Missing field(s): ", {
        publicEventId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    const publicEvent = await ZooEventCustomerService.getPublicEventById(
      Number(publicEventId),
      [
        {
          association: "animals",
          required: false,
          include: [
            {
              association: "species",
              required: true,
            },
          ],
        },
        {
          association: "keepers",
          required: false,
          include: [
            {
              association: "employee",
              required: true,
            },
          ],
        },
        {
          association: "inHouse",
          required: false,
          include: [
            {
              association: "facility",
              required: true,
            },
          ],
        },
        {
          association: "publicEventSessions",
          required: false,
        },
      ],
    );
    return res.status(200).json({ result: publicEvent.toJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}
