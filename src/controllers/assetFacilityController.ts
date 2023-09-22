import { Request, Response } from "express";
import { findEmployeeByEmail } from "../services/employee";
import { PlannerType } from "../models/enumerated";
import {
  getAllFacility,
  _getAllHubs,
  _getAllSensors,
  addHubProcessorByFacilityId,
  addSensorByHubProcessorId,
  assignMaintenanceStaffToFacilityById,
  assignMaintenanceStaffToSensorById,
  assignOperationStaffToFacilityById,
  createNewFacility,
  deleteFacilityById,
  deleteHubById,
  deleteSensorById,
  getAllFacilityMaintenanceSuggestions,
  getAllSensorMaintenanceSuggestions,
  getAuthorizationForCameraById,
  getFacilityById,
  getSensorReadingBySensorId,
  initializeHubProcessor,
  removeMaintenanceStaffFromFacilityById,
  removeMaintenanceStaffFromSensorById,
  removeOperationStaffFromFacilityById,
  updateFacilityByFacilityId,
  updateHubByHubId,
  updateSensorById,
  getMaintenanceStaffsByFacilityId,
  getAllMaintenanceStaff,
} from "../services/assetFacility";
import { Facility } from "../models/facility";
import { Sensor } from "../models/sensor";
import { HubProcessor } from "../models/hubProcessor";
import { handleFileUpload } from "../helpers/multerProcessFile";
import * as AnimalFeedService from "../services/animalFeed";
import * as EnrichmentItemService from "../services/enrichmentItem";
import { compareDates } from "../helpers/others";
import { InHouse } from "../models/inHouse";

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
      isSheltered,
      facilityDetail,
      facilityDetailJson,
    } = req.body;
    console.log({
      facilityName,
      xCoordinate,
      yCoordinate,
      isSheltered,
      facilityDetail,
      facilityDetailJson,
    } )
    if (
      [
        facilityName,
        xCoordinate,
        yCoordinate,
        isSheltered,
        facilityDetail,
        facilityDetailJson,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        facilityName,
        xCoordinate,
        yCoordinate,
        isSheltered,
        facilityDetail,
        facilityDetailJson,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let facility = await createNewFacility(
      facilityName,
      xCoordinate,
      yCoordinate,
      isSheltered,
      facilityDetail,
      facilityDetailJson,
    );

    return res.status(200).json({ facility: facility.toJSON() });
  } catch (error: any) {
    console.log("val error", error)
    res.status(400).json({ error: error.message });
  }
}

export async function getAllFacilityController(req: Request, res: Response) {
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

    let { includes } = req.body;
    includes = includes || []; 

    const _includes : string[] = []
    for (const role of ["hubProcessors"]){
      if (includes.includes(role)) _includes.push(role)
    }

    let facilities : Facility[] = await getAllFacility(_includes, includes.includes("facilityDetail"));
    console.log("facilities",facilities)
    facilities.forEach(facility => facility.toJSON())

    return res.status(200).json({ facilities: facilities });
  } catch (error: any) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
}

export async function getFacilityController(req: Request, res: Response) {
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
    
    let { facilityId } = req.params
    let { includes } = req.body;
    includes = includes || []; 

    const _includes : string[] = []
    for (const role of ["hubProcessors"]){
      if (includes.includes(role)) _includes.push(role)
    }

    let facility : Facility = await getFacilityById(Number(facilityId), _includes );
    return res.status(200).json({ facility: await facility.toFullJson() });
  } catch (error: any) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
}

