import { Request, Response } from "express";
import { findEmployeeByEmail } from "../services/employee";
import { GeneralStaffType, PlannerType } from "../models/enumerated";
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
  getHubProcessorById,
  initializeHubProcessor,
  removeMaintenanceStaffFromFacilityById,
  removeMaintenanceStaffFromSensorById,
  removeOperationStaffFromFacilityById,
  updateFacilityByFacilityId,
  updateHubByHubId,
  updateSensorById,
  getMaintenanceStaffsByFacilityId,
  getAllMaintenanceStaff,
  getAllSensorMaintenanceLogs,
  getFacilityLogs,
  createFacilityLog,
  getSensor,
  createSensorMaintenanceLog,
  createFacilityMaintenanceLog,
  findProcessorByName,
  createNewSensorReading,
} from "../services/assetFacility";
import { Facility } from "../models/facility";
import { Sensor } from "../models/sensor";
import { HubProcessor } from "../models/hubProcessor";
import { handleFileUpload } from "../helpers/multerProcessFile";
import * as AnimalFeedService from "../services/animalFeed";
import * as EnrichmentItemService from "../services/enrichmentItem";
import { compareDates } from "../helpers/others";
import { InHouse } from "../models/inHouse";
import { FacilityLog } from "../models/facilityLog";

export async function createFacilityController(req: Request, res: Response) {
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
      isSheltered,
      facilityDetail,
      facilityDetailJson,
    } = req.body;
    console.log({
      facilityName,
      isSheltered,
      facilityDetail,
      facilityDetailJson,
    })
    if (
      [
        facilityName,
        isSheltered,
        facilityDetail,
        facilityDetailJson,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        facilityName,
        isSheltered,
        facilityDetail,
        facilityDetailJson,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let facility = await createNewFacility(
      facilityName,
      undefined,
      undefined,
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

    const _includes: string[] = []
    for (const role of ["hubProcessors"]) {
      if (includes.includes(role)) _includes.push(role)
    }

    let facilities: Facility[] = await getAllFacility(_includes, includes.includes("facilityDetail"));
    facilities.forEach(facility => facility.toJSON())

    return res.status(200).json({ facilities: facilities });
  } catch (error: any) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
}

export async function getMyOperationFacilityController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (!(await employee.getGeneralStaff()) || (await employee.getGeneralStaff()).isDisabled) {
      return res
        .status(403)
        .json({ error: "Access Denied! General staff only!" });
    };

    const facility = await (await (await (await employee.getGeneralStaff())?.getOperatedFacility())?.getFacility())?.toFullJson();
    return res.status(200).json({ facility: (facility ? facility : {}) });
  } catch (error: any) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
}

export async function getMyMaintainedFacilityController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (!(await employee.getGeneralStaff()) || (await employee.getGeneralStaff()).isDisabled) {
      return res
        .status(403)
        .json({ error: "Access Denied! General staff only!" });
    }

    let inHouses = await (await employee.getGeneralStaff())?.getMaintainedFacilities() || [];
    const facilities = []
    for (const inHouse of inHouses) {
      facilities.push(await (await inHouse.getFacility()).toFullJson());
    }

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

    // if (
    //   !(
    //     (await employee.getPlanningStaff())?.plannerType ==
    //     PlannerType.OPERATIONS_MANAGER
    //   )
    // )
    //   return res
    //     .status(403)
    //     .json({ error: "Access Denied! Operation managers only!" });

    let { facilityId } = req.params
    let { includes } = req.body;
    includes = includes || [];

    const _includes: string[] = []
    for (const role of ["hubProcessors"]) {
      if (includes.includes(role)) _includes.push(role)
    }

    let facility: Facility = await getFacilityById(Number(facilityId), _includes);
    return res.status(200).json({ facility: await facility.toFullJson() });
  } catch (error: any) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
}

