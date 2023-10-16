import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  HasManySetAssociationsMixin,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyRemoveAssociationMixin,
  CreationOptional,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
} from "Sequelize";
import { conn } from "../db";
import {
  AnimalSex,
  AcquisitionMethod,
  AnimalGrowthStage,
  IdentifierType,
} from "./enumerated";
import { Species } from "./species";
import { uppercaseFirst } from "../helpers/others";
import { Enclosure } from "./enclosure";
import { AnimalWeight } from "./animalWeight";
import { AnimalActivity } from "./animalActivity";
import { ZooEvent } from "./zooEvent";
import { AnimalObservationLog } from "./animalObservationLog";
import { AnimalActivityLog } from "./animalActivityLog";
import { AnimalFeedingLog } from "./animalFeedingLog";

class Animal extends Model<
  InferAttributes<Animal>,
  InferCreationAttributes<Animal>
> {
  declare animalId: CreationOptional<number>;
  declare animalCode: string;
  declare isGroup: boolean;
  declare houseName: string;
  declare sex: AnimalSex;
  declare dateOfBirth: Date;
  declare placeOfBirth: string;
  // declare rfidTagNum: string;
  declare identifierType: IdentifierType;
  declare identifierValue: string;
  declare acquisitionMethod: AcquisitionMethod;
  declare dateOfAcquisition: Date;
  declare acquisitionRemarks: string;
  // declare currentWeight: number;
  declare physicalDefiningCharacteristics: string;
  declare behavioralDefiningCharacteristics: string;
  declare dateOfDeath: Date;
  declare locationOfDeath: string;
  declare causeOfDeath: string;
  declare animalStatus: string;
  declare imageUrl: string;

  declare location?: string;
  declare age?: number | null;
  declare growthStage: AnimalGrowthStage | null;

  //--FK
  declare species?: Species;
  declare parents?: Animal[];
  declare children?: Animal[];
  declare animalWeights?: AnimalWeight[];
  declare animalActivities?: AnimalActivity[];
  declare animalObservationLogs?: AnimalObservationLog[];
  declare animalActivityLogs?: AnimalActivityLog[];
  declare animalFeedingLog?: AnimalFeedingLog[];

  //--hvnt do yet
  // declare animalClinic?: AnimalClinic;
  declare enclosure?: Enclosure;
  declare zooEvents?: ZooEvent[];

  declare getSpecies: BelongsToGetAssociationMixin<Species>;
  declare setSpecies: BelongsToSetAssociationMixin<Species, number>;

  declare getParents: HasManyGetAssociationsMixin<Animal>;
  declare addParent: HasManyAddAssociationMixin<Animal, number>;
  declare setParents: HasManySetAssociationsMixin<Animal, number>;
  declare removeParent: HasManyRemoveAssociationMixin<Animal, number>;

  declare getChildren: HasManyGetAssociationsMixin<Animal>;
  declare addChildren: HasManyAddAssociationMixin<Animal, number>;
  declare setChildren: HasManySetAssociationsMixin<Animal, number>;
  declare removeChildren: HasManyRemoveAssociationMixin<Animal, number>;

  declare getAnimalWeight: HasManyGetAssociationsMixin<AnimalWeight>;
  declare addAnimalWeight: HasManyAddAssociationMixin<AnimalWeight, number>;
  declare setAnimalWeight: HasManySetAssociationsMixin<AnimalWeight, number>;
  declare removeAnimalWeight: HasManyRemoveAssociationMixin<
    AnimalWeight,
    number
  >;

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

  declare getAnimalObservationLogs: BelongsToManyGetAssociationsMixin<AnimalObservationLog>;
  declare addAnimalObservationLog: BelongsToManyAddAssociationMixin<
    AnimalObservationLog,
    number
  >;
  declare setAnimalObservationLogs: BelongsToManySetAssociationsMixin<
    AnimalObservationLog,
    number
  >;
  declare removeAnimalObservationLog: BelongsToManyRemoveAssociationMixin<
    AnimalObservationLog,
    number
  >;

  declare getAnimalActivityLogs: BelongsToManyGetAssociationsMixin<AnimalActivityLog>;
  declare addAnimalActivityLog: BelongsToManyAddAssociationMixin<
  AnimalActivityLog,
    number
  >;
  declare setAnimalActivityLogs: BelongsToManySetAssociationsMixin<
  AnimalActivityLog,
    number
  >;
  declare removeAnimalActivityLog: BelongsToManyRemoveAssociationMixin<
  AnimalActivityLog,
    number
  >;

  declare getAnimalFeedingLogs: BelongsToManyGetAssociationsMixin<AnimalFeedingLog>;
  declare addAnimalFeedingLog: BelongsToManyAddAssociationMixin<
  AnimalFeedingLog,
    number
  >;
  declare setAnimalFeedingLogs: BelongsToManySetAssociationsMixin<
  AnimalFeedingLog,
    number
  >;
  declare removeAnimalFeedingLog: BelongsToManyRemoveAssociationMixin<
  AnimalFeedingLog,
    number
  >;

  declare getEnclosure: BelongsToGetAssociationMixin<Enclosure>;
  declare setEnclosure: BelongsToSetAssociationMixin<Enclosure, number>;

  declare getZooEvents: HasManyGetAssociationsMixin<ZooEvent>;
  declare addZooEvent: HasManyAddAssociationMixin<ZooEvent, number>;
  declare setZooEvents: HasManySetAssociationsMixin<ZooEvent, number>;
  declare removeZooEvent: HasManyRemoveAssociationMixin<ZooEvent, number>;
  // declare age?: number;

  // public getAge(): number {
  //   if (!this.age) {
  //     this.age =
  //       new Date(Date.now() - this.dateOfBirth.getTime()).getFullYear() - 1970;
  //   }
  //   return this.age;
  // }

  public async getLocation() {
    if (!this.location) {
      // let animalClinic = await this.getAnimalClinic();
      // if (animalClinic) {
      //   this.location = "inHouse";
      //   return animalClinic;
      // }
      let enclosure = await this.getEnclosure();
      if (enclosure) {
        this.location = "enclosure";
        return enclosure;
      }
    }
    const mixinMethodName = `get${uppercaseFirst(this.location ?? "")}`;
    return (this as any)[mixinMethodName]();
  }

  public toJSON() {
    return {
      ...this.get(),
      dateOfBirth: this.dateOfBirth?.getTime(),
      dateOfAcquisition: this.dateOfAcquisition?.getTime(),
      dateOfDeath: this.dateOfDeath?.getTime(),
    };
  }

  static async getNextAnimalCode() {
    try {
      const maxId: number = await this.max("animalId");
      const nextId = (maxId || 0) + 1;
      return `ANM${String(nextId).padStart(5, "0")}`;
    } catch (error) {
      console.error("Error generating animal code:", error);
      throw error; // Optionally, re-throw the error for further handling
    }
  }

  public getAnimalId() {
    return this.animalId;
  }

  public async hasLessThanTwoParents(): Promise<boolean> {
    if (this.parents === undefined) {
      return true;
    } else {
      return (await this.parents.length) < 2;
    }
  }

  // public async isParentOf(childId: number): Promise<boolean> {
  //   let result = await Animal.findByPk(childId, {
  //     include: [
  //       {
  //         model: Animal,
  //         as: "parents",
  //         where: { animalId: this.animalId },
  //       },
  //     ],
  //   });
  //   if (result) return true;
  //   return false;
  // }
}

