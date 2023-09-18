import { HubStatus, SensorType } from "../models/enumerated";
import { validationErrorHandler } from "../helpers/errorHandler";
import { Facility } from "../models/facility";
import { Sensor } from "../models/sensor";
import { HubProcessor } from "../models/hubProcessor";
import { hash } from "../helpers/security";

export async function createNewFacility(
  facilityName: string,
  xCoordinate: number,
  yCoordinate: number,
  facilityDetail: string,
  facilityDetailJson: any,
) {
  let newFacility = {
    facilityName: facilityName,
    xCoordinate: xCoordinate,
    yCoordinate: yCoordinate,
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

export async function getFacilityById(facilityId: number) {
  try {
    return Facility.findOne({
      where: { facilityId: facilityId },
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function updateFacilityByFacilityId(
  facilityId:number,
  facilityAttribute: any,
  facilityDetailJson:any,
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
      if (facilityDetail === undefined) throw {message: "Unable to find facilityDetail for facilityId " + facilityId,};

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

export async function addHubProcessorByFacilityId(
  facilityId: number,
  processorName: string
): Promise<HubProcessor> {
  try {
    const facility = await Facility.findOne({
      where: { facilityId: facilityId },
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

export async function _getAllHubs(includes: any): Promise<HubProcessor[]> {
  try {
    return HubProcessor.findAll({include:includes});
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function _getAllSensors(includes: any): Promise<Sensor[]> {
  try {
    return Sensor.findAll({include:includes});
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
    if (!sensor) throw { message: "Unable to find sensorId: " + sensor };

    return sensor.getSensorReadings();
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function updateHubByHubId(
  hubId: number,
  data:any
): Promise<HubProcessor> {
  try {
    const hubProcessor = await HubProcessor.findOne({
      where: { hubProcessorId: hubId },
    }) as any;
    if (!hubProcessor) throw { message: "Unable to find HubProcessorId: " + hubProcessor };

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
  data:any
): Promise<HubProcessor> {
  try {
    const sensor = await Sensor.findOne({
      where: { sensorId: sensorId },
    }) as any;
    if (!sensor) throw { message: "Unable to find sensorId: " + sensor };

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
): Promise<void>{
  try {
    const hubProcessor = await HubProcessor.findOne({
      where: { hubProcessorId: hubId },
    });
    if (!hubProcessor) throw { message: "Unable to find HubProcessorId: " + hubProcessor };

    return hubProcessor.destroy();
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function deleteSensorById(
  sensorId: number,
): Promise<void>{
  try {
    const sensor = await Sensor.findOne({
      where: { sensorId: sensorId },
    });
    if (!sensor) throw { message: "Unable to find sensorId: " + sensor };

    return sensor.destroy();
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
    if (!hubProcessor) throw { message: "Unable to find hubProcessorId " + hubProcessor };
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
      where: { processorName:processorName },
    });
    if (!hubProcessor) throw { message: "Unable to find hubProcessorId " + hubProcessor };
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

export async function getAuthorizationForCameraById(
  cameraId: number,
  userId:string,
) {
  try {
    const sensor = await Sensor.findOne({
      where: { sensorId:cameraId },
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
