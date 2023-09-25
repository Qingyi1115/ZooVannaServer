import { GeneralStaffType, HubStatus, SensorType } from "../models/enumerated";
import { validationErrorHandler } from "../helpers/errorHandler";
import { Facility } from "../models/facility";
import { Sensor } from "../models/sensor";
import { HubProcessor } from "../models/hubProcessor";
import { hash } from "../helpers/security";
import { findEmployeeById, getAllEmployees } from "./employee";
import { GeneralStaff } from "../models/generalStaff";
import { InHouse } from "../models/inHouse";
import { FacilityLog } from "../models/faciltiyLog";
import { compareDates } from "../helpers/others";
import { predictNextDate } from "../helpers/predictors";
import { MaintenanceLog } from "../models/maintenanceLog";
import { Employee } from "models/employee";

export async function createNewFacility(
  facilityName: string,
  xCoordinate: number,
  yCoordinate: number,
  isSheltered: boolean,
  facilityDetail: string,
  facilityDetailJson: any,
) {
  let newFacility = {
    facilityName: facilityName,
    xCoordinate: xCoordinate,
    yCoordinate: yCoordinate,
    isSheltered: isSheltered
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

export async function getFacilityById(facilityId: number, includes: string[] = []) {
  try {
    const facility = await Facility.findOne({
      where: { facilityId: facilityId },
      include: includes
    });
    if (!facility) throw { message: "Unable to find facility!" }
    return facility;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllFacilityMaintenanceSuggestions() {
  try {

    let facilities: Facility[] = await getAllFacility([], true);
    facilities = facilities.filter(facility => facility.facilityDetail == "inHouse");
    const suggested = []

    for (const facility in facilities) {
      let inHouse = await (facility as any).getFacilityDetail();
      let logs = (await inHouse.getFacilityLogs()) || [];
      logs = logs.map( (log: FacilityLog) => log.dateTime);
      (facility as any).dataValues["predictedMaintenanceDate"] = predictNextDate(logs.slice(0, Math.max(logs.length, 5)));
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
      if (facilityDetail === undefined) throw { message: "Unable to find facilityDetail for facilityId " + facilityId, };

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
  employeeIds: number[]
): Promise<InHouse> {
  try {
    const facility = await Facility.findOne({
      where: { facilityId: facilityId },
    });
    if (!facility) throw { message: "Unable to find facilityId: " + facilityId };
    const inHouse = await facility.getFacilityDetail();
    if (!inHouse) throw { message: "Facility is not In House!" };

    let employees = await getAllEmployees([]);
    employees = employees.filter(employee => employeeIds.includes(employee.employeeId));
    const staffList: GeneralStaff[] = []
    for (const emp of employees) {
      const staff = await emp.getGeneralStaff();
      if (staff.generalStaffType != GeneralStaffType.ZOO_MAINTENANCE) throw { message: "Not a Maintenance Staff!" }
      staffList.push(staff)
    }
    for (const staff of staffList){
      for (const assigned of (await inHouse.getMaintenanceStaffs())){
        if ((await assigned.getEmployee()).employeeId == (await staff.getEmployee()).employeeId) {
          throw {message : "Stuff alreadly assigned!"}
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
  employeeIds: number[]
): Promise<InHouse> {
  try {
    const facility = await Facility.findOne({
      where: { facilityId: facilityId },
    });
    if (!facility) throw { message: "Unable to find facilityId: " + facilityId };
    const inHouse = await facility.getInHouse();
    if (!inHouse) throw { message: "Facility is not In House!" };

    let employees = await getAllEmployees([]);
    employees = employees.filter(employee => employeeIds.includes(employee.employeeId));
    const staffList: GeneralStaff[] = []
    for (const emp of employees) {
      const staff = await emp.getGeneralStaff();
      staffList.push(staff)
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
  employeeIds: number[]
): Promise<InHouse> {
  try {
    const facility = await Facility.findOne({
      where: { facilityId: facilityId },
    });
    if (!facility) throw { message: "Unable to find facilityId: " + facilityId };
    const inHouse = await facility.getInHouse();
    if (!inHouse) throw { message: "Facility is not In House!" };

    let employees = await getAllEmployees([]);
    employees = employees.filter(employee => employeeIds.includes(employee.employeeId));
    const generalStaffs = employees.map(employee => employee.getGeneralStaff());
    const staffList: GeneralStaff[] = []
    for (const staffPromise of generalStaffs) {
      const staff = await staffPromise;
      console.log("staff",staff)
      if (staff.generalStaffType != GeneralStaffType.ZOO_OPERATIONS) throw { message: "Not a Operation Staff!" }
      staffList.push(staff)
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
  employeeIds: number[]
): Promise<InHouse> {
  try {
    const facility = await Facility.findOne({
      where: { facilityId: facilityId },
    });
    if (!facility) throw { message: "Unable to find facilityId: " + facility };
    const inHouse = await facility.getInHouse();
    if (!inHouse) throw { message: "Facility is not In House!" };

    let employees = await getAllEmployees([]);
    employees = employees.filter(employee => employeeIds.includes(employee.employeeId));
    const generalStaffs = employees.map(employee => employee.getGeneralStaff());
    const staffList: GeneralStaff[] = []
    for (const staffPromise of generalStaffs) {
      const staff = await staffPromise;
      console.log("staff",staff)
      if (staff.generalStaffType != GeneralStaffType.ZOO_OPERATIONS) throw { message: "Not a Operation Staff!" }
      staffList.push(staff)
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
  facilityId: number
): Promise<FacilityLog[]> {
  try {
    const facility = await Facility.findOne({
      where: { facilityId: facilityId },
    });
    if (!facility) throw { message: "Unable to find facilityId: " + facility };
    const thirdParty = await facility.getFacilityDetail();
    if (facility.facilityDetail != "inHouse") throw {message: "Not an in-house facility!"}

    return thirdParty.getFacilityLogs();
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function createFacilityLog(
  facilityId: number,
  isMaintenance: boolean,
  title : string,
  details : string,
  remarks: string,
): Promise<FacilityLog> {
  try {
    const facility = await Facility.findOne({
      where: { facilityId: facilityId },
    });
    if (!facility) throw { message: "Unable to find facilityId: " + facility };
    const thirdParty = await facility.getFacilityDetail();
    if (facility.facilityDetail != "inHouse") throw {message: "Not an in-house facility!"}

    const facilityLog = await FacilityLog.create({
      dateTime : new Date(),
      isMaintenance: isMaintenance,
      title : title,
      details : details,
      remarks: remarks
    })
    thirdParty.addFacilityLog(facilityLog);

    return facilityLog;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function addHubProcessorByFacilityId(
  facilityId: number,
  processorName: string,
  includes: string[] = []
): Promise<HubProcessor> {
  try {
    const facility = await Facility.findOne({
      where: { facilityId: facilityId },
      include: includes
    });
    if (!facility) throw { message: "Unable to find facilityId " + facilityId };

    const newHub = await HubProcessor.create({
      processorName: processorName,
      // hubStatus: HubStatus.PENDING,
      hubStatus: HubStatus.CONNECTED
    } as any);

    await facility.addHubProcessor(newHub);
    return newHub;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllFacility(
  includes: any,
  facilityDetail: boolean
): Promise<Facility[]> {
  try {
    const all_Facilities = await Facility.findAll({ include: includes });

    if (facilityDetail) all_Facilities.forEach(async facility => (facility as any)["facilityDetails"] = await facility.getFacilityDetail());

    return all_Facilities;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deleteFacilityById(
  facilityId: number
): Promise<void> {
  try {
    const facility = await Facility.findOne({
      where: { facilityId: facilityId },
    });

    if (!facility) throw { message: "Unable to find facilityId: " + facilityId };

    return facility.destroy();
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function _getAllHubs(includes: string[] = []): Promise<HubProcessor[]> {
  try {
    return HubProcessor.findAll({ include: includes });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function _getAllSensors(includes: string[] = []): Promise<Sensor[]> {
  try {
    return Sensor.findAll({ include: includes });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getSensorReadingBySensorId(
  sensorId: number,
) {
  try {
    const sensor = await Sensor.findOne({
      where: { sensorId: sensorId },
    });
    if (!sensor) throw { message: "Unable to find sensorId: " + sensorId };

    return sensor.getSensorReadings();
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllSensorMaintenanceSuggestions() {
  try {

    let sensors: any[] = await _getAllSensors(["sensorReadings"]);
    let counter = 0
    for (const sensor of sensors){
      let logs = (await sensor.getMaintenanceLogs()) || [];
      let dateLogs = logs.map((log:MaintenanceLog)=>log.dateTime);
      (sensor as any).dataValues["predictedMaintenanceDate"] = predictNextDate(dateLogs.slice(0, Math.max(dateLogs.length, 5)));
      counter = counter + 1
    }
    return sensors;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getHubProcessorById(hubProcessorId: number, includes: string[] = []) {
  try {
    const hub = await HubProcessor.findOne({
      where: { hubProcessorId: hubProcessorId },
      include: includes
    });
    if (!hub) throw { message: "Unable to find hub!" }
    return hub;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function updateHubByHubId(
  hubId: number,
  data: any
): Promise<HubProcessor> {
  try {
    const hubProcessor = await HubProcessor.findOne({
      where: { hubProcessorId: hubId },
    }) as any;
    if (!hubProcessor) throw { message: "Unable to find HubProcessorId: " + hubId };

    for (const [key, value] of Object.entries(data)) {
      hubProcessor[key] = value;
    }
    hubProcessor.save();

    return hubProcessor;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function updateSensorById(
  sensorId: number,
  data: any
): Promise<HubProcessor> {
  try {
    const sensor = await Sensor.findOne({
      where: { sensorId: sensorId },
    }) as any;
    if (!sensor) throw { message: "Unable to find sensorId: " + sensorId };

    for (const [key, value] of Object.entries(data)) {
      sensor[key] = value;
    }
    sensor.save();

    return sensor;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deleteHubById(
  hubId: number,
): Promise<void> {
  try {
    const hubProcessor = await HubProcessor.findOne({
      where: { hubProcessorId: hubId },
    });
    if (!hubProcessor) throw { message: "Unable to find HubProcessorId: " + hubId };

    return hubProcessor.destroy();
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deleteSensorById(
  sensorId: number,
): Promise<void> {
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

export async function createMaintenanceLog(
  sensorId: number,
  date : Date, 
  title : string, 
  details:string, 
  remarks:string
): Promise<MaintenanceLog>{
  try {
    const sensor = await Sensor.findOne({
      where: { sensorId: sensorId },
    });
    if (!sensor) throw { message: "Unable to find sensorId: " + sensorId };

    const newLog = await MaintenanceLog.create({
      dateTime:date,
      title:title,
      details:details,
      remarks:remarks
    })
    sensor.addMaintenanceLog(newLog);
    newLog.setSensor(sensor);

    return newLog;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllSensorMaintenanceLogs(
  sensorId: number
): Promise<MaintenanceLog[]>{
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

export async function addSensorByHubProcessorId(
  hubProcessorId: number,
  sensorType: SensorType,
  sensorName: string,
): Promise<Sensor> {
  try {
    const hubProcessor = await HubProcessor.findOne({
      where: { hubProcessorId: hubProcessorId },
    });
    if (!hubProcessor) throw { message: "Unable to find hubProcessorId " + hubProcessorId };
    if (hubProcessor.hubStatus != HubStatus.CONNECTED) throw { message: "Hub not connected!" };

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
  ipAddress: string
): Promise<string> {
  try {
    const hubProcessor = await HubProcessor.findOne({
      where: { processorName: processorName },
    });
    if (!hubProcessor) throw { message: "Unable to find processorName " + processorName };
    if (hubProcessor.hubStatus != HubStatus.PENDING) throw { message: "Hub has alreadly been initizlized!" };

    const newtoken = hubProcessor.generateHubSecret();
    hubProcessor.lastDataUpdate = new Date();
    hubProcessor.hubStatus = HubStatus.CONNECTED;
    hubProcessor.ipAddressName = ipAddress;
    hubProcessor.save();

    return newtoken;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function assignMaintenanceStaffToSensorById(
  sensorId: number,
  employeeId: number
): Promise<Sensor> {
  try {
    const sensor = await Sensor.findOne({
      where: { sensorId: sensorId },
    });
    if (!sensor) throw { message: "Unable to find sensorId: " + sensorId };
    
    const generalStaff = await (await findEmployeeById(employeeId)).getGeneralStaff();
    if (!generalStaff) throw { message: "Unable to find generalStaff with employeeId: " + employeeId };

    sensor.setGeneralStaff(generalStaff);
    generalStaff.addSensor(sensor);
    await sensor.save();
    
    return sensor;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function removeMaintenanceStaffFromSensorById(
  sensorId: number,
  employeeId: number
): Promise<Sensor> {
  try {
    const sensor = await Sensor.findOne({
      where: { sensorId: sensorId },
    });
    if (!sensor) throw { message: "Unable to find sensorId: " + sensorId };
    
    const generalStaff = await (await findEmployeeById(employeeId)).getGeneralStaff();
    if (!generalStaff) throw { message: "Unable to find generalStaff with employeeId: " + employeeId };

    generalStaff.removeSensor(sensor);
    sensor.setGeneralStaff(undefined);
    sensor.save();

    return sensor;
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
    if (sensor.sensorType != SensorType.CAMERA) throw { message: "Not a camera!" };

    const hub = await sensor.getHubProcessor();
    if (hub.hubStatus == HubStatus.PENDING) throw { message: "Hub has not initialized!" };

    const currentDT = Date.now().toString();

    return {
      userId: userId,
      hubId: hub.hubProcessorId,
      date: currentDT,
      ipAddressName: hub.ipAddressName,
      signature: hash(userId + hub.hubProcessorId.toString() + currentDT + hub.hubSecret)
    };
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getMaintenanceStaffsByFacilityId(
  facilityId: number
) {
  try {
    const facility = await getFacilityById(facilityId);
    const inHouse: InHouse = await facility.getFacilityDetail();
    if (facility.facilityDetail != "inHouse") throw { message: "Facility not in house type!" };
    let staffs: GeneralStaff[] = await inHouse.getMaintenanceStaffs();
    let emps: Employee[] = []
    for (const staff of staffs) {
      emps.push(await staff.getEmployee());
    }
    return emps;


  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllMaintenanceStaff(
  includes: string[]
) {
  try {
    if (!includes.includes("generalStaff")) includes.push("generalStaff")
    let employees: Employee[] = await getAllEmployees(includes);
    employees = employees.filter(emp => emp.generalStaff?.generalStaffType == GeneralStaffType.ZOO_MAINTENANCE);
    return employees;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

