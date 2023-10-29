import { Request, Response } from "express";
import { findEmployeeByEmail } from "../services/employee";
import {
  FacilityLogType,
  GeneralStaffType,
  PlannerType,
} from "../models/enumerated";
import {
  getAllFacility,
  getAllHubs,
  getAllSensors,
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
  getSensorMaintenanceSuggestions,
  getFacilityMaintenanceSuggestions,
  getEarliestReadingBySensorId,
  updateFacilityLog,
  getFacilityLogById,
  deleteFacilityLogById,
  updateSensorMaintenanceLog,
  deleteSensorMaintenanceLogById,
  getSensorMaintenanceLogById,
  createNewZone,
  getAllZones,
  getZoneById,
  updateZone,
  deleteZoneById,
  completeRepairTicket,
  createCustomerReport,
  getAllCustomerReports,
  updateCustomerReport,
  updateFacilityImage,
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
import { GeneralStaff } from "../models/generalStaff";
import { MaintenanceLog } from "../models/maintenanceLog";
import { CustomerReportLog } from "models/customerReportLog";

export async function createNewZoneController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    const { zoneName } = req.body;

    if ([zoneName].includes(undefined)) {
      console.log("Missing field(s): ", {
        zoneName,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let zone = await createNewZone(zoneName);

    return res.status(200).json({ zone: zone.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllZoneController(req: Request, res: Response) {
  try {
    const allZones = await getAllZones();
    return res
      .status(200)
      .json({ zones: allZones.map((zone) => zone.toJSON()) });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getZoneByIdController(req: Request, res: Response) {
  const { zoneId } = req.params;
  if (zoneId == "") {
    console.log("Missing field(s): ", {
      zoneId: zoneId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const zone = await getZoneById(Number(zoneId));

    return res.status(200).json({ zone: zone.toJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function updateZoneController(req: Request, res: Response) {
  const { zoneId } = req.params;
  const { zoneName } = req.body;

  if ([zoneName, zoneId].includes(undefined)) {
    console.log("Missing field(s): ", {
      zoneName,
      zoneId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const zone = await updateZone(Number(zoneId), zoneName);

    return res.status(200).json({ zone: zone.toJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function deleteZoneController(req: Request, res: Response) {
  const { email } = (req as any).locals.jwtPayload;
  const employee = await findEmployeeByEmail(email);

  const { zoneId } = req.params;

  if (zoneId == undefined) {
    console.log("Missing field(s): ", {
      zoneId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    await deleteZoneById(Number(zoneId));
    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function createFacilityController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
      !(
        (await employee.getPlanningStaff())?.plannerType ==
        PlannerType.OPERATIONS_MANAGER
      )
    ) {
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });
    }

    const imageUrl = await handleFileUpload(
      req,
      process.env.IMG_URL_ROOT! + "facility", //"D:/capstoneUploads/animalFeed",
    );

    const { facilityName, isSheltered, facilityDetail, facilityDetailJson } =
      req.body;
    console.log({
      facilityName,
      isSheltered,
      facilityDetail,
      facilityDetailJson,
    });
    if (
      [facilityName, isSheltered, facilityDetail, facilityDetailJson].includes(
        undefined,
      )
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
      imageUrl
    );

    return res.status(200).json({ facility: facility.toJSON() });
  } catch (error: any) {
    console.log("val error", error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAllFacilityController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    // if (
    //   !(
    //     (await employee.getPlanningStaff())?.plannerType ==
    //     PlannerType.OPERATIONS_MANAGER
    //   ) && !(await employee.getGeneralStaff())
    // )
    //   return res
    //     .status(403)
    //     .json({ error: "Access Denied! Operation managers and general staffs only!" });

    let { includes } = req.body;
    includes = includes || [];

    const _includes: string[] = [];
    for (const role of ["hubProcessors"]) {
      if (includes.includes(role)) _includes.push(role);
    }
    if (
      (await employee.getPlanningStaff())?.plannerType ==
      PlannerType.OPERATIONS_MANAGER
    ) {
      let facilities: Facility[] = [];
      for (const facility of await getAllFacility(
        _includes,
        includes.includes("facilityDetail"),
      )) {
        facilities.push(await facility.toFullJson());
      }
      return res.status(200).json({ facilities: facilities });
    }

    let facilities: Facility[] = [];

    for (const inHouse of await (
      await employee.getGeneralStaff()
    ).getMaintainedFacilities()) {
      facilities.push(await (await inHouse.getFacility()).toFullJson());
    }
    const inHouse = await (
      await employee.getGeneralStaff()
    ).getOperatedFacility();
    if (inHouse)
      facilities.push(await (await inHouse.getFacility()).toFullJson());

    return res.status(200).json({ facilities: facilities });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAllFacilityCustomer(req: Request, res: Response) {
  try {
    let { includes } = req.body;
    includes = includes || [];

    const _includes: string[] = [];
    for (const role of ["hubProcessors"]) {
      if (includes.includes(role)) _includes.push(role);
    }

    let facilities: Facility[] = [];
    for (const facility of await getAllFacility(
      _includes,
      includes.includes("facilityDetail"),
    )) {
      facilities.push(await facility.toFullJson());
    }
    return res.status(200).json({ facilities: facilities });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getMyOperationFacilityController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
      (!(await employee.getGeneralStaff()) ||
        (await employee.getGeneralStaff()).isDisabled)
    ) {
      return res
        .status(403)
        .json({ error: "Access Denied! General staff only!" });
    }

    const facility = await (
      await (
        await (await employee.getGeneralStaff())?.getOperatedFacility()
      )?.getFacility()
    )?.toFullJson();
    return res.status(200).json({ facility: facility ? facility : {} });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getMyMaintainedFacilityController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
      (!(await employee.getGeneralStaff()) ||
        (await employee.getGeneralStaff()).isDisabled)
    ) {
      return res
        .status(403)
        .json({ error: "Access Denied! General staff only!" });
    }

    let inHouses =
      (await (await employee.getGeneralStaff())?.getMaintainedFacilities()) ||
      [];
    const facilities = [];
    for (const inHouse of inHouses) {
      facilities.push(await (await inHouse.getFacility()).toFullJson());
    }

    return res.status(200).json({ facilities: facilities });
  } catch (error: any) {
    console.log(error);
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

    let { facilityId } = req.params;
    let { includes } = req.body;
    includes = includes || [];

    const _includes: string[] = [];
    for (const role of ["hubProcessors"]) {
      if (includes.includes(role)) _includes.push(role);
    }

    let facility: Facility = await getFacilityById(
      Number(facilityId),
      _includes,
    );
    return res.status(200).json({ facility: await facility.toFullJson() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getFacilityMaintenanceSuggestionsController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
      !(
        (await employee.getPlanningStaff())?.plannerType ==
        PlannerType.OPERATIONS_MANAGER
      ) &&
      !(await employee.getGeneralStaff())
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });
    let facilities = await getAllFacilityMaintenanceSuggestions(employee);
    return res
      .status(200)
      .json({ facilities: facilities?.map((facility) => facility.toJSON()) });
  } catch (error: any) {
    console.log("error", error);
    res.status(400).json({ error: error.message });
  }
}

export async function getFacilityMaintenancePredictionValuesController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
      !(
        (await employee.getPlanningStaff())?.plannerType ==
        PlannerType.OPERATIONS_MANAGER
      ) &&
      !(await employee.getGeneralStaff())
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });

    const { facilityId } = req.params;
    let values = undefined;
    for (let i = 4; i > 0; i--) {
      try {
        values = await getFacilityMaintenanceSuggestions(Number(facilityId), i);
        break;
      } catch (err: any) {
        console.log(err);
      }
    }
    return res.status(200).json({ values: values });
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
      !employee.superAdmin &&
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
      showOnMap,
    } = req.body;

    if (
      !facilityId ||
      [
        facilityName,
        xCoordinate,
        yCoordinate,
        facilityDetailJson,
        isSheltered,
        showOnMap,
      ].every((field) => field === undefined)
    ) {
      return res.status(400).json({ error: "Missing information!" });
    }

    const facilityAttribute: any = {};

    for (const [field, v] of Object.entries({
      facilityName: facilityName,
      xCoordinate: xCoordinate == null ? xCoordinate : Number(xCoordinate),
      yCoordinate: yCoordinate == null ? yCoordinate : Number(yCoordinate),
      isSheltered: isSheltered,
      showOnMap: showOnMap,
    })) {
      if (v !== undefined) {
        facilityAttribute[field] = v;
      }
    }
    const newFacility = await updateFacilityByFacilityId(
      Number(facilityId),
      facilityAttribute,
      facilityDetailJson,
    );

    return res.status(200).json({ facility: newFacility.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateFacilityImageController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
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

    if (facilityId === undefined || facilityId == "") throw {message:"Missing information!"}

    const imageUrl = await handleFileUpload(
      req,
      process.env.IMG_URL_ROOT! + "facility", //"D:/capstoneUploads/animalFeed",
    );

    await updateFacilityImage(
      Number(facilityId),
      imageUrl,
    );

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAssignedMaintenanceStaffOfFacilityController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
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

    let staffs = await getMaintenanceStaffsByFacilityId(Number(facilityId));
    console.log("staffs", staffs);
    return res
      .status(200)
      .json({ maintenanceStaffs: staffs?.map((emp) => emp.toJSON()) });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAllMaintenanceStaffController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
      !(
        (await employee.getPlanningStaff())?.plannerType ==
        PlannerType.OPERATIONS_MANAGER
      )
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });

    const { includes = [] } = req.body;

    const _includes: string[] = [];
    for (const role of ["sensors", "facility"]) {
      if (includes.includes(role)) _includes.push(role);
    }

    let staffs = await getAllMaintenanceStaff(_includes);

    return res
      .status(200)
      .json({ maintenanceStaffs: staffs?.map((emp) => emp.toJSON()) });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function assignMaintenanceStaffToFacilityController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
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

    let inHouse: InHouse = await assignMaintenanceStaffToFacilityById(
      Number(facilityId),
      employeeIds,
    );

    return res.status(200).json({ inHouse: await inHouse.toFullJSON() });
  } catch (error: any) {
    console.log("error", error);
    res.status(400).json({ error: error.message });
  }
}

export async function removeMaintenanceStaffFromFacilityController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
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

    let inHouse: InHouse = await removeMaintenanceStaffFromFacilityById(
      Number(facilityId),
      employeeIds,
    );

    return res.status(200).json({ inHouse: await inHouse.toFullJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function assignOperationStaffToFacilityController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
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

    let inHouse: InHouse = await assignOperationStaffToFacilityById(
      Number(facilityId),
      employeeIds,
    );

    return res.status(200).json({ inHouse: await inHouse.toFullJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function removeOperationStaffFromFacilityController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
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

    let inHouse: InHouse = await removeOperationStaffFromFacilityById(
      Number(facilityId),
      employeeIds,
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

    let facilityLogs: FacilityLog[] = await getFacilityLogs(Number(facilityId));
    return res
      .status(200)
      .json({ facilityLogs: facilityLogs?.map((log) => log.toJSON()) });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getFacilityLogByIdController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    // const employee = await findEmployeeByEmail(email);

    const { facilityLogId } = req.params;
    let { includes } = req.body;
    includes = includes || [];

    if (facilityLogId == "") {
      return res.status(400).json({ error: "Missing information!" });
    }

    const _includes: any[] = [];
    for (const role of ["inHouse", "generalStaffs"]) {
      if (includes.includes(role)) {
        if (role == "inHouse") {
          _includes.push({
            association: role,
            required: false,
            include: [
              {
                association: "facility",
                required: true,
              },
            ],
          });
        } else {
          _includes.push({
            association: role,
            required: false,
          });
        }
      }
    }

    let facilityLog: FacilityLog = await getFacilityLogById(
      Number(facilityLogId),
      _includes,
    );

    return res.status(200).json({ facilityLog: facilityLog.toJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function createCustomerReportController(
  req: Request,
  res: Response,
) {
  try {
    // const { email } = (req as any).locals.jwtPayload;
    // const employee = await findEmployeeByEmail(email);

    const { facilityId } = req.params;
    let {
      dateTime,
      title,
      remarks,
      viewed,
     } = req.body;

    if (facilityId == ""  || [
      dateTime,
      title,
      remarks,
      viewed,
    ].includes(undefined)) {
      return res.status(400).json({ error: "Missing information!" });
    }

    let customerReportLog: CustomerReportLog = await createCustomerReport(
      Number(facilityId),
      dateTime,
      title,
      remarks,
      viewed,
    );

    return res.status(200).json({ customerReportLog: customerReportLog.toJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAllCustomerReportsController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    // const { facilityLogId } = req.params;
    // let { includes } = req.body;

    let customerReportLogs: CustomerReportLog[] = await getAllCustomerReports();

    return res.status(200).json({ customerReportLogs: customerReportLogs.map(log=>log.toJSON()) });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function updateCustomerReportController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    // const employee = await findEmployeeByEmail(email);

    const { facilityLogId } = req.params;
    let { 
      customerReportLogId,
      customerReportLogIds,
      viewed,
     } = req.body;

    if (viewed === undefined || (customerReportLogId === undefined && customerReportLogIds===undefined)) {
      return res.status(400).json({ error: "Missing information!" });
    }
    if (customerReportLogId){
      await updateCustomerReport(
        Number(customerReportLogId),
        viewed,
      );
    }else{
      for (const customerReportLogId of customerReportLogIds){
        await updateCustomerReport(
          Number(customerReportLogId),
          viewed,
        );
      }
    }

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function createFacilityLogController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    const { facilityId } = req.params;
    const { title, details, remarks, facilityLogType, employeeIds } = req.body;

    if (
      [facilityId, title, details, remarks, facilityLogType].includes(undefined)
    ) {
      return res.status(400).json({
        error: "Missing information!",
      });
    }

    if (
      !employee.superAdmin &&
      !(
        ((await employee.getGeneralStaff())?.generalStaffType ==
          GeneralStaffType.ZOO_MAINTENANCE &&
          facilityLogType == FacilityLogType.MAINTENANCE_LOG) ||
        ((await employee.getGeneralStaff())?.generalStaffType ==
          GeneralStaffType.ZOO_OPERATIONS &&
          facilityLogType == FacilityLogType.OPERATION_LOG)
      ) &&
      !(await employee.getPlanningStaff())
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });

    let facilityLog: FacilityLog = await createFacilityLog(
      Number(facilityId),
      title,
      details,
      remarks,
      employee.employeeName,
      facilityLogType,
      employeeIds,
    );

    return res.status(200).json({ facilityLog: facilityLog.toJSON() });
  } catch (error: any) {
    console.log("error");
    res.status(400).json({ error: error.message });
  }
}

export async function createFacilityMaintenanceLogController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
      !(
        (await employee.getGeneralStaff())?.generalStaffType ==
        GeneralStaffType.ZOO_MAINTENANCE
      ) &&
      !(await employee.getPlanningStaff())
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });

    const { facilityId } = req.params;
    const { title, details, remarks } = req.body;
    if ([facilityId, title, details, remarks].includes(undefined)) {
      return res.status(400).json({ error: "Missing information!" });
    }

    let maintenanceLog = await createFacilityMaintenanceLog(
      Number(facilityId),
      new Date(),
      title,
      details,
      remarks,
      employee.employeeName,
    );
    // const generalStaff = await employee.getGeneralStaff();
    // const facilities = await generalStaff?.getMaintainedFacilities() || [];
    // for (const facility of facilities) {
    //   if ((await facility.getFacility()).facilityId == Number(facilityId))
    //     generalStaff.removeMaintainedFacility(facility);
    // }
    // await generalStaff?.save();

    return res.status(200).json({ maintenanceLog: maintenanceLog.toJSON() });
  } catch (error: any) {
    console.log("error", error);
    res.status(400).json({ error: error.message });
  }
}

export async function updateFacilityLogController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    const { facilityLogId } = req.params;
    const { title, details, remarks } = req.body;

    if (facilityLogId == "" || [title, details, remarks].includes(undefined)) {
      return res.status(400).json({ error: "Missing information!" });
    }

    const facilityLogFound = await getFacilityLogById(Number(facilityLogId));

    const employees = [];
    for (const staff of await facilityLogFound.getGeneralStaffs()) {
      employees.push(await staff.getEmployee());
    }

    if (
      (await employee.getPlanningStaff())?.plannerType !=
        PlannerType.OPERATIONS_MANAGER &&
      !employee.superAdmin &&
      facilityLogFound.staffName != employee.employeeName &&
      !employees.find((emp) => emp.employeeId == employee.employeeId)
    )
      throw { message: "Only creator of the log can edit!" };

    let facilityLog: FacilityLog = await updateFacilityLog(
      Number(facilityLogId),
      title,
      details,
      remarks,
    );

    return res.status(200).json({ facilityLog: facilityLog.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteFacilityLogController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    const { facilityLogId } = req.params;

    if (
      (await employee.getPlanningStaff())?.plannerType !=
        PlannerType.OPERATIONS_MANAGER &&
      !employee.superAdmin &&
      (await getFacilityLogById(Number(facilityLogId)))?.staffName !=
        employee.employeeName
    )
      throw { message: "Only creator of the log can delete!" };

    if ([facilityLogId].includes("")) {
      return res.status(400).json({ error: "Missing information!" });
    }

    await deleteFacilityLogById(Number(facilityLogId));

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function completeRepairTicketController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    const { facilityLogId } = req.params;

    const facilityLogFound = await getFacilityLogById(Number(facilityLogId));

    const employees = [];
    for (const staff of await facilityLogFound.getGeneralStaffs()) {
      employees.push(await staff.getEmployee());
    }

    if (
      (await employee.getPlanningStaff())?.plannerType !=
        PlannerType.OPERATIONS_MANAGER &&
      !employee.superAdmin &&
      !employees.find((emp) => emp.employeeId == employee.employeeId)
    )
      throw { message: "Only creator of the log can delete!" };

    if ([facilityLogId].includes("")) {
      return res.status(400).json({ error: "Missing information!" });
    }

    await completeRepairTicket(Number(facilityLogId));

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    console.log("error", error);
    res.status(400).json({ error: error.message });
  }
}

export async function deleteFacilityController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
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
    if (facilityId === undefined)
      return res.status(400).json({ error: "Missing information!" });

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
      !employee.superAdmin &&
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
      !employee.superAdmin &&
      !(
        (await employee.getPlanningStaff())?.plannerType ==
        PlannerType.OPERATIONS_MANAGER
      )
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });

    const { includes = [] } = req.body;

    const _includes: string[] = [];
    for (const role of ["sensors", "facility"]) {
      if (includes.includes(role)) _includes.push(role);
    }

    let hubs: HubProcessor[] = await getAllHubs(_includes);

    return res.status(200).json({ hubs: hubs.map((hub) => hub.toJSON()) });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getHubProcessorController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
      !(
        (await employee.getPlanningStaff())?.plannerType ==
        PlannerType.OPERATIONS_MANAGER
      ) &&
      !(await employee.getGeneralStaff())
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });

    let { hubProcessorId } = req.params;
    let { includes } = req.body;
    includes = includes || [];

    const _includes: string[] = [];
    for (const role of ["sensors", "facility"]) {
      if (includes.includes(role)) _includes.push(role);
    }

    let hubProcessor: HubProcessor = await getHubProcessorById(
      Number(hubProcessorId),
      _includes,
    );
    return res.status(200).json({ hubProcessor: hubProcessor.toJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAllSensorsController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
      !(
        (await employee.getPlanningStaff())?.plannerType ==
        PlannerType.OPERATIONS_MANAGER
      )
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });

    const { includes = [] } = req.body;

    const _includes: string[] = [];
    for (const role of ["hubProcessor", "sensorReadings", "generalStaff"]) {
      if (includes.includes(role)) _includes.push(role);
    }

    let sensors: Sensor[] = await getAllSensors(_includes);

    return res
      .status(200)
      .json({ sensors: sensors.map((sensor) => sensor.toJSON()) });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getSensorController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
      !(
        (await employee.getPlanningStaff())?.plannerType ==
        PlannerType.OPERATIONS_MANAGER
      ) &&
      !(await employee.getGeneralStaff())
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });

    const { sensorId } = req.params;
    const { includes = [] } = req.body;

    if (sensorId === undefined) {
      return res.status(400).json({ error: "Missing information!" });
    }

    const _includes: string[] = [];
    for (const role of [
      "hubProcessor",
      "sensorReadings",
      "maintenanceLogs",
      "generalStaff",
    ]) {
      if (includes.includes(role)) _includes.push(role);
    }

    let sensor: Sensor = await getSensor(Number(sensorId), includes);

    return res.status(200).json({ sensor: sensor.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getSensorReadingController(req: Request, res: Response) {
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

    const { sensorId } = req.params;
    const { startDate, endDate } = req.body;

    let sensorReadings = await getSensorReadingBySensorId(
      Number(sensorId),
      new Date(startDate),
      new Date(endDate),
    );
    let sensor = await getSensor(Number(sensorId), []);

    let earliestDate = await getEarliestReadingBySensorId(Number(sensorId));

    return res.status(200).json({
      sensorReadings: sensorReadings?.map((reading) => reading.toJSON()),
      sensor: sensor?.toJSON(),
      earlestDate: earliestDate?.getTime(),
    });
  } catch (error: any) {
    console.log("error", error);
    res.status(400).json({ error: error.message });
  }
}

export async function updateHubController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
      !(
        (await employee.getPlanningStaff())?.plannerType ==
        PlannerType.OPERATIONS_MANAGER
      )
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });

    const { hubProcessorId } = req.params;
    const { processorName, radioGroup } = req.body;
    if ([hubProcessorId, processorName, radioGroup].includes(undefined)) {
      return res.status(400).json({ error: "Missing information!" });
    }

    let hubUpdated = await updateHubByHubId(Number(hubProcessorId), {
      processorName: processorName,
      radioGroup: radioGroup,
    });

    return res.status(200).json({ hub: hubUpdated.toJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function updateSensorController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
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
    if (
      sensorId === undefined ||
      [sensorName, sensorType].includes(undefined)
    ) {
      return res.status(400).json({ error: "Missing information!" });
    }

    const data: any = {};
    if (sensorName !== undefined) {
      data["sensorName"] = sensorName;
    }
    if (sensorType !== undefined) {
      data["sensorType"] = sensorType;
    }

    let sensorUpdated = await updateSensorById(Number(sensorId), data);

    return res.status(200).json({ sensor: sensorUpdated.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteHubController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
      !(
        (await employee.getPlanningStaff())?.plannerType ==
        PlannerType.OPERATIONS_MANAGER
      )
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });

    const { hubProcessorId } = req.params;
    await deleteHubById(Number(hubProcessorId));

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
      !employee.superAdmin &&
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

export async function createSensorMaintenanceLogController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
      !(
        (await employee.getGeneralStaff())?.generalStaffType ==
        GeneralStaffType.ZOO_MAINTENANCE
      ) &&
      !(
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

    let sensor = await createSensorMaintenanceLog(
      Number(sensorId),
      new Date(),
      title,
      details,
      remarks,
      employee.employeeName,
    );
    // const generalStaff = await employee?.getGeneralStaff();
    // if (generalStaff) {
    //   let sensors = (await generalStaff?.getSensors()) || [];
    //   for (const sensor of sensors) {
    //     if (sensor.sensorId == Number(sensorId))
    //       generalStaff.removeSensor(sensor);
    //   }
    //   await generalStaff?.save();
    // }

    return res.status(200).json({ sensor: sensor.toFullJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getSensorMaintenanceLogController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    // const employee = await findEmployeeByEmail(email);

    const { sensorMaintenanceLogId } = req.params;

    if (sensorMaintenanceLogId == "") {
      return res.status(400).json({ error: "Missing information!" });
    }

    let maintenanceLog: MaintenanceLog = await getSensorMaintenanceLogById(
      Number(sensorMaintenanceLogId),
    );

    return res.status(200).json({ maintenanceLog: maintenanceLog.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllSensorMaintenanceLogsController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
      !(
        (await employee.getGeneralStaff())?.generalStaffType ==
        GeneralStaffType.ZOO_MAINTENANCE
      ) &&
      !(
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

    return res
      .status(200)
      .json({ maintenanceLog: maintenanceLogs.map((log) => log.toJSON()) });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateSensorMaintenanceLogController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    const { sensorMaintenanceLogId } = req.params;
    const { title, details, remarks } = req.body;

    if (
      sensorMaintenanceLogId == "" ||
      [title, details, remarks].includes(undefined)
    ) {
      return res.status(400).json({ error: "Missing information!" });
    }

    if (
      (await employee.getPlanningStaff()).plannerType !=
        PlannerType.OPERATIONS_MANAGER &&
      !employee.superAdmin &&
      (await getSensorMaintenanceLogById(Number(sensorMaintenanceLogId)))
        .staffName != employee.employeeName
    )
      throw { message: "Only creator of the log can edit!" };

    let maintenanceLog: MaintenanceLog = await updateSensorMaintenanceLog(
      Number(sensorMaintenanceLogId),
      title,
      details,
      remarks,
    );

    return res.status(200).json({ maintenanceLog: maintenanceLog.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteSensorMaintenanceLogController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    const { sensorMaintenanceLogId } = req.params;

    if ([sensorMaintenanceLogId].includes("")) {
      return res.status(400).json({ error: "Missing information!" });
    }

    if (
      (await employee.getPlanningStaff()).plannerType !=
        PlannerType.OPERATIONS_MANAGER &&
      !employee.superAdmin &&
      (await getSensorMaintenanceLogById(Number(sensorMaintenanceLogId)))
        .staffName != employee.employeeName
    )
      throw { message: "Only creator of the log can delete!" };

    await deleteSensorMaintenanceLogById(Number(sensorMaintenanceLogId));

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function addSensorToHubController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
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
    ipaddress = ipaddress == "::1" ? "127.0.0.1" : ipaddress.split(":")[3];
    const token = await initializeHubProcessor(processorName, ipaddress);
    return res.status(200).json({ token: token });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function pushSensorReadingsController(
  req: Request,
  res: Response,
) {
  try {
    const { jsonPayloadString, sha256 } = req.body;
    const { processorName } = req.params;

    let ipaddress = req.socket.remoteAddress || "127.0.0.1";
    ipaddress = ipaddress == "::1" ? "127.0.0.1" : ipaddress.split(":")[3];

    const processor: HubProcessor = await findProcessorByName(processorName);
    if (!processor.validatePayload(jsonPayloadString, sha256)) {
      try {
        return res
          .status(417)
          .json({ error: "Json validation failed. Digest does not match!" });
      } catch (err: any) {
        return console.log(err);
      }
    }
    const payload = JSON.parse(jsonPayloadString);

    for (const sensor of Object.keys(payload)) {
      for (const sensorReading of payload[sensor]) {
        await createNewSensorReading(
          sensor,
          sensorReading.readingDate,
          sensorReading.reading,
        );
      }
    }

    processor.ipAddressName = ipaddress;
    processor.lastDataUpdate = new Date();
    await processor.save();
    return res.status(200).json({
      sensors: (await processor.getSensors()).map(
        (sensor) => sensor.sensorName,
      ),
      radioGroup: processor.radioGroup,
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getSensorMaintenanceSuggestionsController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
      !(
        (await employee.getPlanningStaff())?.plannerType ==
        PlannerType.OPERATIONS_MANAGER
      ) &&
      !(await employee.getGeneralStaff())
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });

    let sensors = await getAllSensorMaintenanceSuggestions(employee);
    return res
      .status(200)
      .json({ sensors: sensors?.map((sensor) => sensor.toJSON()) });
  } catch (error: any) {
    console.log("error", error);
    res.status(400).json({ error: error.message });
  }
}

export async function getSensorMaintenancePredictionValuesController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
      !(
        (await employee.getPlanningStaff())?.plannerType ==
        PlannerType.OPERATIONS_MANAGER
      ) &&
      !(await employee.getGeneralStaff())
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });

    const { sensorId } = req.params;
    let values = undefined;
    for (let i = 4; i > 0; i--) {
      try {
        values = await getSensorMaintenanceSuggestions(Number(sensorId), i);
        break;
      } catch (err: any) {
        console.log(err);
      }
    }

    return res.status(200).json({ values: values });
  } catch (error: any) {
    console.log("error", error);
    res.status(400).json({ error: error.message });
  }
}

// export async function getAssignedMaintenanceStaffOfSensorController(req: Request, res: Response) {
//   try {
//     const { email } = (req as any).locals.jwtPayload;
//     const employee = await findEmployeeByEmail(email);

//     if (
//       !(
//         (await employee.getPlanningStaff())?.plannerType ==
//         PlannerType.OPERATIONS_MANAGER
//       )
//     )
//       return res
//         .status(403)
//         .json({ error: "Access Denied! Operation managers only!" });

//     const { sensorId } = req.params;

//     if (sensorId === undefined) {
//       return res.status(400).json({ error: "Missing information!" });
//     }

//     let staffs = await getMaintenanceStaffBySensorId(
//       Number(sensorId)
//     );

//     return res.status(200).json({ maintenanceStaff: staffs });
//   } catch (error: any) {
//     console.log(error)
//     res.status(400).json({ error: error.message });
//   }
// }

export async function assignMaintenanceStaffToSensorController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
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

    let generalStaff: GeneralStaff = await assignMaintenanceStaffToSensorById(
      Number(sensorId),
      Number(employeeId),
    );

    return res
      .status(200)
      .json({ generalStaff: await generalStaff.toFullJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function removeMaintenanceStaffFromSensorController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
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

    let generalStaff: GeneralStaff = await removeMaintenanceStaffFromSensorById(
      Number(sensorId),
      Number(employeeId),
    );

    return res
      .status(200)
      .json({ generalStaff: await generalStaff.toFullJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAuthorizationForCameraController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
      !(
        (await employee.getPlanningStaff())?.plannerType ==
        PlannerType.OPERATIONS_MANAGER
      )
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });

    const { sensorId } = req.params;

    if (sensorId == "") {
      return res.status(400).json({ error: "Missing information!" });
    }

    return res
      .status(200)
      .json(
        await getAuthorizationForCameraById(
          Number(sensorId),
          String(employee.employeeId),
        ),
      );
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function createNewAnimalFeedController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
      !((await employee.getPlanningStaff())?.plannerType == PlannerType.CURATOR)
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });

    const animalFeedImageUrl = await handleFileUpload(
      req,
      process.env.IMG_URL_ROOT! + "animalFeed", //"D:/capstoneUploads/animalFeed",
    );
    const { animalFeedName, animalFeedCategory } = req.body;

    if ([animalFeedName, animalFeedCategory].includes(undefined)) {
      console.log("Missing field(s): ", {
        animalFeedName,
        animalFeedCategory,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let animalFeed = await AnimalFeedService.createNewAnimalFeed(
      animalFeedName,
      animalFeedImageUrl,
      animalFeedCategory,
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
    return res.status(200).json({
      animalFeeds: animalFeeds.map((animalFeed) => animalFeed.toJSON()),
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAnimalFeedByNameController(
  req: Request,
  res: Response,
) {
  const { animalFeedName } = req.params;

  if (animalFeedName == undefined) {
    console.log("Missing field(s): ", {
      animalFeedName,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const animalFeed =
      await AnimalFeedService.getAnimalFeedByName(animalFeedName);
    return res.status(200).json({ animalFeed: animalFeed.toJSON() });
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
    const animalFeed = await AnimalFeedService.getAnimalFeedById(
      Number(animalFeedId),
    );
    return res.status(200).json({ animalFeed: animalFeed.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateAnimalFeedController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
      !((await employee.getPlanningStaff())?.plannerType == PlannerType.CURATOR)
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });

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
    const { animalFeedId, animalFeedName, animalFeedCategory } = req.body;

    if (
      [animalFeedId, animalFeedName, animalFeedCategory].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        animalFeedId,
        animalFeedName,
        animalFeedCategory,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let animalFeed = await AnimalFeedService.updateAnimalFeed(
      animalFeedId,
      animalFeedName,
      animalFeedCategory,
      animalFeedImageUrl,
    );

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function updateAnimalFeedImageController(
  req: Request,
  res: Response,
) {
  try {
    // req has image??

    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
      !((await employee.getPlanningStaff())?.plannerType == PlannerType.CURATOR)
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });

    const imageUrl = await handleFileUpload(
      req,
      process.env.IMG_URL_ROOT! + "animalFeed", //"D:/capstoneUploads/animalFeed",
    );
    const { animalFeedName } = req.body;

    if ([animalFeedName].includes(undefined)) {
      console.log("Missing field(s): ", {
        animalFeedName,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let animalFeed = await AnimalFeedService.updateAnimalFeedImage(
      animalFeedName,
      imageUrl,
    );

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function deleteAnimalFeedByNameController(
  req: Request,
  res: Response,
) {
  const { email } = (req as any).locals.jwtPayload;
  const employee = await findEmployeeByEmail(email);

  if (
    !employee.superAdmin &&
    !((await employee.getPlanningStaff())?.plannerType == PlannerType.CURATOR)
  )
    return res.status(403).json({ error: "Access Denied! Curators only!" });

  const { animalFeedName } = req.params;

  if (animalFeedName == undefined) {
    console.log("Missing field(s): ", {
      animalFeedName,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const animalFeed =
      await AnimalFeedService.deleteAnimalFeedByName(animalFeedName);
    return res.status(200).json({ animalFeed: animalFeed });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function createNewEnrichmentItemController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
      !((await employee.getPlanningStaff())?.plannerType == PlannerType.CURATOR)
    )
      return res.status(403).json({ error: "Access Denied! Curators only!" });

    const enrichmentItemImageUrl = await handleFileUpload(
      req,
      process.env.IMG_URL_ROOT! + "enrichmentItem", //"D:/capstoneUploads/enrichmentItem",
    );
    const { enrichmentItemName } = req.body;

    if ([enrichmentItemName, enrichmentItemImageUrl].includes(undefined)) {
      console.log("Missing field(s): ", {
        enrichmentItemName,
        enrichmentItemImageUrl,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let enrichmentItem = await EnrichmentItemService.createNewEnrichmentItem(
      enrichmentItemName,
      enrichmentItemImageUrl,
    );

    return res.status(200).json({ enrichmentItem: enrichmentItem.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllEnrichmentItemController(
  req: Request,
  res: Response,
) {
  try {
    const allEnrichmentItems =
      await EnrichmentItemService.getAllEnrichmentItem();
    return res
      .status(200)
      .json(
        allEnrichmentItems.map((enrichmentItem) => enrichmentItem.toJSON()),
      );
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getEnrichmentItemByIdController(
  req: Request,
  res: Response,
) {
  const { enrichmentItemId } = req.params;
  console.log(enrichmentItemId);
  if (enrichmentItemId == undefined) {
    console.log("Missing field(s): ", {
      enrichmentItemId: enrichmentItemId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const enrichmentItem = await EnrichmentItemService.getEnrichmentItemById(
      Number(enrichmentItemId),
    );

    return res.status(200).json({ enrichmentItem: enrichmentItem.toJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function updateEnrichmentItemController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
      !((await employee.getPlanningStaff())?.plannerType == PlannerType.CURATOR)
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });

    const { enrichmentItemId, enrichmentItemName } = req.body;

    if ([enrichmentItemId, enrichmentItemName].includes(undefined)) {
      console.log("Missing field(s): ", {
        enrichmentItemId,
        enrichmentItemName,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let enrichmentItem = await EnrichmentItemService.updateEnrichmentItem(
      enrichmentItemId,
      enrichmentItemName,
    );

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function updateEnrichmentItemImageController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (
      !employee.superAdmin &&
      !((await employee.getPlanningStaff())?.plannerType == PlannerType.CURATOR)
    )
      return res
        .status(403)
        .json({ error: "Access Denied! Operation managers only!" });

    const imageUrl = await handleFileUpload(
      req,
      process.env.IMG_URL_ROOT! + "enrichmentItem", //"D:/capstoneUploads/enrichmentItem",
    );
    const { enrichmentItemId, enrichmentItemName } = req.body;

    if ([enrichmentItemName, imageUrl].includes(undefined)) {
      console.log("Missing field(s): ", {
        enrichmentItemName,
        imageUrl,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let enrichmentItem = await EnrichmentItemService.updateEnrichmentItemImage(
      enrichmentItemId,
      enrichmentItemName,
      imageUrl,
    );

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteEnrichmentItemByNameController(
  req: Request,
  res: Response,
) {
  const { email } = (req as any).locals.jwtPayload;
  const employee = await findEmployeeByEmail(email);

  if (
    !employee.superAdmin &&
    !((await employee.getPlanningStaff())?.plannerType == PlannerType.CURATOR)
  )
    return res
      .status(403)
      .json({ error: "Access Denied! Operation managers only!" });

  const { enrichmentItemName } = req.params;

  if (enrichmentItemName == undefined) {
    console.log("Missing field(s): ", {
      enrichmentItemName,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const enrichmentItem =
      await EnrichmentItemService.deleteEnrichmentItemByName(
        enrichmentItemName,
      );
    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
