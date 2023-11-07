import {
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "Sequelize";
import { conn } from "../db";
import { Sensor } from "./Sensor";
  
class SensorReading extends Model<
  InferAttributes<SensorReading>,
  InferCreationAttributes<SensorReading>
> {
  declare readingDate: Date;
  declare value: number;
  
  declare sensor? :Sensor;

  declare getSensor: BelongsToGetAssociationMixin<Sensor>;
  declare setSensor: BelongsToSetAssociationMixin<Sensor, number>;
  
  public toJSON() {
    return {
      ...this.get(),
      readingDate:this.readingDate?.getTime(),
    }
  }
}
  
  SensorReading.init(
    {
        readingDate: {
          type: DataTypes.DATE,
          allowNull: false
        },
        value: {
          type: DataTypes.DOUBLE,
          allowNull: false
        },
    },
    {
      freezeTableName: true,
      timestamps: true,
      createdAt: true,
      updatedAt: "updateTimestamp",
      sequelize: conn, // We need to pass the connection instance
      modelName: "sensorReading", // We need to choose the model name
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
  
  export { SensorReading };
  