export async function getFacilityMaintenanceSuggestionsController(req: Request, res: Response) {
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

export async function updateFacilityController(req: Request, res: Response) {
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
      isSheltered,
      facilityDetailJson,
    } = req.body;

    if (
      !facilityId ||
      [facilityName, xCoordinate, yCoordinate, facilityDetailJson, isSheltered].every(
        (field) => field === undefined,
      )
    ) {
      return res.status(400).json({ error: "Missing information!" });
    }

    const facilityAttribute: any = {}

    for (const [field, v] of Object.entries({
      facilityName: facilityName,
      xCoordinate: Number(xCoordinate),
      yCoordinate: Number(yCoordinate),
      isSheltered: isSheltered
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
    console.log("staffs", staffs)
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

    const _includes: string[] = []
    for (const role of ["sensors", "facility"]) {
      if (includes.includes(role)) _includes.push(role)
    }

    let staffs = await getAllMaintenanceStaff(_includes);

    return res.status(200).json({ maintenanceStaffs: staffs });
  } catch (error: any) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
}

export async function assignMaintenanceStaffToFacilityController(req: Request, res: Response) {
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

    return res.status(200).json({ inHouse: await inHouse.toFullJSON() });
  } catch (error: any) {
    console.log("error", error)
    res.status(400).json({ error: error.message });
  }
}

export async function removeMaintenanceStaffFromFacilityController(req: Request, res: Response) {
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

    return res.status(200).json({ inHouse: await inHouse.toFullJSON() });
  } catch (error: any) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
}

