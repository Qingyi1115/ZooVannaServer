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
import { ZooEvent } from "./zooEvent";

class Keeper extends Model<
  InferAttributes<Keeper>,
  InferCreationAttributes<Keeper>
> {
  declare keeperType: KeeperType;
  declare specialization: Specialization;
  declare isDisabled: boolean; 

  declare employee?: Employee;
  declare publicEvents?: ZooEvent[];
  declare internalEvents?:ZooEvent[];
  declare enclosures?: Enclosure[];


  declare getEmployee: BelongsToGetAssociationMixin<Employee>;
  declare setEmployee: BelongsToSetAssociationMixin<Employee, number>;

  declare getPublicEvents: BelongsToManyGetAssociationsMixin<ZooEvent>;
  declare addPublicEvent: BelongsToManyAddAssociationMixin<ZooEvent, number>;
  declare setPublicEvents: BelongsToManySetAssociationsMixin<ZooEvent, number>;
  declare removePublicEvent: BelongsToManyRemoveAssociationMixin<ZooEvent, number>;

  declare getInternalEvents: BelongsToManyGetAssociationsMixin<ZooEvent>;
  declare addInternalEvent: BelongsToManyAddAssociationMixin<ZooEvent, number>;
  declare setInternalEvents: BelongsToManySetAssociationsMixin<ZooEvent, number>;
  declare removeInternalEvent: BelongsToManyRemoveAssociationMixin<ZooEvent, number>;

  declare getEnclosures: BelongsToManyGetAssociationsMixin<Enclosure>;
  declare addEnclosure: BelongsToManyAddAssociationMixin<Enclosure, number>;
  declare setEnclosure: BelongsToManySetAssociationsMixin<Enclosure, number>;
  declare removeEnclosure: BelongsToManyRemoveAssociationMixin<Enclosure, number>;

  public toJSON() {
    return {
      ...this.get()
    }
  }

  public enable() {
    this.isDisabled = false;
    this.save();
  }

  public disable() {
    this.isDisabled = true;
    this.save();
  }

  public setSeniorKeeper() {
    this.keeperType = KeeperType.SENIOR_KEEPER;
    this.save();
  }

  public setKeeper() {
    this.keeperType = KeeperType.KEEPER;
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
