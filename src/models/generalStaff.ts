import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManySetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
  HasManyRemoveAssociationMixin,
} from "Sequelize";
import { conn } from "../db";
import { Employee } from "./employee";
import { GeneralStaffType } from "./enumerated";
import { InHouse } from "./inHouse";
import { Sensor } from "./sensor";

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

  declare getEmployee: BelongsToGetAssociationMixin<Employee>;
  declare setEmployee: BelongsToSetAssociationMixin<Employee, number>;

  declare getMaintainedFacilities: BelongsToGetAssociationMixin<InHouse[]>;
  declare addMaintainedFacility: BelongsToManyAddAssociationMixin<InHouse, number>;
  declare setMaintainedFacilities: BelongsToSetAssociationMixin<InHouse[], number>;
  declare removeMaintainedFacility: BelongsToManyRemoveAssociationMixin<InHouse, number>;

  declare getOperatedFacility: BelongsToGetAssociationMixin<InHouse>;
  declare setOperatedFacility: BelongsToSetAssociationMixin<InHouse, number>;

  declare getSensors: HasManyGetAssociationsMixin<Sensor[]>;
  declare addSensor: HasManyAddAssociationMixin<Sensor, number>;
  declare setSensors: HasManySetAssociationsMixin<Sensor[], number>;
  declare removeSensor: HasManyRemoveAssociationMixin<Sensor, number>;
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
      allowNull: false,
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
