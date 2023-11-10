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
import { AnimalActivityLog } from "./AnimalActivityLog";
import { AnimalFeedingLog } from "./AnimalFeedingLog";
import { AnimalObservationLog } from "./AnimalObservationLog";
import { Employee } from "./Employee";
import { Enclosure } from "./Enclosure";
import { KeeperType, Specialization } from "./Enumerated";
import { ZooEvent } from "./ZooEvent";
import { PublicEvent } from "./PublicEvent";

class Keeper extends Model<
  InferAttributes<Keeper>,
  InferCreationAttributes<Keeper>
> {
  declare keeperType: KeeperType;
  declare specialization: Specialization;
  declare isDisabled: boolean;

  declare employee?: Employee;
  declare zooEvents?: ZooEvent[];
  declare enclosures?: Enclosure[];
  declare animalObservationLogs?: AnimalObservationLog[];
  declare animalActivityLogs?: AnimalActivityLog[];
  declare animalFeedingLogs?: AnimalFeedingLog[];
  declare publicEvents?: PublicEvent[];

  declare getEmployee: BelongsToGetAssociationMixin<Employee>;
  declare setEmployee: BelongsToSetAssociationMixin<Employee, number>;

  declare getZooEvents: BelongsToManyGetAssociationsMixin<ZooEvent>;
  declare addZooEvent: BelongsToManyAddAssociationMixin<ZooEvent, number>;
  declare setZooEvents: BelongsToManySetAssociationsMixin<ZooEvent, number>;
  declare removeZooEvent: BelongsToManyRemoveAssociationMixin<ZooEvent, number>;

  declare getEnclosures: BelongsToManyGetAssociationsMixin<Enclosure>;
  declare addEnclosure: BelongsToManyAddAssociationMixin<Enclosure, number>;
  declare setEnclosure: BelongsToManySetAssociationsMixin<Enclosure, number>;
  declare removeEnclosure: BelongsToManyRemoveAssociationMixin<Enclosure, number>;

  declare getAnimalObservationLogs: HasManyGetAssociationsMixin<AnimalObservationLog>;
  declare addAnimalObservationLog: HasManyAddAssociationMixin<AnimalObservationLog, number>;
  declare setAnimalObservationLogs: HasManySetAssociationsMixin<AnimalObservationLog, number>;
  declare removeAnimalObservationLog: HasManyRemoveAssociationMixin<AnimalObservationLog, number>;

  declare getAnimalActivityLogs: HasManyGetAssociationsMixin<AnimalActivityLog>;
  declare addAnimalActivityLog: HasManyAddAssociationMixin<AnimalActivityLog, number>;
  declare setAnimalActivityLogs: HasManySetAssociationsMixin<AnimalActivityLog, number>;
  declare removeAnimalActivityLog: HasManyRemoveAssociationMixin<AnimalActivityLog, number>;

  declare getAnimalFeedingLogs: HasManyGetAssociationsMixin<AnimalFeedingLog>;
  declare addAnimalFeedingLog: HasManyAddAssociationMixin<AnimalFeedingLog, number>;
  declare setAnimalFeedingLogs: HasManySetAssociationsMixin<AnimalFeedingLog, number>;
  declare removeAnimalFeedingLog: HasManyRemoveAssociationMixin<AnimalFeedingLog, number>;

  declare getPublicEvents: HasManyGetAssociationsMixin<PublicEvent>;
  declare addPublicEvent: HasManyAddAssociationMixin<PublicEvent, number>;
  declare setPublicEvents: HasManySetAssociationsMixin<PublicEvent, number>;
  declare removePublicEvent: HasManyRemoveAssociationMixin<PublicEvent, number>;

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
    if (specialization === "AMPHIBIAN") {
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
    if (roleType === "KEEPER") {
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
      defaultValue: false,
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

