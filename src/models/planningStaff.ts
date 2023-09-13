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

  declare employee?: Employee;
  declare events?: Event[];

  declare getEmployee: BelongsToGetAssociationMixin<Employee>;
  declare setEmployee: BelongsToSetAssociationMixin<Employee, number>;

  declare getEvents: HasManyGetAssociationsMixin<Event[]>;
  declare addEvents: HasManyAddAssociationMixin<Event, number>;
  declare setEvents: HasManySetAssociationsMixin<Event[], number>;
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
