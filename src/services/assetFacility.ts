import { SensorType } from "../models/enumerated";
import { validationErrorHandler } from "../helpers/errorHandler";
import { Facility } from "../models/facility";
import { Sensor } from "../models/sensor";
import { HubProcessor } from "../models/hubProcessor";

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
  processorName: string,
  ipAddressName: string,
): Promise<HubProcessor> {
  try {
    const facility = await Facility.findOne({
      where: { facilityId: facilityId },
    });
    if (!facility) throw { message: "Unable to find facilityId " + facilityId };

    const newHub = await HubProcessor.create({
      processorName: processorName,
      ipAddressName: ipAddressName,
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
