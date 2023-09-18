import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
} from "Sequelize";
import { conn } from "../db";
import { Employee } from "./employee";
import { Enclosure } from "./enclosure";
import { KeeperType, Specialization } from "./enumerated";

class Keeper extends Model<
  InferAttributes<Keeper>,
  InferCreationAttributes<Keeper>
> {
  declare keeperType: KeeperType;
  declare specialization: Specialization;
  declare isDisabled: boolean; 

  declare employee?: Employee;
  declare events?: Event[];
  declare enclosures?: Enclosure[];


  declare getEmployee: BelongsToGetAssociationMixin<Employee>;
  declare setEmployee: BelongsToSetAssociationMixin<Employee, number>;

  declare getEvents: BelongsToManyGetAssociationsMixin<Event[]>;
  declare addEvent: BelongsToManyAddAssociationMixin<Event, number>;
  declare setEvents: BelongsToManySetAssociationsMixin<Event[], number>;

  declare getEnclosures: BelongsToManyGetAssociationsMixin<Enclosure[]>;
  declare addEnclosure: BelongsToManyAddAssociationMixin<Enclosure, number>;
  declare setEnclosure: BelongsToManySetAssociationsMixin<Enclosure[], number>;
  declare removeEnclosure: BelongsToManyRemoveAssociationMixin<Enclosure, number>;


  // public toJSON() {
  //     // Can control default values returned rather than manually populating json, removing secrets
  //     // Similar idea albert more useful when compared to java's toString
  //     return {...this.get(), EmployeeEmployeeId: undefined}
  // }
}

Keeper.init(
  {
    keeperType: {
      type: DataTypes.ENUM,
      values: Object.values(KeeperType),
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
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "keeper", // We need to choose the model name
  },
);

export { Keeper };
