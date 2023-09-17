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
