import { FacilityLogType, GeneralStaffType, HubStatus, PlannerType, SensorType } from "../models/enumerated";
import { validationErrorHandler } from "../helpers/errorHandler";
import { Facility } from "../models/facility";
import { Sensor } from "../models/sensor";
import { HubProcessor } from "../models/hubProcessor";
import { hash } from "../helpers/security";
import { findEmployeeById, getAllEmployees } from "./employee";
import { GeneralStaff } from "../models/generalStaff";
import { InHouse } from "../models/inHouse";
import { FacilityLog } from "../models/facilityLog";
import { predictCycleLength, predictNextDate } from "../helpers/predictors";
import { MaintenanceLog } from "../models/maintenanceLog";
import { Employee } from "../models/employee";
import { SensorReading } from "../models/sensorReading";
import { Op } from "Sequelize";
import { Zone } from "../models/zone";

export async function createNewZone(zoneName: string) {
  try {
    return Zone.create({
      zoneName: zoneName,
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllZones() {
  try {
    return Zone.findAll();
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getZoneById(zoneId: number) {
  try {
    const zone = await Zone.findOne({
      where: { zoneId: zoneId },
      include: ["facilities"],
    });
    if (!zone) throw { message: "Unable to find zone with Id: " + zoneId };
    return zone;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function updateZone(zoneId: number, zoneName: string) {
  try {
    const zone = await Zone.findOne({
      where: { zoneId: zoneId },
    });
    if (!zone) throw { message: "Unable to find zone with Id: " + zoneId };
    zone.zoneName = zoneName;
    await zone.save();
    return zone;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deleteZoneById(zoneId: number) {
  try {
    const zone = await getZoneById(zoneId);
    return await zone.destroy();
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function createNewFacility(
  facilityName: string,
  xCoordinate: number | undefined,
  yCoordinate: number | undefined,
  isSheltered: boolean,
  facilityDetail: string,
  facilityDetailJson: any,
) {
  let newFacility = {
    facilityName: facilityName,
    xCoordinate: xCoordinate,
    yCoordinate: yCoordinate,
    isSheltered: isSheltered,
  } as any;
  newFacility[facilityDetail] = facilityDetailJson;

  try {
    return Facility.create(newFacility, {
      include: [
        {
          association: facilityDetail,
        },
      ],
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getFacilityById(
  facilityId: number,
  includes: string[] = [],
) {
  try {
    const facility = await Facility.findOne({
      where: { facilityId: facilityId },
      include: includes,
    });
    if (!facility) throw { message: "Unable to find facility!" };
    return facility;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllFacilityMaintenanceSuggestions(employee: Employee) {
  try {
    let facilities: Facility[] = [];

    if (
      (await employee.getPlanningStaff())?.plannerType ==
      PlannerType.OPERATIONS_MANAGER
    ) {
      const allFacilities = await getAllFacility([], true);
      for (const facility of allFacilities) {
        const ih = await facility.getFacilityDetail();
        if (facility.facilityDetail == "inHouse") facilities.push(facility);
      }
    } else if (!(await employee.getGeneralStaff())) {
      throw { message: "No access!" };
    } else {
      const allInHouses = await (
        await employee.getGeneralStaff()
      ).getMaintainedFacilities();
      for (const inHouse of allInHouses) {
        facilities.push(await inHouse.getFacility());
      }
    }

    for (const facility of facilities) {
      let inHouse = await (facility as any).getFacilityDetail();
      let logs = (await inHouse.getFacilityLogs()) || [];
      logs = logs.filter((log: FacilityLog) => log.facilityLogType == FacilityLogType.MAINTENANCE_LOG);
      logs = logs.map((log: FacilityLog) => log.dateTime);
      (facility as any).dataValues["predictedMaintenanceDate"] =
        predictNextDate(logs);
      (facility as any).dataValues["facilityDetailJson"] = inHouse.toJSON();
    }

    return facilities;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function updateFacilityByFacilityId(
  facilityId: number,
  facilityAttribute: any,
  facilityDetailJson: any,
): Promise<HubProcessor> {
  try {
    let facility = (await getFacilityById(Number(facilityId))) as any;
    if (!facility) throw { message: "Unable to find facilityId " + facilityId };

    for (const [field, v] of Object.entries(facilityAttribute)) {
      facility[field] = v;
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
    return facility;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function assignMaintenanceStaffToFacilityById(
  facilityId: number,
  employeeIds: number[],
): Promise<InHouse> {
  try {
    const facility = await Facility.findOne({
      where: { facilityId: facilityId },
    });
    if (!facility)
      throw { message: "Unable to find facilityId: " + facilityId };
    const inHouse = await facility.getFacilityDetail();
    if (!inHouse) throw { message: "Facility is not In House!" };

    let employees = await getAllEmployees([]);
    employees = employees.filter((employee) =>
      employeeIds.includes(employee.employeeId),
    );
    const staffList: GeneralStaff[] = [];
    for (const emp of employees) {
      const staff = await emp.getGeneralStaff();
      if (staff.generalStaffType != GeneralStaffType.ZOO_MAINTENANCE)
        throw { message: "Not a Maintenance Staff!" };
      staffList.push(staff);
    }
    for (const staff of staffList) {
      for (const assigned of await inHouse.getMaintenanceStaffs()) {
        if (
          (await assigned.getEmployee()).employeeId ==
          (await staff.getEmployee()).employeeId
        ) {
          throw { message: "Stuff alreadly assigned!" };
        }
      }
      await inHouse.addMaintenanceStaff(staff);
    }

    return inHouse;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function removeMaintenanceStaffFromFacilityById(
  facilityId: number,
  employeeIds: number[],
): Promise<InHouse> {
  try {
    const facility = await Facility.findOne({
      where: { facilityId: facilityId },
    });
    if (!facility)
      throw { message: "Unable to find facilityId: " + facilityId };
    const inHouse = await facility.getInHouse();
    if (!inHouse) throw { message: "Facility is not In House!" };

    let employees = await getAllEmployees([]);
    employees = employees.filter((employee) =>
      employeeIds.includes(employee.employeeId),
    );
    const staffList: GeneralStaff[] = [];
    for (const emp of employees) {
      const staff = await emp.getGeneralStaff();
      staffList.push(staff);
    }
    for (const staff of staffList) {
      await inHouse.removeMaintenanceStaff(staff);
      // staff.removeMaintainedFacilities(inHouse);
    }

    return inHouse;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function assignOperationStaffToFacilityById(
  facilityId: number,
  employeeIds: number[],
): Promise<InHouse> {
  try {
    const facility = await Facility.findOne({
      where: { facilityId: facilityId },
    });
    if (!facility)
      throw { message: "Unable to find facilityId: " + facilityId };
    const inHouse = await facility.getInHouse();
    if (!inHouse) throw { message: "Facility is not In House!" };

    let employees = await getAllEmployees([]);
    employees = employees.filter((employee) =>
      employeeIds.includes(employee.employeeId),
    );
    const generalStaffs = employees.map((employee) =>
      employee.getGeneralStaff(),
    );
    const staffList: GeneralStaff[] = [];
    for (const staffPromise of generalStaffs) {
      const staff = await staffPromise;
      console.log("staff", staff);
      if (staff.generalStaffType != GeneralStaffType.ZOO_OPERATIONS)
        throw { message: "Not a Operation Staff!" };
      staffList.push(staff);
    }
    for (const staff of staffList) {
      await inHouse.addOperationStaff(staff as any);
      // staff.setOperatedFacility(inHouse);
    }

    return inHouse;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function removeOperationStaffFromFacilityById(
  facilityId: number,
  employeeIds: number[],
): Promise<InHouse> {
  try {
    const facility = await Facility.findOne({
      where: { facilityId: facilityId },
    });
    if (!facility) throw { message: "Unable to find facilityId: " + facility };
    const inHouse = await facility.getInHouse();
    if (!inHouse) throw { message: "Facility is not In House!" };

    let employees = await getAllEmployees([]);
    employees = employees.filter((employee) =>
      employeeIds.includes(employee.employeeId),
    );
    const generalStaffs = employees.map((employee) =>
      employee.getGeneralStaff(),
    );
    const staffList: GeneralStaff[] = [];
    for (const staffPromise of generalStaffs) {
      const staff = await staffPromise;
      console.log("staff", staff);
      if (staff.generalStaffType != GeneralStaffType.ZOO_OPERATIONS)
        throw { message: "Not a Operation Staff!" };
      staffList.push(staff);
    }
    for (const staff of staffList) {
      await inHouse.removeOperationStaff(staff as any);
      // staff.setOperatedFacility(undefined);
    }

    return inHouse;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getFacilityLogs(
  facilityId: number,
): Promise<FacilityLog[]> {
  try {
    const facility : Facility = await getFacilityById(facilityId);
    if (!facility) throw { message: "Unable to find facilityId: " + facility };
    const inHouse:InHouse = await facility.getFacilityDetail();
    if (facility.facilityDetail != "inHouse")
      throw { message: "Not an in-house facility!" };

    return inHouse.getFacilityLogs({
      include:{
        association:"generalStaffs",
        include:["employee"]
      }
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}



export async function createFacilityLog(
  facilityId: number,
  title: string,
  details: string,
  remarks: string,
  staffName: string,
  facilityLogType: FacilityLogType,
  employeeIds: number[]
): Promise<FacilityLog> {
  try {
    const facility = await Facility.findOne({
      where: { facilityId: facilityId },
    });
    if (!facility) throw { message: "Unable to find facilityId: " + facility };
    const thirdParty = await facility.getFacilityDetail();
    if (facility.facilityDetail != "inHouse")
      throw { message: "Not an in-house facility!" };

    const facilityLog = await FacilityLog.create({
      dateTime: new Date(),
      title: title,
      details: details,
      remarks: remarks,
      staffName: staffName,
      facilityLogType: facilityLogType
    })
    thirdParty.addFacilityLog(facilityLog);

    if (facilityLogType == FacilityLogType.ACTIVE_REPAIR_TICKET) {
      if (employeeIds.length < 1) throw { message: "Employee ids empty!" }
      for (const id of employeeIds) {
        const emp = await findEmployeeById(id);
        await facilityLog.addGeneralStaff((await emp.getGeneralStaff()));
      }
    }

    return facilityLog;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function addHubProcessorByFacilityId(
  facilityId: number,
  processorName: string,
  includes: string[] = [],
): Promise<HubProcessor> {
  try {
    const facility = await Facility.findOne({
      where: { facilityId: facilityId },
      include: includes,
    });
    if (!facility) throw { message: "Unable to find facilityId " + facilityId };

    const newHub = await HubProcessor.create({
      processorName: processorName,
      // hubStatus: HubStatus.PENDING,
    } as any);

    await facility.addHubProcessor(newHub);
    return newHub;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllFacility(
  includes: any,
  facilityDetail: boolean,
): Promise<Facility[]> {
  try {
    const allFacilities = await Facility.findAll({ include: includes });

    if (facilityDetail) {
      for (const facility of allFacilities)
        (facility as any).dataValues["facilityDetailJson"] =
          await facility.getFacilityDetail();
    }

    return allFacilities;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deleteFacilityById(facilityId: number): Promise<void> {
  try {
    const facility = await Facility.findOne({
      where: { facilityId: facilityId },
    });

    if (!facility)
      throw { message: "Unable to find facilityId: " + facilityId };

    return facility.destroy();
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllHubs(
  includes: string[] = [],
): Promise<HubProcessor[]> {
  try {
    return HubProcessor.findAll({ include: includes });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllSensors(
  includes: string[] = [],
): Promise<Sensor[]> {
  try {
    return Sensor.findAll({ include: includes });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getSensorReadingBySensorId(
  sensorId: number,
  startDate: Date,
  endDate: Date,
) {
  try {
    const sensor = await Sensor.findOne({
      where: { sensorId: sensorId },
      include: [
        {
          association: "sensorReadings",
          as: "sensorReadings",
          where: {
            readingDate: {
              [Op.lt]: endDate,
              [Op.gt]: startDate,
            },
          },
          required: false,
        },
      ],
    });
    if (!sensor) throw { message: "Unable to find sensorId: " + sensorId };

    return sensor.sensorReadings;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getEarliestReadingBySensorId(sensorId: number) {
  try {
    const reading = await SensorReading.findOne({
      order: [["readingDate", "ASC"]],
      include: [
        {
          association: "sensor",
          where: {
            sensorId: sensorId,
          },
          required: true,
        },
      ],
    });

    return reading?.readingDate;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getSensor(sensorId: number, includes: string[]) {
  try {
    const sensor = await Sensor.findOne({
      where: { sensorId: sensorId },
      include: includes,
    });
    if (!sensor) throw { message: "Unable to find sensorId: " + sensorId };

    return sensor;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllSensorMaintenanceSuggestions(employee: Employee) {
  try {
    let sensors: any[] = [];

    if (
      (await employee.getPlanningStaff())?.plannerType ==
      PlannerType.OPERATIONS_MANAGER
    ) {
      sensors = await getAllSensors(["sensorReadings"]);
    } else if (!(await employee.getGeneralStaff())) {
      throw { message: "No access!" };
    } else {
      sensors = await (await employee.getGeneralStaff()).getSensors();
    }

    for (const sensor of sensors) {
      let logs = (await sensor.getMaintenanceLogs()) || [];
      let dateLogs = logs.map((log: MaintenanceLog) => log.dateTime);
      (sensor as any).dataValues["predictedMaintenanceDate"] = predictNextDate(
        dateLogs.slice(0, Math.max(dateLogs.length, 5)),
      );
    }
    return sensors;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getFacilityMaintenanceSuggestions(
  facilityId: number,
  predictionLength: number,
) {
  try {
    let facility: Facility = await getFacilityById(facilityId, []);
    let inHouse = await facility.getInHouse();
    if (!inHouse)
      throw { message: "InHouse not found, facility Id: " + facilityId };

    let logs = (await inHouse.getFacilityLogs()) || [];
    logs = logs.filter((log: FacilityLog) => log.facilityLogType == FacilityLogType.MAINTENANCE_LOG);
    let dateLogs = logs.map((log: FacilityLog) => log.dateTime);

    return {
      ...predictCycleLength(dateLogs, predictionLength),
      name: facility.facilityName,
    };
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getSensorMaintenanceSuggestions(
  sensorId: number,
  predictionLength: number,
) {
  try {
    let sensor: Sensor = await getSensor(sensorId, ["sensorReadings"]);

    let logs = (await sensor.getMaintenanceLogs()) || [];
    let dateLogs = logs.map((log: MaintenanceLog) => log.dateTime);

    return {
      ...predictCycleLength(dateLogs, predictionLength),
      name: sensor.sensorName,
    };
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getHubProcessorById(
  hubProcessorId: number,
  includes: string[] = [],
) {
  try {
    const hub = await HubProcessor.findOne({
      where: { hubProcessorId: hubProcessorId },
      include: includes,
    });
    if (!hub) throw { message: "Unable to find hub!" };
    return hub;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function updateHubByHubId(
  hubId: number,
  data: any,
): Promise<HubProcessor> {
  try {
    const hubProcessor = (await HubProcessor.findOne({
      where: { hubProcessorId: hubId },
    })) as any;
    if (!hubProcessor)
      throw { message: "Unable to find HubProcessorId: " + hubId };

    for (const [key, value] of Object.entries(data)) {
      hubProcessor[key] = value;
    }
    await hubProcessor.save();

    return hubProcessor;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function updateSensorById(
  sensorId: number,
  data: any,
): Promise<HubProcessor> {
  try {
    const sensor = (await Sensor.findOne({
      where: { sensorId: sensorId },
    })) as any;
    if (!sensor) throw { message: "Unable to find sensorId: " + sensorId };

    for (const [key, value] of Object.entries(data)) {
      sensor[key] = value;
    }
    await sensor.save();

    return sensor;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deleteHubById(hubId: number): Promise<void> {
  try {
    const hubProcessor = await HubProcessor.findOne({
      where: { hubProcessorId: hubId },
    });
    if (!hubProcessor)
      throw { message: "Unable to find HubProcessorId: " + hubId };

    return hubProcessor.destroy();
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deleteSensorById(sensorId: number): Promise<void> {
  try {
    const sensor = await Sensor.findOne({
      where: { sensorId: sensorId },
    });
    if (!sensor) throw { message: "Unable to find sensorId: " + sensorId };

    return sensor.destroy();
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function createSensorMaintenanceLog(
  sensorId: number,
  date: Date,
  title: string,
  details: string,
  remarks: string,
  staffName: string,
): Promise<Sensor> {
  try {
    const sensor = await Sensor.findOne({
      where: { sensorId: sensorId },
    });
    if (!sensor) throw { message: "Unable to find sensorId: " + sensorId };

    const newLog = await MaintenanceLog.create({
      dateTime: date,
      title: title,
      details: details,
      remarks: remarks,
      staffName: staffName,
    });
    sensor.addMaintenanceLog(newLog);
    sensor.dateOfLastMaintained = date;
    await sensor.save();

    return sensor;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function createFacilityMaintenanceLog(
  facilityId: number,
  date: Date,
  title: string,
  details: string,
  remarks: string,
  staffName: string,
): Promise<FacilityLog> {
  try {
    const facility = await Facility.findOne({
      where: { facilityId: facilityId },
    });
    if (!facility)
      throw { message: "Unable to find facilityId: " + facilityId };
    const inHouse: InHouse = await facility.getFacilityDetail();
    if (!inHouse) throw { message: "Not a in-house facility!" };

    const newLog = await FacilityLog.create({
      dateTime: date,
      title: title,
      details: details,
      remarks: remarks,
      staffName: staffName,
      facilityLogType: FacilityLogType.MAINTENANCE_LOG
    })
    inHouse.addFacilityLog(newLog);
    inHouse.lastMaintained = date;
    await inHouse.save();

    return newLog;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getFacilityLogById(
  facilityLogId: number,
  includes: string[] = []
): Promise<FacilityLog> {
  try {
    const facilityLog = await FacilityLog.findOne({
      where: {
        facilityLogId: facilityLogId
      },
      include: includes
    });
    if (!facilityLog)
      throw { message: "Cannot find facility log id : " + facilityLogId };
    return facilityLog;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function updateFacilityLog(
  facilityLogId: number,
  title: string,
  details: string,
  remarks: string,
): Promise<FacilityLog> {
  try {
    const facilityLog = await FacilityLog.findOne({
      where: {
        facilityLogId: facilityLogId,
      },
    });
    if (!facilityLog)
      throw { message: "Cannot find facility log id : " + facilityLogId };
    facilityLog.title = title;
    facilityLog.details = details;
    facilityLog.remarks = remarks;

    await facilityLog.save();
    return facilityLog;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deleteFacilityLogById(facilityLogId: number) {
  try {
    const facilityLog = await FacilityLog.findOne({
      where: {
        facilityLogId: facilityLogId,
      },
    });
    if (!facilityLog)
      throw { message: "Cannot find facility log id : " + facilityLogId };

    await facilityLog.destroy();
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function completeRepairTicket(
  facilityLogId: number,
) {
  try {
    const facilityLog = await getFacilityLogById(facilityLogId);
    if (!facilityLog) throw { message: "Cannot find facility log id : " + facilityLogId }
    if (facilityLog.facilityLogType != FacilityLogType.ACTIVE_REPAIR_TICKET) throw { message: "Not an active repair ticket!" }

    await facilityLog.setGeneralStaffs([]);
    facilityLog.facilityLogType = FacilityLogType.COMPLETED_REPAIR_TICKET;

    return await facilityLog.save();
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllSensorMaintenanceLogs(
  sensorId: number,
): Promise<MaintenanceLog[]> {
  try {
    const sensor = await Sensor.findOne({
      where: { sensorId: sensorId },
    });
    if (!sensor) throw { message: "Unable to find sensorId: " + sensorId };

    return sensor.getMaintenanceLogs();
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getSensorMaintenanceLogById(
  sensorMaintenanceLogId: number,
): Promise<MaintenanceLog> {
  try {
    const maintenanceLog = await MaintenanceLog.findOne({
      where: { maintenanceLogId: sensorMaintenanceLogId },
    });
    if (!maintenanceLog)
      throw {
        message:
          "Unable to find maintenanceLog with Id: " + sensorMaintenanceLogId,
      };

    return maintenanceLog;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function updateSensorMaintenanceLog(
  maintenanceLogId: number,
  title: string,
  details: string,
  remarks: string,
): Promise<MaintenanceLog> {
  try {
    const maintenanceLog = await MaintenanceLog.findOne({
      where: { maintenanceLogId: maintenanceLogId },
    });
    if (!maintenanceLog)
      throw {
        message: "Unable to find maintenanceLogId : " + maintenanceLogId,
      };

    maintenanceLog.title = title;
    maintenanceLog.details = details;
    maintenanceLog.remarks = remarks;
    await maintenanceLog.save();

    return maintenanceLog;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deleteSensorMaintenanceLogById(maintenanceLogId: number) {
  try {
    const maintenanceLog = await MaintenanceLog.findOne({
      where: { maintenanceLogId: maintenanceLogId },
    });
    if (!maintenanceLog)
      throw {
        message: "Unable to find maintenanceLogId : " + maintenanceLogId,
      };

    await maintenanceLog.destroy();
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function addSensorByHubProcessorId(
  hubProcessorId: number,
  sensorType: SensorType,
  sensorName: string,
): Promise<Sensor> {
  try {
    const hubProcessor = await HubProcessor.findOne({
      where: { hubProcessorId: hubProcessorId },
      include: ["sensors"],
    });
    if (!hubProcessor)
      throw { message: "Unable to find hubProcessorId " + hubProcessorId };
    if (hubProcessor.hubStatus != HubStatus.CONNECTED)
      throw { message: "Hub not connected!" };
    if (
      sensorType == SensorType.CAMERA &&
      !!hubProcessor.sensors?.find(
        (sensor) => sensor.sensorType == SensorType.CAMERA,
      )
    )
      throw { message: "Hub can only support one camera!" };

    const newSensor = await Sensor.create({
      sensorName: sensorName,
      sensorType: sensorType,
    } as any);

    await hubProcessor.addSensor(newSensor);
    return newSensor;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function initializeHubProcessor(
  processorName: string,
  ipAddress: string,
): Promise<string> {
  try {
    const hubProcessor = await findProcessorByName(processorName);
    if (hubProcessor.hubStatus != HubStatus.PENDING)
      throw { message: "Hub has alreadly been initizlized!" };

    const newtoken = hubProcessor.generateHubSecret();
    hubProcessor.lastDataUpdate = new Date();
    hubProcessor.hubStatus = HubStatus.CONNECTED;
    hubProcessor.ipAddressName = ipAddress;
    hubProcessor.radioGroup = HubProcessor.generateRandomRadioGroup();
    await hubProcessor.save();

    return newtoken;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function findProcessorByName(
  processorName: string,
): Promise<HubProcessor> {
  try {
    const hubProcessor = await HubProcessor.findOne({
      where: { processorName: processorName },
    });
    if (!hubProcessor)
      throw { message: "Unable to find processorName " + processorName };

    return hubProcessor;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function createNewSensorReading(
  sensorName: string,
  date: Date,
  value: number,
): Promise<Sensor> {
  try {
    const sensor = await Sensor.findOne({
      where: { sensorName: sensorName },
    });
    if (!sensor) throw { message: "Unable to find sensor: " + sensor };

    const sensorReading = await SensorReading.create({
      readingDate: date,
      value: value,
    });
    await sensorReading.setSensor(sensor);
    return sensor;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function assignMaintenanceStaffToSensorById(
  sensorId: number,
  employeeId: number,
): Promise<GeneralStaff> {
  try {
    const sensor = await Sensor.findOne({
      where: { sensorId: sensorId },
    });
    if (!sensor) throw { message: "Unable to find sensorId: " + sensorId };

    const generalStaff = await (
      await findEmployeeById(employeeId)
    ).getGeneralStaff();
    if (!generalStaff)
      throw {
        message: "Unable to find generalStaff with employeeId: " + employeeId,
      };
    if (generalStaff.generalStaffType != GeneralStaffType.ZOO_MAINTENANCE)
      throw { message: "Not a maintenance Staff!" };

    generalStaff.addSensor(sensor);
    await generalStaff.save();

    return generalStaff;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function removeMaintenanceStaffFromSensorById(
  sensorId: number,
  employeeId: number,
): Promise<GeneralStaff> {
  try {
    const sensor = await Sensor.findOne({
      where: { sensorId: sensorId },
    });
    if (!sensor) throw { message: "Unable to find sensorId: " + sensorId };

    const generalStaff = await (
      await findEmployeeById(employeeId)
    ).getGeneralStaff();
    if (!generalStaff)
      throw {
        message: "Unable to find generalStaff with employeeId: " + employeeId,
      };

    generalStaff.removeSensor(sensor);
    await generalStaff.save();

    return generalStaff;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAuthorizationForCameraById(
  cameraId: number,
  userId: string,
) {
  try {
    const sensor = await Sensor.findOne({
      where: { sensorId: cameraId },
    });
    if (!sensor) throw { message: "Unable to find Camera Id " + cameraId };
    if (sensor.sensorType != SensorType.CAMERA)
      throw { message: "Not a camera!" };

    const hub = await sensor.getHubProcessor();
    if (hub.hubStatus == HubStatus.PENDING)
      throw { message: "Hub has not initialized!" };

    const currentDT = Date.now().toString();

    return {
      sensorName: sensor.sensorName,
      userId: userId,
      hubId: hub.hubProcessorId.toString(),
      date: currentDT,
      ipAddressName: hub.ipAddressName,
      signature: hash(
        userId + hub.hubProcessorId.toString() + currentDT + hub.hubSecret,
      ),
    };
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getMaintenanceStaffsByFacilityId(facilityId: number) {
  try {
    const facility = await getFacilityById(facilityId);
    const inHouse: InHouse = await facility.getFacilityDetail();
    if (facility.facilityDetail != "inHouse")
      throw { message: "Facility not in house type!" };
    let staffs: GeneralStaff[] = await inHouse.getMaintenanceStaffs();
    let emps: Employee[] = [];
    for (const staff of staffs) {
      emps.push(await staff.getEmployee());
    }
    return emps;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

// export async function getMaintenanceStaffBySensorId(
//   sensorId: number
// ) {
//   try {
//     const sensor = await getSensor(sensorId, []);
//     return sensor.getGeneralStaff();
//   } catch (error: any) {
//     throw validationErrorHandler(error);
//   }
// }

export async function getAllMaintenanceStaff(includes: string[]) {
  try {
    if (!includes.includes("generalStaff")) includes.push("generalStaff");
    let employees: Employee[] = await getAllEmployees(includes);
    employees = employees.filter(
      (emp) =>
        emp.generalStaff?.generalStaffType == GeneralStaffType.ZOO_MAINTENANCE,
    );
    return employees;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}
