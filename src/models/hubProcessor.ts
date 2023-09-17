import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    CreationOptional,
    HasManyGetAssociationsMixin,
    HasManySetAssociationsMixin,
    HasManyAddAssociationMixin,
  } from "Sequelize";
import { conn } from "../db";
import { Facility } from "./facility";
import { Sensor } from "./sensor";
import { HubStatus } from "./enumerated";

class HubProcessor extends Model<
  InferAttributes<HubProcessor>,
  InferCreationAttributes<HubProcessor>
> {
  declare hubProcessorId: CreationOptional<number>;
  declare processorName : string;
  declare ipAddressName: string ;
  declare lastDataUpdate: Date | null;
  declare hubSecret: string | null;
  declare hubStatus : HubStatus;

  declare facility?: Facility;
  declare sensors?: Sensor[];

  declare getFacility: BelongsToGetAssociationMixin<Facility>;
  declare setFacility: BelongsToSetAssociationMixin<Facility, number>;

  declare getSensors: HasManyGetAssociationsMixin<Sensor[]>;
  declare addSensor: HasManyAddAssociationMixin<Sensor, number>;
  declare setSensors: HasManySetAssociationsMixin<Sensor[], number>;
}

HubProcessor.init(
  {
    hubProcessorId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    processorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ipAddressName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastDataUpdate: {
      type: DataTypes.DATE
    },
    hubSecret: {
      type: DataTypes.STRING
    },
    hubStatus:{
      type: DataTypes.ENUM,
      values: Object.values(HubStatus),
      allowNull: false,
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "hubProcessor", // We need to choose the model name
  },
);

export { HubProcessor };