export async function assignOperationStaffToFacilityController(req: Request, res: Response) {
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

    return res.status(200).json({ inHouse: await inHouse.toFullJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function removeOperationStaffFromFacilityController(req: Request, res: Response) {
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

    return res.status(200).json({ inHouse: await inHouse.toFullJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getFacilityLogsController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    // const employee = await findEmployeeByEmail(email);

    const { facilityId } = req.params;

    if (facilityId === undefined) {
      return res.status(400).json({ error: "Missing information!" });
    }

    let facilityLogs: FacilityLog[] = await getFacilityLogs(
      Number(facilityId)
    );

    return res.status(200).json({ facilityLogs: facilityLogs });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function createFacilityLogController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    // const employee = await findEmployeeByEmail(email);

    const { facilityId } = req.params;
    const { title, details, remarks } = req.body;

    if ([facilityId, title, details, remarks].includes(undefined)) {
      return res.status(400).json({ error: "Missing information!" });
    }

    let facilityLog: FacilityLog = await createFacilityLog(
      Number(facilityId),
      false,
      title,
      details,
      remarks
    );

    return res.status(200).json({ facilityLog: facilityLog });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function createFacilityMaintenanceLogController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !(
        (await employee.getGeneralStaff())?.generalStaffType ==
        GeneralStaffType.ZOO_MAINTENANCE
      ) && !(
        (await employee.getPlanningStaff())?.plannerType ==
        PlannerType.OPERATIONS_MANAGER
      )
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });

    const { facilityId } = req.params;
    const { title, details, remarks } = req.body;
    if ([facilityId, title, details, remarks].includes(undefined)) {
      return res.status(400).json({ error: "Missing information!" });
    }

    let maintenanceLog = await createFacilityMaintenanceLog(Number(facilityId), new Date(), title, details, remarks);

    return res.status(200).json({ maintenanceLog: maintenanceLog });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteFacilityController(req: Request, res: Response) {
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
    if (facilityId === undefined) return res.status(400).json({ error: "Missing information!" });

    await deleteFacilityById(Number(facilityId));

    return res.status(200).json({ result: "Success!" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function addHubToFacilityController(req: Request, res: Response) {
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

export async function getAllHubsController(req: Request, res: Response) {
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

    const _includes: string[] = []
    for (const role of ["sensors", "facility"]) {
      if (includes.includes(role)) _includes.push(role)
    }

    let hubs: HubProcessor[] = await _getAllHubs(_includes);

    hubs.forEach(hub => hub.toJSON())

    return res.status(200).json({ hubs: hubs });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getHubProcessorController(req: Request, res: Response) {
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

    let { hubProcessorId } = req.params
    let { includes } = req.body;
    includes = includes || [];

    const _includes: string[] = []
    for (const role of ["sensors", "facility"]) {
      if (includes.includes(role)) _includes.push(role)
    }

    let hubProcessor: HubProcessor = await getHubProcessorById(Number(hubProcessorId), _includes);
    return res.status(200).json({ hubProcessor: hubProcessor });
  } catch (error: any) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
}

export async function getAllSensorsController(req: Request, res: Response) {
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

    const _includes: string[] = []
    for (const role of ["hubProcessor", "sensorReadings", "generalStaff"]) {
      if (includes.includes(role)) _includes.push(role)
    }

    let sensors: Sensor[] = await _getAllSensors(_includes);

    sensors.forEach(sensor => sensor.toJSON())

    return res.status(200).json({ sensors: sensors });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getSensorController(req: Request, res: Response) {
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
    const { includes = [] } = req.body;

    if (sensorId === undefined) {
      return res.status(400).json({ error: "Missing information!" });
    }

    const _includes: string[] = []
    for (const role of ["hubProcessor", "sensorReadings", "maintenanceLogs", "generalStaff"]) {
      if (includes.includes(role)) _includes.push(role)
    }

    let sensor: Sensor = await getSensor(Number(sensorId), includes);

    return res.status(200).json({ sensor: sensor });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getSensorReadingController(req: Request, res: Response) {
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
      compareDates(reading.readingDate, new Date(endDate)) <= 0);

    sensorReadings.forEach(reading => reading.toJSON())

    return res.status(200).json({ sensorReadings: sensorReadings });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateHubController(req: Request, res: Response) {
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

    const { hubProcessorId } = req.params;
    const { processorName } = req.body;
    if ([hubProcessorId, processorName].includes(undefined)) {
      return res.status(400).json({ error: "Missing information!" });
    }

    let hubUpdated = await updateHubByHubId(Number(hubProcessorId), { processorName: processorName });

    return res.status(200).json({ hub: hubUpdated });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateSensorController(req: Request, res: Response) {
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
    const { sensorName, sensorType } = req.body;
    if (sensorId === undefined || [sensorName, sensorType].includes(undefined)) {
      return res.status(400).json({ error: "Missing information!" });
    }

    const data: any = {};
    if (sensorName !== undefined) {
      data["sensorName"] = sensorName
    }
    if (sensorType !== undefined) {
      data["sensorType"] = sensorType
    }

    let sensorUpdated = await updateSensorById(Number(sensorId), data);

    return res.status(200).json({ sensor: sensorUpdated });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteHubController(req: Request, res: Response) {
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

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteSensorController(req: Request, res: Response) {
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

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function createSensorMaintenanceLogController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !(
        (await employee.getGeneralStaff())?.generalStaffType ==
        GeneralStaffType.ZOO_MAINTENANCE
      ) && !(
        (await employee.getPlanningStaff())?.plannerType ==
        PlannerType.OPERATIONS_MANAGER
      )
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });

    const { sensorId } = req.params;
    const { title, details, remarks } = req.body;
    if ([sensorId, title, details, remarks].includes(undefined)) {
      return res.status(400).json({ error: "Missing information!" });
    }

    let maintenanceLog = await createSensorMaintenanceLog(Number(sensorId), new Date(), title, details, remarks);

    return res.status(200).json({ maintenanceLog: maintenanceLog });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllSensorMaintenanceLogsController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !(
        (await employee.getGeneralStaff())?.generalStaffType ==
        GeneralStaffType.ZOO_MAINTENANCE
      ) && !(
        (await employee.getPlanningStaff())?.plannerType ==
        PlannerType.OPERATIONS_MANAGER
      )
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });

    const { sensorId } = req.params;
    if (sensorId === undefined) {
      return res.status(400).json({ error: "Missing information!" });
    }

    let maintenanceLogs = await getAllSensorMaintenanceLogs(Number(sensorId));

    return res.status(200).json({ maintenanceLog: maintenanceLogs });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function addSensorToHubController(req: Request, res: Response) {
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

export async function initializeHubController(req: Request, res: Response) {
  try {
    const { processorName } = req.body;
    // const {processorName} = req.body;

    let ipaddress = req.socket.remoteAddress || "127.0.0.1";
    ipaddress = ipaddress == "::1" ? "127.0.0.1" : ipaddress.split(":")[3]
    const token = await initializeHubProcessor(processorName, ipaddress);
    return res.status(200).json({ token: token });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function pushSensorReadingsController(req: Request, res: Response) {
  try {
    const { jsonPayloadString, sha256 } = req.body;
    const { processorName } = req.params;

    let ipaddress = req.socket.remoteAddress || "127.0.0.1";
    ipaddress = ipaddress == "::1" ? "127.0.0.1" : ipaddress.split(":")[3]

    const processor = await  findProcessorByName(processorName);
    if (!processor.validatePayload(jsonPayloadString, sha256)){
      try{return res.status(417).json({ error: "Json validation failed. Digest does not match!" });}
      catch(err:any){return console.log(err)}
    }
    const payload = JSON.parse(jsonPayloadString);

    for (const sensor of payload){
      for (const sensorReading of payload[sensor]){
        await createNewSensorReading(sensor, sensorReading.readingDate, sensorReading.reading);
      }
    }
    
    processor.ipAddressName = ipaddress;
    processor.lastDataUpdate = new Date();
    processor.save();
    return res.status(200).json({ sensors: (await processor.getSensors()).map(sensor=>sensor.sensorName) });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getSensorMaintenanceSuggestionsController(req: Request, res: Response) {
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

export async function assignMaintenanceStaffToSensorController(req: Request, res: Response) {
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

    return res.status(200).json({ sensor: await sensor.toFullJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function removeMaintenanceStaffFromSensorController(req: Request, res: Response) {
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
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAuthorizationForCameraController(req: Request, res: Response) {
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
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function createNewAnimalFeedController(req: Request, res: Response) {
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

export async function getAllAnimalFeedController(req: Request, res: Response) {
  try {
    let animalFeeds = await AnimalFeedService.getAllAnimalFeed();
    animalFeeds.forEach(animalFeed => animalFeed.toJSON())
    return res.status(200).json({ animalFeeds: animalFeeds });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAnimalFeedByNameController(req: Request, res: Response) {
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
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAnimalFeedByIdController(req: Request, res: Response) {
  const { animalFeedId } = req.params;

  if (animalFeedId == undefined) {
    console.log("Missing field(s): ", {
      animalFeedId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const animalFeed = await AnimalFeedService.getAnimalFeedById(Number(animalFeedId));
    return res.status(200).json(animalFeed);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }

}

export async function updateAnimalFeedController(req: Request, res: Response) {
  try {
    let animalFeedImageUrl;
    if (
      req.headers["content-type"] &&
      req.headers["content-type"].includes("multipart/form-data")
    ) {
      animalFeedImageUrl = await handleFileUpload(
        req,
        process.env.IMG_URL_ROOT! + "species", //"D:/capstoneUploads/species",
      );
    } else {
      animalFeedImageUrl = req.body.imageUrl;
    }
    const {
      animalFeedId,
      animalFeedName,
      animalFeedCategory
    } = req.body;

    if (
      [animalFeedId,
        animalFeedName,
        animalFeedCategory
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        animalFeedId,
        animalFeedName,
        animalFeedCategory
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let animalFeed = await AnimalFeedService.updateAnimalFeed(
      animalFeedId,
      animalFeedName,
      animalFeedCategory,
      animalFeedImageUrl
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

export async function deleteAnimalFeedByNameController(req: Request, res: Response) {
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

export async function createNewEnrichmentItemController(req: Request, res: Response) {
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

export async function getAllEnrichmentItemController(req: Request, res: Response) {
  try {
    const allEnrichmentItem = await EnrichmentItemService.getAllEnrichmentItem();
    return res.status(200).json(allEnrichmentItem);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getEnrichmentItemByIdController(req: Request, res: Response) {
  const { enrichmentItemId } = req.params;
  console.log(enrichmentItemId)
  if (enrichmentItemId == undefined) {
    console.log("Missing field(s): ", {
      enrichmentItemId: enrichmentItemId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const enrichmentItem = await EnrichmentItemService.getEnrichmentItemById(Number(enrichmentItemId));

    console.log("enrichmentItem", enrichmentItem)
    return res.status(200).json({ enrichmentItem: enrichmentItem });
  } catch (error: any) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
}

export async function updateEnrichmentItemController(req: Request, res: Response) {
  try {
    const {
      enrichmentItemId,
      enrichmentItemName
    } = req.body;

    if (
      [
        enrichmentItemId,
        enrichmentItemName
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        enrichmentItemId,
        enrichmentItemName
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let enrichmentItem = await EnrichmentItemService.updateEnrichmentItem(enrichmentItemId, enrichmentItemName);

    return res.status(200).json({ enrichmentItem });
  } catch (error: any) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
}

export async function updateEnrichmentItemImageController(req: Request, res: Response) {
  try {
    const imageUrl = await handleFileUpload(
      req,
      process.env.IMG_URL_ROOT! + "enrichmentItem", //"D:/capstoneUploads/enrichmentItem",
    );
    const {
      enrichmentItemId,
      enrichmentItemName
    } = req.body;

    if (
      [
        enrichmentItemName,
        imageUrl
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        enrichmentItemName,
        imageUrl
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let enrichmentItem = await EnrichmentItemService.updateEnrichmentItemImage(
      enrichmentItemId,
      enrichmentItemName,
      imageUrl
    );

    return res.status(200).json({ enrichmentItem });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteEnrichmentItemByNameController(req: Request, res: Response) {
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
