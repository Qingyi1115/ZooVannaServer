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
  declare ipAddressName: string | null;
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

  public generateHubSecret() {
    this.hubSecret = (Math.random() + 1).toString(36).substring(7) + (Math.random() + 1).toString(36).substring(7);
    return this.hubSecret;
  }
  
  public toJSON() {
    // Can control default values returned rather than manually populating json, removing secrets
    // Similar idea albert more useful when compared to java's toString
    return {
      ...this.get(),
      hubSecret: undefined,
    };
  }
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
      unique:true
    },
    ipAddressName: {
      type: DataTypes.STRING
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
