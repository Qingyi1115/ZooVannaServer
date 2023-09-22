import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    CreationOptional,
  } from "Sequelize";
  import { conn } from "../db";
import { Sensor } from "./sensor";
  
  class MaintenanceLog extends Model<
    InferAttributes<MaintenanceLog>,
    InferCreationAttributes<MaintenanceLog>
  > {
    declare maintenanceLogId : CreationOptional<number>;
    declare dateTime : Date;
    declare title : string;
    declare details : string;
    declare remarks: string;
    
    declare Sensor? :Sensor;
  
    declare getSensor: BelongsToGetAssociationMixin<Sensor>;
    declare setSensor: BelongsToSetAssociationMixin<Sensor, number>;
  }
  
  MaintenanceLog.init(
    {
        maintenanceLogId: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        dateTime: {
          type: DataTypes.DATE,
          allowNull: false
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false
        },
        details: {
          type: DataTypes.STRING,
          allowNull: false
        },
        remarks: {
          type: DataTypes.STRING,
          allowNull: false
        },
    },
    {
      freezeTableName: true,
      timestamps: true,
      createdAt: true,
      updatedAt: "updateTimestamp",
      sequelize: conn, // We need to pass the connection instance
      modelName: "maintenanceLog", // We need to choose the model name
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
  
  export { MaintenanceLog };
  