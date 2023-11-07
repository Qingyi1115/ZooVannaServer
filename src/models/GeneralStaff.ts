import {
  BelongsToGetAssociationMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToSetAssociationMixin,
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
import { Employee } from "./Employee";
import { GeneralStaffType } from "./Enumerated";
import { FacilityLog } from "./FacilityLog";
import { InHouse } from "./InHouse";
import { Sensor } from "./Sensor";

class GeneralStaff extends Model<
  InferAttributes<GeneralStaff>,
  InferCreationAttributes<GeneralStaff>
> {
  declare generalStaffType: GeneralStaffType;
  declare isDisabled: boolean; 

  declare employee?: Employee;
  declare maintainedFacilities?: InHouse[];
  declare operatedFacility?: InHouse;
  declare sensors?: Sensor[];
  declare facilityLogs?: FacilityLog[];

  declare getEmployee: BelongsToGetAssociationMixin<Employee>;
  declare setEmployee: BelongsToSetAssociationMixin<Employee, number>;

  declare getMaintainedFacilities: BelongsToManyGetAssociationsMixin<InHouse>;
  declare addMaintainedFacility: BelongsToManyAddAssociationMixin<InHouse, number>;
  declare setMaintainedFacilities: BelongsToManySetAssociationsMixin<InHouse, number>;
  declare removeMaintainedFacility: BelongsToManyRemoveAssociationMixin<InHouse, number>;

  declare getOperatedFacility: BelongsToGetAssociationMixin<InHouse>;
  declare setOperatedFacility: BelongsToSetAssociationMixin<InHouse, number>;

  declare getSensors: HasManyGetAssociationsMixin<Sensor>;
  declare addSensor: HasManyAddAssociationMixin<Sensor, number>;
  declare setSensors: HasManySetAssociationsMixin<Sensor, number>;
  declare removeSensor: HasManyRemoveAssociationMixin<Sensor, number>;

  declare getFacilityLogs: BelongsToManyGetAssociationsMixin<FacilityLog>;
  declare addFacilityLog: BelongsToManyAddAssociationMixin<FacilityLog, number>;
  declare setFacilityLogs: BelongsToManySetAssociationsMixin<FacilityLog, number>;
  declare removeFacilityLog: BelongsToManyRemoveAssociationMixin<FacilityLog, number>;

  
  public toJSON() {
    return {
      ...this.get(),
    }
  }

  public async toFullJSON(){
    return {
      ...this.get(),
      employee: (await this.getEmployee())?.toJSON(),
      maintainedFacilities: (await this.getMaintainedFacilities()),
      operatedFacility: (await this.getOperatedFacility()),
      sensors: (await this.getSensors())
    };
  }

  public enable() {
    this.isDisabled = false;
    this.save();
  }

  public disable() {
    this.isDisabled = true;
    this.save();
  }

  public updateGeneralStaffType(roleType: string) { 
    if(roleType === "ZOO_MAINTENANCE") {
      this.generalStaffType = GeneralStaffType.ZOO_MAINTENANCE;
    } else if (roleType === "ZOO_OPERATIONS") {
      this.generalStaffType = GeneralStaffType.ZOO_OPERATIONS;
    }
    this.save();
  }
}

GeneralStaff.init(
  {
    generalStaffType: {
      type: DataTypes.ENUM,
      values: Object.values(GeneralStaffType),
      allowNull: false,
    },
    isDisabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "generalStaff", // We need to choose the model name
  },
);

export { GeneralStaff };

