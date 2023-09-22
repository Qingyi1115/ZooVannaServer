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
import { Event } from "./event";

class Keeper extends Model<
  InferAttributes<Keeper>,
  InferCreationAttributes<Keeper>
> {
  declare keeperType: KeeperType;
  declare specialization: Specialization;
  declare isDisabled: boolean; 

  declare employee?: Employee;
  declare publicEvents?: Event[];
  declare internalEvents?:Event[];
  declare enclosures?: Enclosure[];


  declare getEmployee: BelongsToGetAssociationMixin<Employee>;
  declare setEmployee: BelongsToSetAssociationMixin<Employee, number>;

  declare getPublicEvents: BelongsToManyGetAssociationsMixin<Event[]>;
  declare addPublicEvent: BelongsToManyAddAssociationMixin<Event, number>;
  declare setPublicEvents: BelongsToManySetAssociationsMixin<Event[], number>;
  declare removePublicEvent: BelongsToManyRemoveAssociationMixin<Event, number>;

  declare getInternalEvents: BelongsToManyGetAssociationsMixin<Event[]>;
  declare addInternalEvent: BelongsToManyAddAssociationMixin<Event, number>;
  declare setInternalEvents: BelongsToManySetAssociationsMixin<Event[], number>;
  declare removeInternalEvent: BelongsToManyRemoveAssociationMixin<Event, number>;

  declare getEnclosures: BelongsToManyGetAssociationsMixin<Enclosure[]>;
  declare addEnclosure: BelongsToManyAddAssociationMixin<Enclosure, number>;
  declare setEnclosure: BelongsToManySetAssociationsMixin<Enclosure[], number>;
  declare removeEnclosure: BelongsToManyRemoveAssociationMixin<Enclosure, number>;


  // public toJSON() {
  //     // Can control default values returned rather than manually populating json, removing secrets
  //     // Similar idea albert more useful when compared to java's toString
  //     return {...this.get(), EmployeeEmployeeId: undefined}
  // }

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

  public updateKeeperType(roleType: string) { 
    if(roleType === "KEEPER") {
      this.keeperType = KeeperType.KEEPER;
    } else if (roleType === "SENIOR_KEEPER") {
      this.keeperType = KeeperType.SENIOR_KEEPER;
    }
    this.save();
  }
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
      defaultValue: true,
    },
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
