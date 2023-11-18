import { Request, Response } from "express";
import { CustomerReportLog } from "models/CustomerReportLog";
import { handleFileUpload } from "../helpers/multerProcessFile";
import {
  FacilityLogType,
  GeneralStaffType,
  PlannerType,
} from "../models/Enumerated";
import { Facility } from "../models/Facility";
import { FacilityLog } from "../models/FacilityLog";
import { GeneralStaff } from "../models/GeneralStaff";
import { HubProcessor } from "../models/HubProcessor";
import { InHouse } from "../models/InHouse";
import { MaintenanceLog } from "../models/MaintenanceLog";
import { Sensor } from "../models/Sensor";
import * as AnimalFeedService from "../services/animalFeedService";
import * as AssetFacilityService from "../services/assetFacilityService";
import * as EnrichmentItemService from "../services/enrichmentItemService";
import * as EmployeeService from "../services/employeeService";

export async function createNewZone(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    const { zoneName } = req.body;

    if ([zoneName].includes(undefined)) {
      console.log("Missing field(s): ", {
        zoneName,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let zone = await AssetFacilityService.createNewZone(zoneName);

    return res.status(200).json({ zone: zone.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllZone(req: Request, res: Response) {
  try {
    const allZones = await AssetFacilityService.getAllZones();
    return res
      .status(200)
      .json({ zones: allZones.map((zone) => zone.toJSON()) });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getZoneById(req: Request, res: Response) {
  const { zoneId } = req.params;
  if (zoneId == "") {
    console.log("Missing field(s): ", {
      zoneId: zoneId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const zone = await AssetFacilityService.getZoneById(Number(zoneId));

    return res.status(200).json({ zone: zone.toJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function updateZone(req: Request, res: Response) {
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
    const zone = await AssetFacilityService.updateZone(
      Number(zoneId),
      zoneName,
    );

    return res.status(200).json({ zone: zone.toJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function deleteZone(req: Request, res: Response) {
  const { email } = (req as any).locals.jwtPayload;
  const employee = await EmployeeService.findEmployeeByEmail(email);

  const { zoneId } = req.params;

  if (zoneId == undefined) {
    console.log("Missing field(s): ", {
      zoneId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    await AssetFacilityService.deleteZoneById(Number(zoneId));
    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function createFacility(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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
    let imageUrl;
    try {
      imageUrl = await handleFileUpload(
        req,
        process.env.IMG_URL_ROOT! + "facility", //"D:/capstoneUploads/animalFeed",
      );
    } catch {
      console.log("No image!")
      imageUrl = "";
    }

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

    let facility = await AssetFacilityService.createNewFacility(
      facilityName,
      undefined,
      undefined,
      isSheltered,
      facilityDetail,
      JSON.parse(facilityDetailJson),
      imageUrl,
    );

    return res.status(200).json({ facility: facility.toJSON() });
  } catch (error: any) {
    console.log("val error", error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAllFacility(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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
      for (const facility of await AssetFacilityService.getAllFacility(
        _includes,
        includes.includes("facilityDetail"),
      )) {
        facilities.push(await facility);
      }

      const result = [];
      for (const f of facilities) result.push(await f.toFullJson());

      return res.status(200).json({ facilities: result });
    }

    let facilities: Facility[] = [];

    for (const inHouse of await (
      await employee.getGeneralStaff()
    ).getMaintainedFacilities()) {
      facilities.push(await await inHouse.getFacility());
    }
    const inHouse = await (
      await employee.getGeneralStaff()
    ).getOperatedFacility();
    if (inHouse) {
      facilities.push(await await inHouse.getFacility());
    }

    const result = [];
    for (const f of facilities) result.push(await f.toFullJson());

    return res.status(200).json({ facilities: result });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getCrowdLevelOfAllFacility(req: Request, res: Response) {
  try {

    const { facilityId } = req.params;
    const facilities = await AssetFacilityService.getAllFacility([], true);
    const facilitiesData = [];
    for (const facility of facilities) {
      const ratio = await AssetFacilityService.crowdLevelRatioByFacilityId(facility.facilityId);
      facilitiesData.push({
        facility: facility,
        crowdLevel: ratio == -1 ? "NO_DATA" : ratio < 0.3 ? "LOW"
          : ratio < 0.7 ? "MEDIUM" : "HIGH"
      })

    }

    return res.status(200).json({
      facilitiesData: facilitiesData
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAllFacilityCustomer(
  req: Request,
  res: Response,
) {
  try {
    let { includes } = req.body;
    includes = includes || [];

    const _includes: string[] = [];
    for (const role of ["hubProcessors"]) {
      if (includes.includes(role)) _includes.push(role);
    }

    let facilities: Facility[] = [];
    for (const facility of await AssetFacilityService.getAllFacility(
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

export async function crowdLevelByFacilityId(req: Request, res: Response) {
  try {

    const { facilityId } = req.params;
    const ratio = await AssetFacilityService.crowdLevelRatioByFacilityId(Number(facilityId));

    return res.status(200).json({
      crowdLevel: ratio < 0.3 ? "LOW"
        : ratio < 0.7 ? "MEDIUM" : "HIGH"
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getMyOperationFacility(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

export async function getMyMaintainedFacility(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

export async function getFacility(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    let facility: Facility = await AssetFacilityService.getFacilityById(
      Number(facilityId),
      _includes,
    );
    return res.status(200).json({ facility: await facility.toFullJson() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getFacilityCustomer(
  req: Request,
  res: Response,
) {
  try {
    let { facilityId } = req.params;
    let { includes } = req.body;
    includes = includes || [];

    const _includes: string[] = [];
    for (const role of ["hubProcessors"]) {
      if (includes.includes(role)) _includes.push(role);
    }

    let facility: Facility = await AssetFacilityService.getFacilityById(
      Number(facilityId),
      _includes,
    );
    return res.status(200).json({ facility: await facility.toFullJson() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}



export async function getFacilityMaintenanceSuggestions(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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
    let facilities =
      await AssetFacilityService.getAllFacilityMaintenanceSuggestions(employee);
    return res
      .status(200)
      .json({ facilities: facilities?.map((facility) => facility.toJSON()) });
  } catch (error: any) {
    console.log("error", error);
    res.status(400).json({ error: error.message });
  }
}

export async function getFacilityMaintenancePredictionValues(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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
        values = await AssetFacilityService.getFacilityMaintenanceSuggestions(
          Number(facilityId),
          i,
        );
        break;
      } catch (err: any) {
        console.log(err);
      }
    }
    if (!values) throw { message: "Unable to obtain values for facilityId" + facilityId }
    return res.status(200).json({ values: values });
  } catch (error: any) {
    console.log("error", error);
    res.status(400).json({ error: error.message });
  }
}

export async function updateFacility(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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
      console.log({
        facilityName,
        xCoordinate,
        yCoordinate,
        facilityDetailJson,
        isSheltered,
        showOnMap,
      })
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
    const newFacility = await AssetFacilityService.updateFacilityByFacilityId(
      Number(facilityId),
      facilityAttribute,
      facilityDetailJson,
    );

    return res.status(200).json({ facility: newFacility.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateFacilityImage(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    if (facilityId === undefined || facilityId == "")
      throw { message: "Missing information!" };

    const imageUrl = await handleFileUpload(
      req,
      process.env.IMG_URL_ROOT! + "facility", //"D:/capstoneUploads/animalFeed",
    );

    await AssetFacilityService.updateFacilityImage(
      Number(facilityId),
      imageUrl,
    );

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAssignedMaintenanceStaffOfFacility(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    let staffs = await AssetFacilityService.getMaintenanceStaffsByFacilityId(
      Number(facilityId),
    );
    console.log("staffs", staffs);
    return res
      .status(200)
      .json({ maintenanceStaffs: staffs?.map((emp) => emp.toJSON()) });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAllMaintenanceStaff(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    let staffs = await AssetFacilityService.getAllMaintenanceStaff(_includes);

    return res
      .status(200)
      .json({ maintenanceStaffs: staffs?.map((emp) => emp.toJSON()) });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function assignMaintenanceStaffToFacility(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    let inHouse: InHouse =
      await AssetFacilityService.assignMaintenanceStaffToFacilityById(
        Number(facilityId),
        employeeIds,
      );

    return res.status(200).json({ inHouse: await inHouse.toFullJSON() });
  } catch (error: any) {
    console.log("error", error);
    res.status(400).json({ error: error.message });
  }
}

export async function removeMaintenanceStaffFromFacility(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    let inHouse: InHouse =
      await AssetFacilityService.removeMaintenanceStaffFromFacilityById(
        Number(facilityId),
        employeeIds,
      );

    return res.status(200).json({ inHouse: await inHouse.toFullJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function assignOperationStaffToFacility(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    let inHouse: InHouse =
      await AssetFacilityService.assignOperationStaffToFacilityById(
        Number(facilityId),
        employeeIds,
      );

    return res.status(200).json({ inHouse: await inHouse.toFullJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function removeOperationStaffFromFacility(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    let inHouse: InHouse =
      await AssetFacilityService.removeOperationStaffFromFacilityById(
        Number(facilityId),
        employeeIds,
      );

    return res.status(200).json({ inHouse: await inHouse.toFullJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getFacilityLogs(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    // const employee = await EmployeeService.findEmployeeByEmail(email);

    const { facilityId } = req.params;

    if (facilityId === undefined) {
      return res.status(400).json({ error: "Missing information!" });
    }

    let facilityLogs: FacilityLog[] =
      await AssetFacilityService.getFacilityLogs(Number(facilityId));
    return res
      .status(200)
      .json({ facilityLogs: facilityLogs?.map((log) => log.toJSON()) });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getFacilityLogById(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    // const employee = await EmployeeService.findEmployeeByEmail(email);

    const { facilityLogId } = req.params;
    let { includes } = req.body;
    includes = includes || [];

    if (facilityLogId == "") {
      return res.status(400).json({ error: "Missing information!" });
    }

    // Removed
    const _includes: any[] = [];
    for (const role of ["inHouse", "generalStaffs"]) {
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

    let facilityLog: FacilityLog =
      await AssetFacilityService.getFacilityLogById(
        Number(facilityLogId),
        _includes,
      );

    return res.status(200).json({ facilityLog: facilityLog.toJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function createCustomerReport(
  req: Request,
  res: Response,
) {
  try {
    // const { email } = (req as any).locals.jwtPayload;
    // const employee = await EmployeeService.findEmployeeByEmail(email);

    const { facilityId } = req.params;
    let { dateTime, title, remarks, viewed } = req.body;

    if (
      facilityId == "" ||
      [dateTime, title, remarks, viewed].includes(undefined)
    ) {
      return res.status(400).json({ error: "Missing information!" });
    }

    let customerReportLog: CustomerReportLog =
      await AssetFacilityService.createCustomerReport(
        Number(facilityId),
        dateTime,
        title,
        remarks,
        viewed,
      );

    return res
      .status(200)
      .json({ customerReportLog: customerReportLog.toJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAllCustomerReports(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    // const { facilityLogId } = req.params;
    // let { includes } = req.body;

    let customerReportLogs: CustomerReportLog[] =
      await AssetFacilityService.getAllCustomerReports();

    return res.status(200).json({
      customerReportLogs: customerReportLogs.map((log) => log.toJSON()),
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function updateCustomerReport(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    let {
      customerReportLogId,
      customerReportLogIds,
      viewed,
    } = req.body;

    if (
      viewed === undefined ||
      (customerReportLogId === undefined && customerReportLogIds === undefined)
    ) {
      return res.status(400).json({ error: "Missing information!" });
    }
    if (customerReportLogId) {
      await AssetFacilityService.updateCustomerReport(
        Number(customerReportLogId),
        viewed,
      );
    } else {
      for (const customerReportLogId of customerReportLogIds) {
        await AssetFacilityService.updateCustomerReport(
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

export async function createFacilityLog(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    let facilityLog: FacilityLog = await AssetFacilityService.createFacilityLog(
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

export async function createFacilityMaintenanceLog(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    let maintenanceLog =
      await AssetFacilityService.createFacilityMaintenanceLog(
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

export async function updateFacilityLog(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    const { facilityLogId } = req.params;
    const { title, details, remarks } = req.body;

    if (facilityLogId == "" || [title, details, remarks].includes(undefined)) {
      return res.status(400).json({ error: "Missing information!" });
    }

    const facilityLogFound = await AssetFacilityService.getFacilityLogById(
      Number(facilityLogId),
    );

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

    let facilityLog: FacilityLog = await AssetFacilityService.updateFacilityLog(
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

export async function deleteFacilityLog(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    const { facilityLogId } = req.params;

    if (
      (await employee.getPlanningStaff())?.plannerType !=
      PlannerType.OPERATIONS_MANAGER &&
      !employee.superAdmin &&
      (await AssetFacilityService.getFacilityLogById(Number(facilityLogId)))
        ?.staffName != employee.employeeName
    )
      throw { message: "Only creator of the log can delete!" };

    if ([facilityLogId].includes("")) {
      return res.status(400).json({ error: "Missing information!" });
    }

    await AssetFacilityService.deleteFacilityLogById(Number(facilityLogId));

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getCustomerReportLog(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    const { customerReportLogId } = req.params;

    if (
      (await employee.getPlanningStaff())?.plannerType !=
      PlannerType.OPERATIONS_MANAGER &&
      !employee.superAdmin
    )
      throw { message: "Access denied!" };

    if ([customerReportLogId].includes("")) {
      return res.status(400).json({ error: "Missing information!" });
    }

    const customerReportLog = await AssetFacilityService.getCustomerReportLog(
      Number(customerReportLogId),
    );

    return res
      .status(200)
      .json({ customerReportLog: customerReportLog.toJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAllNonViewedCustomerReportLogs(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    if (
      (await employee.getPlanningStaff())?.plannerType !=
      PlannerType.OPERATIONS_MANAGER &&
      !employee.superAdmin
    )
      throw { message: "Access denied!" };

    if (
      employee.superAdmin ||
      (await employee.getPlanningStaff()).plannerType ==
      PlannerType.OPERATIONS_MANAGER
    ) {
      const allCustomerReportLog =
        await AssetFacilityService.getAllNonViewedCustomerReportLogs();
      return res.status(200).json({
        customerReportLogs: allCustomerReportLog.map((log: CustomerReportLog) =>
          log.toJSON(),
        ),
      });
    }

    const allCustomerReportLog = [];
    for (const inHouse of await (
      await employee.getGeneralStaff()
    ).getMaintainedFacilities()) {
      for (const log of await inHouse.getCustomerReportLogs()) {
        allCustomerReportLog.push(log);
      }
    }

    return res.status(200).json({
      customerReportLogs: allCustomerReportLog.map((log: CustomerReportLog) =>
        log.toJSON(),
      ),
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAllCustomerReportLogsByFacilityId(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    const { facilityId } = req.params;

    if (
      (await employee.getPlanningStaff())?.plannerType !=
      PlannerType.OPERATIONS_MANAGER &&
      !employee.superAdmin
    )
      throw { message: "Access denied!" };

    if ([facilityId].includes("")) {
      console.log("facilityId missing", facilityId);
      return res.status(400).json({ error: "Missing information!" });
    }

    const allCustomerReportLog =
      await AssetFacilityService.getAllCustomerReportLogsByFacilityId(
        Number(facilityId),
      );

    return res.status(200).json({
      customerReportLogs: allCustomerReportLog.map((log: CustomerReportLog) =>
        log.toJSON(),
      ),
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function markCustomerReportLogsViewed(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    const { customerReportLogIds, viewed } = req.body;

    if (
      (await employee.getPlanningStaff())?.plannerType !=
      PlannerType.OPERATIONS_MANAGER &&
      !employee.superAdmin
    )
      throw { message: "Access denied!" };

    if ([customerReportLogIds].includes("")) {
      return res.status(400).json({ error: "Missing information!" });
    }

    const customerReportLog =
      await AssetFacilityService.markCustomerReportLogsViewed(
        customerReportLogIds,
        viewed,
      );

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function deleteCustomerReportLog(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    const { customerReportLogId } = req.params;

    if (
      (await employee.getPlanningStaff())?.plannerType !=
      PlannerType.OPERATIONS_MANAGER &&
      !employee.superAdmin
    )
      throw { message: "Access denied!" };

    if ([customerReportLogId].includes("")) {
      return res.status(400).json({ error: "Missing information!" });
    }

    await AssetFacilityService.deleteCustomerReportLog(
      Number(customerReportLogId),
    );

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function completeRepairTicket(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    const { facilityLogId } = req.params;

    const facilityLogFound = await AssetFacilityService.getFacilityLogById(
      Number(facilityLogId),
    );

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

    await AssetFacilityService.completeRepairTicket(Number(facilityLogId));

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    console.log("error", error);
    res.status(400).json({ error: error.message });
  }
}

export async function deleteFacility(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    await AssetFacilityService.deleteFacilityById(Number(facilityId));

    return res.status(200).json({ result: "Success!" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function addHubToFacility(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    let hubProcessor: HubProcessor =
      await AssetFacilityService.addHubProcessorByFacilityId(
        Number(facilityId),
        processorName,
      );

    return res.status(200).json({ hubProcessor: hubProcessor.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllHubs(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    let hubs: HubProcessor[] = await AssetFacilityService.getAllHubs(_includes);

    return res.status(200).json({ hubs: hubs.map((hub) => hub.toJSON()) });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getHubProcessor(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    let hubProcessor: HubProcessor =
      await AssetFacilityService.getHubProcessorById(
        Number(hubProcessorId),
        _includes,
      );
    return res.status(200).json({ hubProcessor: hubProcessor.toJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAllSensors(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    let sensors: Sensor[] = await AssetFacilityService.getAllSensors(_includes);

    return res
      .status(200)
      .json({ sensors: sensors.map((sensor) => sensor.toJSON()) });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getSensor(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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
    const { includes } = req.body;

    if (sensorId === undefined) {
      return res.status(400).json({ error: "Missing information!" });
    }

    let sensor: Sensor = await AssetFacilityService.getSensor(Number(sensorId));

    return res.status(200).json({ sensor: sensor.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getSensorReading(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    let sensorReadings = await AssetFacilityService.getSensorReadingBySensorId(
      Number(sensorId),
      new Date(startDate),
      new Date(endDate),
    );
    let sensor = await AssetFacilityService.getSensor(Number(sensorId));

    let earliestDate = await AssetFacilityService.getEarliestReadingBySensorId(
      Number(sensorId),
    );

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

export async function updateHub(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    let hubUpdated = await AssetFacilityService.updateHubByHubId(
      Number(hubProcessorId),
      {
        processorName: processorName,
        radioGroup: radioGroup,
      },
    );

    return res.status(200).json({ hub: hubUpdated.toJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function updateSensor(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    let sensorUpdated = await AssetFacilityService.updateSensorById(
      Number(sensorId),
      data,
    );

    return res.status(200).json({ sensor: sensorUpdated.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteHub(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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
    await AssetFacilityService.deleteHubById(Number(hubProcessorId));

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteSensor(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    await AssetFacilityService.deleteSensorById(Number(sensorId));

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function createSensorMaintenanceLog(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    let sensor = await AssetFacilityService.createSensorMaintenanceLog(
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

    return res.status(200).json({ sensor: await sensor.toFullJSON() });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getSensorMaintenanceLog(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    // const employee = await EmployeeService.findEmployeeByEmail(email);

    const { sensorMaintenanceLogId } = req.params;

    if (sensorMaintenanceLogId == "") {
      return res.status(400).json({ error: "Missing information!" });
    }

    let maintenanceLog: MaintenanceLog =
      await AssetFacilityService.getSensorMaintenanceLogById(
        Number(sensorMaintenanceLogId),
      );

    return res.status(200).json({ maintenanceLog: maintenanceLog.toJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllSensorMaintenanceLogs(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    let maintenanceLogs =
      await AssetFacilityService.getAllSensorMaintenanceLogs(Number(sensorId));

    return res
      .status(200)
      .json({ maintenanceLog: maintenanceLogs.map((log) => log.toJSON()) });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateSensorMaintenanceLog(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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
      (
        await AssetFacilityService.getSensorMaintenanceLogById(
          Number(sensorMaintenanceLogId),
        )
      ).staffName != employee.employeeName
    )
      throw { message: "Only creator of the log can edit!" };

    let maintenanceLog: MaintenanceLog =
      await AssetFacilityService.updateSensorMaintenanceLog(
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

export async function deleteSensorMaintenanceLog(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    const { sensorMaintenanceLogId } = req.params;

    if ([sensorMaintenanceLogId].includes("")) {
      return res.status(400).json({ error: "Missing information!" });
    }

    if (
      (await employee.getPlanningStaff()).plannerType !=
      PlannerType.OPERATIONS_MANAGER &&
      !employee.superAdmin &&
      (
        await AssetFacilityService.getSensorMaintenanceLogById(
          Number(sensorMaintenanceLogId),
        )
      ).staffName != employee.employeeName
    )
      throw { message: "Only creator of the log can delete!" };

    await AssetFacilityService.deleteSensorMaintenanceLogById(
      Number(sensorMaintenanceLogId),
    );

    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function addSensorToHub(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    let sensor: Sensor = await AssetFacilityService.addSensorByHubProcessorId(
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
    ipaddress = ipaddress == "::1" ? "127.0.0.1" : ipaddress.split(":")[3];
    const token = await AssetFacilityService.initializeHubProcessor(
      processorName,
      ipaddress,
    );
    return res.status(200).json({ token: token });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function pushSensorReadings(
  req: Request,
  res: Response,
) {
  try {
    const { jsonPayloadString, sha256 } = req.body;
    const { processorName } = req.params;

    let ipaddress = req.socket.remoteAddress || "127.0.0.1";
    ipaddress = ipaddress == "::1" ? "127.0.0.1" : ipaddress.split(":")[3];

    const processor: HubProcessor =
      await AssetFacilityService.findProcessorByName(processorName);
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
        await AssetFacilityService.createNewSensorReading(
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

export async function getSensorMaintenanceSuggestions(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    let sensors =
      await AssetFacilityService.getAllSensorMaintenanceSuggestions(employee);
    return res
      .status(200)
      .json({ sensors: sensors?.map((sensor) => sensor.toJSON()) });
  } catch (error: any) {
    console.log("error", error);
    res.status(400).json({ error: error.message });
  }
}

export async function getSensorMaintenancePredictionValues(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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
        values = await AssetFacilityService.getSensorMaintenanceSuggestions(
          Number(sensorId),
          i,
        );
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

// export async function getAssignedMaintenanceStaffOfSensor(req: Request, res: Response) {
//   try {
//     const { email } = (req as any).locals.jwtPayload;
//     const employee = await EmployeeService.findEmployeeByEmail(email);

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

export async function assignMaintenanceStaffToSensor(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    let generalStaff: GeneralStaff =
      await AssetFacilityService.assignMaintenanceStaffToSensorById(
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

export async function removeMaintenanceStaffFromSensor(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    let generalStaff: GeneralStaff =
      await AssetFacilityService.removeMaintenanceStaffFromSensorById(
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

export async function getAuthorizationForCamera(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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
        await AssetFacilityService.getAuthorizationForCameraById(
          Number(sensorId),
          String(employee.employeeId),
        ),
      );
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAuthorizationForCameraByFacilityId(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

    if (facilityId == "") {
      return res.status(400).json({ error: "Missing information!" });
    }

    return res
      .status(200)
      .json(
        {
          data: await AssetFacilityService.getAuthorizationForCameraByFacilityId(
            Number(facilityId),
            String(employee.employeeId),
          ),
        })
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export async function createNewAnimalFeed(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

export async function getAllAnimalFeed(req: Request, res: Response) {
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

export async function getAnimalFeedByName(
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

export async function getAnimalFeedById(req: Request, res: Response) {
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

export async function updateAnimalFeed(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

export async function updateAnimalFeedImage(
  req: Request,
  res: Response,
) {
  try {
    // req has image??

    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

export async function deleteAnimalFeedByName(
  req: Request,
  res: Response,
) {
  const { email } = (req as any).locals.jwtPayload;
  const employee = await EmployeeService.findEmployeeByEmail(email);

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
    return res.status(200).json({ result: "success" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function createNewEnrichmentItem(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

export async function getAllEnrichmentItem(
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

export async function getEnrichmentItemById(
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

export async function updateEnrichmentItem(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

export async function updateEnrichmentItemImage(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

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

export async function deleteEnrichmentItemByName(
  req: Request,
  res: Response,
) {
  const { email } = (req as any).locals.jwtPayload;
  const employee = await EmployeeService.findEmployeeByEmail(email);

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