Animal.init(
  {
    animalId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    animalCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    isGroup: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    houseName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sex: {
      type: DataTypes.ENUM,
      values: Object.values(AnimalSex),
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    placeOfBirth: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // rfidTagNum: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    identifierType: {
      type: DataTypes.ENUM,
      values: Object.values(IdentifierType),
      allowNull: true,
    },
    identifierValue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    acquisitionMethod: {
      type: DataTypes.ENUM,
      values: Object.values(AcquisitionMethod),
      allowNull: true,
    },
    dateOfAcquisition: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    acquisitionRemarks: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    physicalDefiningCharacteristics: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    behavioralDefiningCharacteristics: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateOfDeath: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    locationOfDeath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    causeOfDeath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // growthStage: {
    //   type: DataTypes.ENUM,
    //   values: Object.values(AnimalGrowthStage),
    //   allowNull: false,
    //   defaultValue: AnimalGrowthStage.UNKNOWN,
    // },
    animalStatus: {
      // type: DataTypes.ARRAY(DataTypes.ENUM(...Object.values(AnimalStatus))),
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Normal",
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.VIRTUAL,
      get() {
        // Calculate the age only if 'dateOfBirth' is present
        if (this.dateOfBirth != null) {
          // const aniamlDob = this.getDataValue("dateOfBirth");
          return (
            new Date(Date.now() - this.dateOfBirth.getTime()).getFullYear() -
            1970
          );
        }
        return null; // Return null if 'dateOfBirth' is null
      },
    },
    growthStage: {
      type: DataTypes.VIRTUAL,
      get() {
        if (this.age != null && this.species != null) {
          if (this.age < this.species.ageToJuvenile) {
            return AnimalGrowthStage.INFANT;
          } else if (this.age < this.species.ageToAdolescent) {
            return AnimalGrowthStage.JUVENILE;
          } else if (this.age < this.species.ageToAdult) {
            return AnimalGrowthStage.ADOLESCENT;
          } else if (this.age < this.species.ageToElder) {
            return AnimalGrowthStage.ADULT;
          } else {
            return AnimalGrowthStage.ELDER;
          }
        }
        return AnimalGrowthStage.UNKNOWN; // Return UNKNOWN if 'dateOfBirth' is null
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "animal", // We need to choose the model name
  },
);

// Animal.addHook("afterFind", (findResult) => {
//   if (!Array.isArray(findResult)) findResult = [findResult as any];
//   for (const instance of findResult) {
//     if (instance.dateOfBirth instanceof String) {
//       instance.setDataValue("age", instance.getAge());
//     }
//   }
// });

export { Animal };
