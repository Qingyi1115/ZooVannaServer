import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyRemoveAssociationMixin,
} from "Sequelize";
import { conn } from "../db";
import { Employee } from "./employee";
import { PlannerType, Specialization } from "./enumerated";

class PlanningStaff extends Model<
  InferAttributes<PlanningStaff>,
  InferCreationAttributes<PlanningStaff>
> {
  declare plannerType: PlannerType;
  declare specialization: Specialization;
  declare isDisabled: boolean; 

  declare employee?: Employee;
  declare events?: Event[];

  declare getEmployee: BelongsToGetAssociationMixin<Employee>;
  declare setEmployee: BelongsToSetAssociationMixin<Employee, number>;

  declare getEvents: HasManyGetAssociationsMixin<Event[]>;
  declare addEvents: HasManyAddAssociationMixin<Event, number>;
  declare setEvents: HasManySetAssociationsMixin<Event[], number>;
  declare removeEvent: HasManyRemoveAssociationMixin<Event, number>;

  public enable() {
    this.isDisabled = false;
    this.save();
  }

  public disable() {
    this.isDisabled = true;
    this.save();
  }

  public updateSpecialization(specialization: string) {
    if(specialization === "AMPHIBIAN") {
      this.specialization = Specialization.AMPHIBIAN; Specialization.REPTILE
    } else if (specialization === "BIRD") {
      this.specialization = Specialization.BIRD;
    } else if (specialization === "FISH") {
      this.specialization = Specialization.FISH;
    } else if (specialization === "MAMMAL") {
      this.specialization = Specialization.MAMMAL;
    } else if (specialization === "REPTILE") {
      this.specialization = Specialization.REPTILE;
    }
    this.save();
  }

  public updatePlanningStaffType(roleType: string) { 
    if(roleType === "CURATOR") {
      this.plannerType = PlannerType.CURATOR;
    } else if (roleType === "CUSTOMER_OPERATIONS") {
      this.plannerType = PlannerType.CUSTOMER_OPERATIONS;
    } else if (roleType === "MARKETING") {
      this.plannerType = PlannerType.MARKETING;
    } else if (roleType === "OPERATIONS_MANAGER") {
      this.plannerType = PlannerType.OPERATIONS_MANAGER;
    } else if (roleType === "SALES") {
      this.plannerType = PlannerType.SALES;
    }
    this.save();
  }

  public setCurator() {
    this.plannerType = PlannerType.CURATOR;
    this.save();
  }

  public setCustomerOperations() {
    this.plannerType = PlannerType.CUSTOMER_OPERATIONS;
    this.save();
  }

  public setMarketing() {
    this.plannerType = PlannerType.MARKETING;
    this.save();
  }

  public setOperationsManager() {
    this.plannerType = PlannerType.OPERATIONS_MANAGER;
    this.save();
  }

  public setSales() {
    this.plannerType = PlannerType.SALES;
    this.save();
  }

}

PlanningStaff.init(
  {
    plannerType: {
      type: DataTypes.ENUM,
      values: Object.values(PlannerType),
      allowNull: false,
    },
    specialization: {
      type: DataTypes.ENUM,
      values: Object.values(Specialization),
      allowNull: false,
    },
    isDisabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "planningStaff", // We need to choose the model name
  },
);

export { PlanningStaff };