export async function getFacilityMaintenanceSuggestions(req: Request, res: Response) {
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
    let facilities = await getAllFacilityMaintenanceSuggestions();
    return res.status(200).json({ facilities: facilities });
  } catch (error: any) {
    console.log("error", error);
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
    const { facilityId } = req.params; 
    const {
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

    const facilityAttribute :any = {}
    
    for (const [field, v] of Object.entries({
      facilityName: facilityName,
      xCoordinate: Number(xCoordinate),
      yCoordinate: Number(yCoordinate)
    })) {
      if (v !== undefined) {
        facilityAttribute[field] = v;
      }
    }
    const newFacility = await updateFacilityByFacilityId(Number(facilityId), facilityAttribute, facilityDetailJson)

    return res.status(200).json({ facility: newFacility.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAssignedMaintenanceStaffOfFacilityController(req: Request, res: Response) {
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

    const { facilityId } = req.params;

    if (facilityId === undefined) {
      return res.status(400).json({ error: "Missing information!" });
    }

    let staffs = await getMaintenanceStaffsByFacilityId(
      Number(facilityId)
    );
      console.log("staffs",staffs)
    return res.status(200).json({ maintenanceStaffs: staffs });
  } catch (error: any) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
}

export async function getAllMaintenanceStaffController(req: Request, res: Response) {
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

      const { includes = [] } = req.body;

      const _includes : string[] = []
      for (const role of ["sensors", "facility"]){
        if (includes.includes(role)) _includes.push(role)
      }
    
    let staffs = await getAllMaintenanceStaff(_includes);
    
    return res.status(200).json({ maintenanceStaffs: staffs });
  } catch (error: any) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
}

export async function assignMaintenanceStaffToFacility(req: Request, res: Response) {
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

    const { employeeIds } = req.body;
    const { facilityId } = req.params;

    if ([facilityId, employeeIds].includes(undefined)) {
      return res.status(400).json({ error: "Missing information!" });
    }
    (employeeIds as string[]).forEach(id => Number(id))

    let inHouse: InHouse = await assignMaintenanceStaffToFacilityById(
      Number(facilityId),
      employeeIds
    );

    return res.status(200).json({ inHouse: inHouse.toFullJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function removeMaintenanceStaffFromFacility(req: Request, res: Response) {
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

    const { employeeIds } = req.body;
    const { facilityId } = req.params;
      console.log("removeMaintenanceStaffFromFacility")
    if ([facilityId, employeeIds].includes(undefined)) {
      return res.status(400).json({ error: "Missing information!" });
    }
    (employeeIds as string[]).forEach(id => Number(id))

    let inHouse: InHouse = await removeMaintenanceStaffFromFacilityById(
      Number(facilityId),
      employeeIds
    );

    return res.status(200).json({ inHouse: inHouse.toFullJSON() });
  } catch (error: any) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
}

export async function assignOperationStaffToFacility(req: Request, res: Response) {
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

    const { employeeIds } = req.body;
    const { facilityId } = req.params;

    if ([facilityId, employeeIds].includes(undefined)) {
      return res.status(400).json({ error: "Missing information!" });
    }
    (employeeIds as string[]).forEach(id => Number(id))

    let inHouse: InHouse = await assignOperationStaffToFacilityById(
      Number(facilityId),
      employeeIds
    );

    return res.status(200).json({ inHouse: inHouse.toFullJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function removeOperationStaffFromFacility(req: Request, res: Response) {
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

    const { employeeIds } = req.body;
    const { facilityId } = req.params;

    if ([facilityId, employeeIds].includes(undefined)) {
      return res.status(400).json({ error: "Missing information!" });
    }
    (employeeIds as string[]).forEach(id => Number(id))

    let inHouse: InHouse = await removeOperationStaffFromFacilityById(
      Number(facilityId),
      employeeIds
    );

    return res.status(200).json({ inHouse: inHouse.toFullJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteFacility(req: Request, res: Response) {
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
    const { facilityId } = req.params;
    if (facilityId === undefined ) return res.status(400).json({ error: "Missing information!" });

    await deleteFacilityById(Number(facilityId));

    return res.status(200).json({result:"Success!"});
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

export async function getAllHubs(req: Request, res: Response) {
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

    const { includes = [] } = req.body;

    const _includes : string[] = []
    for (const role of ["sensors", "facility"]){
      if (includes.includes(role)) _includes.push(role)
    }

    let hubs : HubProcessor[] = await _getAllHubs(_includes);

    hubs.forEach(hub => hub.toJSON())

    return res.status(200).json({ hubs: hubs });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllSensors(req: Request, res: Response) {
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
    
    const { includes=[] } = req.body;

    const _includes : string[] = []
    for (const role of ["hubProcessor", "sensorReading", "generalStaff"]){
      if (includes.includes(role)) _includes.push(role)
    }
  
    let sensors : Sensor[] = await _getAllSensors(_includes);

    sensors.forEach(sensor => sensor.toJSON())

    return res.status(200).json({ sensors: sensors });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getSensorReading(req: Request, res: Response) {
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

    const { sensorId } = req.params;
    const { startDate, endDate } = req.body;

    let sensorReadings = await getSensorReadingBySensorId(Number(sensorId));
    
    sensorReadings = sensorReadings.filter(reading => 
      compareDates(reading.readingDate, new Date(startDate)) >= 0 &&
      compareDates(reading.readingDate, new Date(endDate)) <= 0 );

    sensorReadings.forEach(reading => reading.toJSON())

    return res.status(200).json({ sensorReadings: sensorReadings });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateHub(req: Request, res: Response) {
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

    const { hubId } = req.params;
    const { processorName} = req.body;
    if ([hubId, processorName].includes(undefined)) {
      return res.status(400).json({ error: "Missing information!" });
    }

    let hubUpdated= await updateHubByHubId(Number(hubId), {processorName:processorName});

    return res.status(200).json({ hub: hubUpdated });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateSensor(req: Request, res: Response) {
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

    const { sensorId } = req.params;
    const { sensorName, sensorType} = req.body;
    if (sensorId === undefined || [sensorName, sensorType].includes(undefined)) {
      return res.status(400).json({ error: "Missing information!" });
    }

    const data: any = {};
    if (sensorName !== undefined){
      data["sensorName"] =sensorName
    }
    if (sensorType !== undefined){
      data["sensorType"] =sensorType
    }

    let sensorUpdated= await updateSensorById(Number(sensorId), data);

    return res.status(200).json({ sensor: sensorUpdated });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteHub(req: Request, res: Response) {
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

    const { hubId } = req.params;

    await deleteHubById(Number(hubId));

    return res.status(200);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteSensor(req: Request, res: Response) {
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

    const { sensorId } = req.params;

    await deleteSensorById(Number(sensorId));

    return res.status(200);
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

export async function getSensorMaintenanceSuggestions(req: Request, res: Response) {
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

    let sensors = await getAllSensorMaintenanceSuggestions();
    return res.status(200).json({ sensors: sensors });
  } catch (error: any) {
    console.log("error", error);
    res.status(400).json({ error: error.message });
  }
}

export async function assignMaintenanceStaffToSensor(req: Request, res: Response) {
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

    const { employeeId } = req.body;
    const { sensorId } = req.params;

    if ([sensorId, employeeId].includes(undefined)) {
      return res.status(400).json({ error: "Missing information!" });
    }

    let sensor: Sensor = await assignMaintenanceStaffToSensorById(
      Number(sensorId),
      Number(employeeId)
    );

    return res.status(200).json({ sensor: sensor.toFullJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function removeMaintenanceStaffFromSensor(req: Request, res: Response) {
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

    const { employeeId } = req.body;
    const { sensorId } = req.params;

    if ([sensorId, employeeId].includes(undefined)) {
      return res.status(400).json({ error: "Missing information!" });
    }

    let sensor: Sensor = await removeMaintenanceStaffFromSensorById(
      Number(sensorId),
      Number(employeeId)
    );

    return res.status(200).json({ sensor: await sensor.toFullJSON() });
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

export async function createNewAnimalFeed(req: Request, res: Response) {
  try {
    const animalFeedImageUrl = await handleFileUpload(
      req,
      process.env.IMG_URL_ROOT! + "animalFeed", //"D:/capstoneUploads/animalFeed",
    );
    const {
      animalFeedName,     
      animalFeedCategory
    } = req.body;

    if (
      [
        animalFeedName,
        animalFeedCategory
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        animalFeedName,
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
    console.log(error);
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

export async function updateAnimalFeedController(req: Request, res: Response) {
  try {
    const {
      animalFeedName,
      animalFeedCategory
    } = req.body;

    if (
      [
        animalFeedName,
        animalFeedCategory
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        animalFeedName,
        animalFeedCategory
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let animalFeed = await AnimalFeedService.updateAnimalFeed(
      animalFeedName,
      animalFeedCategory
    );

    return res.status(200).json({ animalFeed });
  } catch (error: any) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
}

export async function updateAnimalFeedImageController(req: Request, res: Response) {
  try {
    // req has image??
    const imageUrl = await handleFileUpload(
      req,
      process.env.IMG_URL_ROOT! + "animalFeed", //"D:/capstoneUploads/animalFeed",
    );
    const {
      animalFeedName
    } = req.body;

    if (
      [
        animalFeedName
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        animalFeedName
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let animalFeed = await AnimalFeedService.updateAnimalFeedImage(
      animalFeedName,
      imageUrl
    );

    return res.status(200).json({ animalFeed });
  } catch (error: any) {
    console.log(error)
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
    const enrichmentItemImageUrl = await handleFileUpload(
      req,
      process.env.IMG_URL_ROOT! + "enrichmentItem", //"D:/capstoneUploads/enrichmentItem",
    );
    const {
      enrichmentItemName
    } = req.body;

    if (
      [
        enrichmentItemName
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        enrichmentItemName
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
