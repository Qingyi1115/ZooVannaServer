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
import { compareDates } from "../helpers/others";
import { hash } from "../helpers/security";
import { HubStatus } from "./Enumerated";
import { Facility } from "./Facility";
import { Sensor } from "./Sensor";

class HubProcessor extends Model<
  InferAttributes<HubProcessor>,
  InferCreationAttributes<HubProcessor>
> {
  declare hubProcessorId: CreationOptional<number>;
  declare processorName : string;
  declare ipAddressName: string | null;
  declare lastDataUpdate: Date | null;
  declare radioGroup: number;
  declare hubSecret: string | null;
  declare hubStatus : HubStatus;

  declare facility?: Facility;
  declare sensors?: Sensor[];

  declare getFacility: BelongsToGetAssociationMixin<Facility>;
  declare setFacility: BelongsToSetAssociationMixin<Facility, number>;

  declare getSensors: HasManyGetAssociationsMixin<Sensor>;
  declare addSensor: HasManyAddAssociationMixin<Sensor, number>;
  declare setSensors: HasManySetAssociationsMixin<Sensor, number>;
  declare removeSensor: HasManyRemoveAssociationMixin<Sensor, number>;

  public generateHubSecret() {
    this.hubSecret = (Math.random() + 1).toString(36).substring(7) + (Math.random() + 1).toString(36).substring(7);
    return this.hubSecret;
  }

  static generateRandomRadioGroup() {
    return Math.floor(Math.random() * 255);
  }

  public validatePayload(jsonPayload:string, sha256:string) {
    return sha256 == hash(jsonPayload + this.hubSecret);
  }
  
  public toJSON() {
    return {
      ...this.get(),
      hubSecret: undefined,
      lastDataUpdate:this.lastDataUpdate?.getTime(),
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
    radioGroup: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 254
      }
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
      defaultValue: HubStatus.PENDING
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

HubProcessor.addHook("afterFind", (findResult:HubProcessor[]) => {
  if (!findResult) return;
  if (!Array.isArray(findResult)) findResult = [findResult];
  for (const instance of findResult) {
    if (instance.hubStatus == HubStatus.PENDING) continue;
    if (instance.lastDataUpdate && compareDates(new Date(), instance.lastDataUpdate) < 1000 * 60 * 5 )  {
      instance.hubStatus = HubStatus.CONNECTED;
    }else{
      instance.hubStatus = HubStatus.DISCONNECTED;
    }
  }
});

export { HubProcessor };

