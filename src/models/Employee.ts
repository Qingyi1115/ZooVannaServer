import {
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManySetAssociationsMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "Sequelize";
import { conn } from "../db";
import { hash } from "../helpers/security";
import { AnimalActivity } from "./AnimalActivity";
import { GeneralStaff } from "./GeneralStaff";
import { Keeper } from "./Keeper";
import { PlanningStaff } from "./PlanningStaff";
import { ZooEvent } from "./ZooEvent";
import { Enclosure } from "./Enclosure";

function uppercaseFirst(str: string) {
  return `${str[0].toUpperCase()}${str.substr(1)}`;
}

function convertString(doorAccessCode: number): string {
  return (
    "0".repeat(6 - doorAccessCode.toString().length) + doorAccessCode.toString()
  );
}

class Employee extends Model<
  InferAttributes<Employee>,
  InferCreationAttributes<Employee>
> {
  declare employeeId: CreationOptional<number>;
  declare employeeName: string;
  declare employeeEmail: string;
  declare employeeAddress: string;
  declare employeePhoneNumber: string;
  declare employeePasswordHash: string;
  declare employeeSalt: string;
  declare employeeDoorAccessCode: string;
  declare employeeEducation: string;
  declare employeeBirthDate: Date;
  declare isAccountManager: boolean;
  declare dateOfResignation: Date | null;
  declare superAdmin: boolean;

  declare keeper?: Keeper | null;
  declare planningStaff?: PlanningStaff | null;
  declare generalStaff?: GeneralStaff | null;
  declare zooEvents?: ZooEvent[];
  declare enclosure?: Enclosure[];

  declare getKeeper: HasOneGetAssociationMixin<Keeper>;
  declare setKeeper: HasOneSetAssociationMixin<Keeper, number>;

  declare getPlanningStaff: HasOneGetAssociationMixin<PlanningStaff>;
  declare setPlanningStaff: HasOneSetAssociationMixin<PlanningStaff, number>;

  declare getGeneralStaff: HasOneGetAssociationMixin<GeneralStaff>;
  declare setGeneralStaff: HasOneSetAssociationMixin<GeneralStaff, number>;

  declare getAnimalActivities: HasManyGetAssociationsMixin<AnimalActivity>;
  declare addAnimalActivity: HasManyAddAssociationMixin<AnimalActivity, number>;
  declare setAnimalActivities: HasManySetAssociationsMixin<
    AnimalActivity,
    number
  >;
  declare removeAnimalActivity: HasManyRemoveAssociationMixin<
    AnimalActivity,
    number
  >;

  declare getZooEvents: HasManyGetAssociationsMixin<ZooEvent>;
  declare addZooEvent: HasManyAddAssociationMixin<ZooEvent, number>;
  declare setZooEvents: HasManySetAssociationsMixin<ZooEvent, number>;
  declare removeZooEvent: HasManyRemoveAssociationMixin<ZooEvent, number>;

  declare getEnclosures: HasManyGetAssociationsMixin<Enclosure>;
  declare addEnclosure: HasManyAddAssociationMixin<Enclosure, number>;
  declare setEnclosures: HasManySetAssociationsMixin<Enclosure, number>;
  declare removeEnclosure: HasManyRemoveAssociationMixin<Enclosure, number>;

  static getTotalEmployees() {
    // Example for static class functions
    return Employee.count();
  }

  public setAsAccountManager() {
    this.isAccountManager = true;
    this.save();
    return this;
  }

  public unsetAsAccountManager() {
    this.isAccountManager = false;
    this.save();
    return this;
  }

  public testPassword(password: string) {
    return !hash(password + this.employeeSalt).localeCompare(
      this.employeePasswordHash,
    );
  }

  public updatePassword(password: string) {
    this.employeePasswordHash = hash(password + this.employeeSalt);
    this.save();
    return this;
  }

  public disableAccount(dateOfResignation: Date) {
    this.dateOfResignation = dateOfResignation;
    this.save();
    console.log("Employee account has been disabled");
    return this.dateOfResignation;
  }

  static generateEmployeeSalt() {
    return (Math.random() + 1).toString(36).substring(7);
  }

  static getHash(password: string, salt: string) {
    return hash(password + salt);
  }

  static async generateNewDoorAccessCode() {
    let accessCode = convertString(Math.floor(Math.random() * 999999));
    while (
      (await Employee.findOne({
        where: { employeeDoorAccessCode: accessCode },
      })) != null
    ) {
      accessCode = convertString(Math.floor(Math.random() * 999999));
    }
    return accessCode;
  }

  public toJSON() {
    return {
      ...this.get(),
      keeper: this.keeper?.toJSON(),
      planningStaff: this.planningStaff?.toJSON(),
      generalStaff: this.generalStaff?.toJSON(),
      employeePasswordHash: undefined,
      employeeSalt: undefined,
      employeeBirthDate: this.employeeBirthDate?.getTime(),
      dateOfResignation: this.dateOfResignation?.getTime(),
    };
  }

  public async toFullJSON() {
    return {
      ...this.toJSON(),
      keeper: (await this.getKeeper())?.toJSON(),
      generalStaff: (await this.getGeneralStaff())?.toJSON(),
      planningStaff: (await this.getPlanningStaff())?.toJSON(),
    };
  }
}

Employee.init(
  {
    employeeId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    employeeName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    employeeEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    employeeAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employeePhoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    employeePasswordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    employeeSalt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employeeDoorAccessCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    employeeBirthDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    employeeEducation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAccountManager: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    dateOfResignation: {
      type: DataTypes.DATE,
    },
    superAdmin: {
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
    modelName: "employee", // We need to choose the model name
  },
);

export { Employee };
