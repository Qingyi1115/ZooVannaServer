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
} from "Sequelize";
import { conn } from "../db";
import { SensorType } from "./enumerated";
import { HubProcessor } from "./hubProcessor";
import { SensorReading } from "./sensorReading";

class Sensor extends Model<
  InferAttributes<Sensor>,
  InferCreationAttributes<Sensor>
> {
  declare sensorId: number;
  // declare sensorReadings: number[] | string;
  declare sensorName: string;
  declare dateOfActivation: Date;
  declare dateOfLastMaintained: Date;
  declare sensorType: SensorType;

  declare hubProcessor?: HubProcessor;
  declare sensorReading? :SensorReading;

  declare getHubProcessor: BelongsToGetAssociationMixin<HubProcessor>;
  declare setHubProcessor: BelongsToSetAssociationMixin<HubProcessor, number>;

  declare getSensorReadings: HasManyGetAssociationsMixin<SensorReading[]>;
  declare addSensorReading: HasManyAddAssociationMixin<SensorReading, number>;
  declare setSensorReadings: HasManySetAssociationsMixin<SensorReading[], number>;

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
