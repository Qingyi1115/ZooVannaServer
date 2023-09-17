import { Request, Response } from "express";
import { findEmployeeByEmail } from "../services/employee";
import { PlannerType } from "../models/enumerated";
import {
  addHubProcessorByFacilityId,
  addSensorByHubProcessorId,
  createNewFacility,
  getAuthorizationForCameraById,
  getFacilityById,
  initializeHubProcessor,
} from "../services/assetFacility";
import { Facility } from "../models/facility";
import { Sensor } from "../models/sensor";
import { HubProcessor } from "../models/hubProcessor";
import { handleFileUpload } from "../helpers/multerProcessFile";
import * as AnimalFeedService from "../services/animalFeed";
import * as EnrichmentItemService from "../services/enrichmentItem";

export async function createFacility(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !(
        (await employee.getPlanningStaff())?.plannerType ==
        PlannerType.OPERATIONS_MANAGER
      )
    ) {
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });
    }

    const {
      facilityName,
      xCoordinate,
      yCoordinate,
      facilityDetail,
      facilityDetailJson,
    } = req.body;

    if (
      [
        facilityName,
        xCoordinate,
        yCoordinate,
        facilityDetail,
        facilityDetailJson,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        facilityName,
        xCoordinate,
        yCoordinate,
        facilityDetail,
        facilityDetailJson,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let facility = await createNewFacility(
      facilityName,
      xCoordinate,
      yCoordinate,
      facilityDetail,
      facilityDetailJson,
    );

    return res.status(200).json({ facility: facility.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function addHubToFacility(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !(
        (await employee.getPlanningStaff())?.plannerType ==
        PlannerType.OPERATIONS_MANAGER
      )
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });

    const { facilityId, processorName } = req.body;

    if ([facilityId, processorName].includes(undefined)) {
      return res.status(400).json({ error: "Missing information!" });
    }

    let hubProcessor: HubProcessor = await addHubProcessorByFacilityId(
      Number(facilityId),
      processorName,
    );

    return res.status(200).json({ facility: hubProcessor.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function addSensorToHub(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !(
        (await employee.getPlanningStaff())?.plannerType ==
        PlannerType.OPERATIONS_MANAGER
      )
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });

    const { hubProcessorId, sensorType, sensorName } = req.body;

    if ([hubProcessorId, sensorType, sensorName].includes(undefined)) {
      return res.status(400).json({ error: "Missing information!" });
    }

    let sensor: Sensor = await addSensorByHubProcessorId(
      Number(hubProcessorId),
      sensorType,
      sensorName,
    );

    return res.status(200).json({ facility: sensor.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateFacility(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !(
        (await employee.getPlanningStaff())?.plannerType ==
        PlannerType.OPERATIONS_MANAGER
      )
    ) {
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });
    }

    const {
      facilityId,
      facilityName,
      xCoordinate,
      yCoordinate,
      facilityDetailJson,
    } = req.body;

    if (
      !facilityId ||
      [facilityName, xCoordinate, yCoordinate, facilityDetailJson].every(
        (field) => field === undefined,
      )
    ) {
      return res.status(400).json({ error: "Missing information!" });
    }

    let facility = (await getFacilityById(Number(facilityId))) as any;

    if (!facility)
      return res
        .status(400)
        .json({ error: "Unknown facilityId " + facilityId });
    for (const [field, v] of Object.entries({
      facilityName: facilityName,
      xCoordinate: xCoordinate,
      yCoordinate: yCoordinate,
    })) {
      if (v !== undefined) {
        facility[field] = v;
      }
    }

    const p1: Promise<Facility> = facility.save();

    if (facilityDetailJson !== undefined) {
      const facilityDetail = await facility.getFacilityDetail();
      if (facilityDetail === undefined)
        throw {
          message: "Unable to find facilityDetail for facilityId " + facilityId,
        };
      for (const [field, v] of Object.entries(facilityDetailJson)) {
        facilityDetail[field] = v;
      }
      await facilityDetail.save();
    }
    await p1;
    return res.status(200).json({ facility: facility.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function initializeHub(req: Request, res: Response) {
  try {
    const { processorName } = req.body;
    // const {processorName} = req.body;

    let ipaddress = req.socket.remoteAddress || "127.0.0.1";
    ipaddress = ipaddress == "::1" ? "127.0.0.1" : ipaddress

    return res.status(200).json({ token: await initializeHubProcessor(processorName, ipaddress) });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAuthorizationForCamera(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !(
        (await employee.getPlanningStaff())?.plannerType ==
        PlannerType.OPERATIONS_MANAGER
      )
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });

    const { sensorId } = req.body;

    if (sensorId === undefined) {
      return res.status(400).json({ error: "Missing information!" });
    }

    return res.status(200).json(
      await getAuthorizationForCameraById(
        sensorId,
        String(employee.employeeId),
      ));
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

//Asset functions
export async function createNewAnimalFeed(req: Request, res: Response) {
  try {
    const imageUrl = await handleFileUpload(
      req,
      process.env.IMG_URL_ROOT! + "animalFeed", //"D:/capstoneUploads/animalFeed",
    );
    const {
      animalFeedName,
      animalFeedImageUrl,
      animalFeedCategory
    } = req.body;

    if (
      [
        animalFeedName,
        animalFeedImageUrl,
        animalFeedCategory
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        animalFeedName,
        animalFeedImageUrl,
        animalFeedCategory
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let animalFeed = await AnimalFeedService.createNewAnimalFeed(
      animalFeedName,
      animalFeedImageUrl,
      animalFeedCategory
    );

    return res.status(200).json({ animalFeed: animalFeed.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllAnimalFeed(req: Request, res: Response) {
  try {
    const allAnimalFeed = await AnimalFeedService.getAllAnimalFeed();
    return res.status(200).json(allAnimalFeed);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAnimalFeedByName(req: Request, res: Response) {
  const { animalFeedName } = req.params;

  if (animalFeedName == undefined) {
    console.log("Missing field(s): ", {
      animalFeedName,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const animalFeed = await AnimalFeedService.getAnimalFeedByName(animalFeedName);
    return res.status(200).json(animalFeed);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateAnimalFeed(req: Request, res: Response) {
  try {
    const imageUrl = await handleFileUpload(
      req,
      process.env.IMG_URL_ROOT! + "animalFeed", //"D:/capstoneUploads/animalFeed",
    );
    const {
      animalFeedName,
      animalFeedImageUrl,
      animalFeedCategory
    } = req.body;

    if (
      [
        animalFeedName,
        animalFeedImageUrl,
        animalFeedCategory
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        animalFeedName,
        animalFeedImageUrl,
        animalFeedCategory
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let animalFeed = await AnimalFeedService.updateAnimalFeed(
      animalFeedName,
      animalFeedImageUrl,
      animalFeedCategory
    );

    return res.status(200).json({ animalFeed });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteAnimalFeedByName(req: Request, res: Response) {
  const { animalFeedName } = req.params;

  if (animalFeedName == undefined) {
    console.log("Missing field(s): ", {
      animalFeedName,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const animalFeed = await AnimalFeedService.deleteAnimalFeedByName(animalFeedName);
    return res.status(200).json(animalFeed);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function createNewEnrichmentItem(req: Request, res: Response) {
  try {
    const imageUrl = await handleFileUpload(
      req,
      process.env.IMG_URL_ROOT! + "enrichmentItem", //"D:/capstoneUploads/enrichmentItem",
    );
    const {
      enrichmentItemName,
      enrichmentItemImageUrl
    } = req.body;

    if (
      [
        enrichmentItemName,
        enrichmentItemImageUrl
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        enrichmentItemName,
        enrichmentItemImageUrl
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let enrichmentItem = await EnrichmentItemService.createNewEnrichmentItem(
      enrichmentItemName,
      enrichmentItemImageUrl
    );

    return res.status(200).json({ enrichmentItem: enrichmentItem.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllEnrichmentItem(req: Request, res: Response) {
  try {
    const allEnrichmentItem = await EnrichmentItemService.getAllEnrichmentItem();
    return res.status(200).json(allEnrichmentItem);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getEnrichmentItemByName(req: Request, res: Response) {
  const { enrichmentItemName } = req.params;

  if (enrichmentItemName == undefined) {
    console.log("Missing field(s): ", {
      enrichmentItemName,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const enrichmentItem = await EnrichmentItemService.getEnrichmentItemByName(enrichmentItemName);
    return res.status(200).json(enrichmentItem);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateEnrichmentItem(req: Request, res: Response) {
  try {
    const imageUrl = await handleFileUpload(
      req,
      process.env.IMG_URL_ROOT! + "enrichmentItem", //"D:/capstoneUploads/enrichmentItem",
    );
    const {
      enrichmentItemName,
      enrichmentItemImageUrl
    } = req.body;

    if (
      [
        enrichmentItemName,
        enrichmentItemImageUrl
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        enrichmentItemName,
        enrichmentItemImageUrl
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let enrichmentItem = await EnrichmentItemService.updateEnrichmentItem(
      enrichmentItemName,
      enrichmentItemImageUrl
    );

    return res.status(200).json({ enrichmentItem });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteEnrichmentItemByName(req: Request, res: Response) {
  const { enrichmentItemName } = req.params;

  if (enrichmentItemName == undefined) {
    console.log("Missing field(s): ", {
      enrichmentItemName,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const enrichmentItem = await EnrichmentItemService.deleteEnrichmentItemByName(enrichmentItemName);
    return res.status(200).json(enrichmentItem);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}