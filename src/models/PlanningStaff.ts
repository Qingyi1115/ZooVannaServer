import {
  BelongsToGetAssociationMixin,
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
import { PlannerType, Specialization } from "./Enumerated";
import { ZooEvent } from "./ZooEvent";

class PlanningStaff extends Model<
  InferAttributes<PlanningStaff>,
  InferCreationAttributes<PlanningStaff>
> {
  declare plannerType: PlannerType;
  declare specialization: Specialization;
  declare isDisabled: boolean;

  declare employee?: Employee;
  declare zooEvents?: ZooEvent[];

  declare getEmployee: BelongsToGetAssociationMixin<Employee>;
  declare setEmployee: BelongsToSetAssociationMixin<Employee, number>;

  declare getZooEvents: HasManyGetAssociationsMixin<ZooEvent>;
  declare addZooEvent: HasManyAddAssociationMixin<ZooEvent, number>;
  declare setZooEvents: HasManySetAssociationsMixin<ZooEvent, number>;
  declare removeZooEvent: HasManyRemoveAssociationMixin<ZooEvent, number>;

  public enable() {
    this.isDisabled = false;
    this.save();
  }

  public disable() {
    this.isDisabled = true;
    this.save();
  }

  public updateSpecialization(specialization: string) {
    if (specialization === "AMPHIBIAN") {
      this.specialization = Specialization.AMPHIBIAN;
      Specialization.REPTILE;
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
    if (roleType === "CURATOR") {
      this.plannerType = PlannerType.CURATOR;
    } else if (roleType === "CUSTOMER_OPERATIONS") {
      this.plannerType = PlannerType.CUSTOMER_OPERATIONS;
    } else if (roleType === "MARKETING") {
      this.plannerType = PlannerType.MARKETING;
    } else if (roleType === "OPERATIONS_MANAGER") {
      this.plannerType = PlannerType.OPERATIONS_MANAGER;
    } else if (roleType === "SALES") {
      this.plannerType = PlannerType.SALES;
    } else if (roleType === "NUTRITIONIST") {
      console.log("here " + roleType);
      this.plannerType = PlannerType.NUTRITIONIST;
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

  public setNutritionist() {
    this.plannerType = PlannerType.NUTRITIONIST;
    this.save();
  }

  public toJSON() {
    return {
      ...this.get(),
    };
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
