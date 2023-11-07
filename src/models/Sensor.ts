import {
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "Sequelize";
import { conn } from "../db";
import { SensorType } from "./Enumerated";
import { GeneralStaff } from "./GeneralStaff";
import { HubProcessor } from "./HubProcessor";
import { MaintenanceLog } from "./MaintenanceLog";
import { SensorReading } from "./SensorReading";

class Sensor extends Model<
  InferAttributes<Sensor>,
  InferCreationAttributes<Sensor>
> {
  declare sensorId: CreationOptional<number>;
  // declare sensorReadings: number[] | string;
  declare sensorName: string;
  declare dateOfActivation: Date;
  declare dateOfLastMaintained: Date;
  declare sensorType: SensorType;

  declare hubProcessor?: HubProcessor;
  declare sensorReadings? :SensorReading[];
  declare maintenanceLog? :MaintenanceLog[];
  declare generalStaff?: GeneralStaff;

  declare getHubProcessor: BelongsToGetAssociationMixin<HubProcessor>;
  declare setHubProcessor: BelongsToSetAssociationMixin<HubProcessor, number>;

  declare getSensorReadings: HasManyGetAssociationsMixin<SensorReading>;
  declare addSensorReading: HasManyAddAssociationMixin<SensorReading, number>;
  declare setSensorReadings: HasManySetAssociationsMixin<SensorReading, number>;
  declare removeSensorReading: HasManyRemoveAssociationMixin<SensorReading, number>;

  declare getMaintenanceLogs: HasManyGetAssociationsMixin<MaintenanceLog>;
  declare addMaintenanceLog: HasManyAddAssociationMixin<MaintenanceLog, number>;
  declare setMaintenanceLogs: HasManySetAssociationsMixin<MaintenanceLog, number>;
  declare removeMaintenanceLog: HasManyRemoveAssociationMixin<MaintenanceLog, number>;

  declare getGeneralStaff: BelongsToGetAssociationMixin<GeneralStaff>;
  declare setGeneralStaff: BelongsToSetAssociationMixin<GeneralStaff, number>;

  public toJSON() {
    return {
      ...this.get(),
      dateOfActivation:this.dateOfActivation?.getTime(),
      dateOfLastMaintained:this.dateOfLastMaintained?.getTime(),
    }
  }

  public async toFullJSON(){
    return {
      ...this.toJSON(),
      hubProcessor: (await this.getHubProcessor())?.toJSON(),
      generalStaff: (await this.getGeneralStaff())?.toJSON(),
    };
  }
}

Sensor.init(
  {
    sensorId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    // sensorReadings: {
    //   type: DataTypes.STRING(5000),
    //   set(val) {
    //     this.setDataValue("sensorReadings", JSON.stringify(val ?? ""));
    //   },
    // },
    dateOfActivation: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    sensorName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    dateOfLastMaintained: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    sensorType: {
      type: DataTypes.ENUM,
      values: Object.values(SensorType),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "sensor", // We need to choose the model name
  },
);

// Sensor.addHook("afterFind", (findResult) => {
//   if (!Array.isArray(findResult)) findResult = [findResult as any];
//   for (const instance of findResult) {
//     if (instance.sensorReadings instanceof String) {
//       instance.setDataValue(
//         "sensorReadings",
//         JSON.parse(instance.sensorReadings),
//       );
//     }
//   }
// });

export { Sensor };

