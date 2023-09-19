import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  HasManyAddAssociationMixin,
  HasManySetAssociationsMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  CreationOptional,
} from "Sequelize";
import { conn } from "../db";
import { SensorType } from "./enumerated";
import { HubProcessor } from "./hubProcessor";
import { SensorReading } from "./sensorReading";
import { GeneralStaff } from "./generalStaff";

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
  declare sensorReading? :SensorReading[];
  declare generalStaff?: GeneralStaff;

  declare getHubProcessor: BelongsToGetAssociationMixin<HubProcessor>;
  declare setHubProcessor: BelongsToSetAssociationMixin<HubProcessor, number>;

  declare getSensorReadings: HasManyGetAssociationsMixin<SensorReading>;
  declare addSensorReading: HasManyAddAssociationMixin<SensorReading, number>;
  declare setSensorReadings: HasManySetAssociationsMixin<SensorReading[], number>;
  declare removeSensorReading: HasManyRemoveAssociationMixin<SensorReading, number>;

  declare getGeneralStaff: BelongsToGetAssociationMixin<GeneralStaff>;
  declare setGeneralStaff: BelongsToSetAssociationMixin<GeneralStaff, number>;

  public async toFullJSON(){
    return {
      ...this.get(),
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
    },
    dateOfLastMaintained: {
      type: DataTypes.DATE,
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
