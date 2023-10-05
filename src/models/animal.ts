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
} from "Sequelize";
import { conn } from "../db";
import {
  AnimalSex,
  AcquisitionMethod,
  AnimalGrowthStage,
  AnimalStatus,
  IdentifierType,
} from "./enumerated";
import { Species } from "./species";
import { AnimalClinic } from "./animalClinics";
import { uppercaseFirst } from "../helpers/others";
import { Enclosure } from "./enclosure";
import { AnimalLog } from "./animalLog";
import { AnimalWeight } from "./animalWeight";
import { ZooEvent } from "./zooEvent";

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
  declare growthStage: AnimalGrowthStage;
  declare animalStatus: string;
  declare imageUrl: string;

  declare location?: string;

  //--FK
  declare species?: Species;
  declare parents?: Animal[];
  declare children?: Animal[];
  declare animalWeights?: AnimalWeight[];

  //--hvnt do yet
  // declare animalClinic?: AnimalClinic;
  declare animalLog?: AnimalLog;
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

  // declare getAnimalClinic: BelongsToGetAssociationMixin<AnimalClinic>;
  // declare setAnimalClinic: BelongsToSetAssociationMixin<AnimalClinic, number>;

  declare getEnclosure: BelongsToGetAssociationMixin<Enclosure>;
  declare setEnclosure: BelongsToSetAssociationMixin<Enclosure, number>;

  declare getAnimalLogs: HasManyGetAssociationsMixin<AnimalLog>;
  declare addAnimalLog: HasManyAddAssociationMixin<AnimalLog, number>;
  declare setAnimalLogs: HasManySetAssociationsMixin<AnimalLog, number>;
  declare removeAnimalLog: HasManyRemoveAssociationMixin<AnimalLog, number>;

  declare getZooEvents: HasManyGetAssociationsMixin<ZooEvent>;
  declare addZooEvent: HasManyAddAssociationMixin<ZooEvent, number>;
  declare setZooEvents: HasManySetAssociationsMixin<ZooEvent, number>;
  declare removeZooEvent: HasManyRemoveAssociationMixin<ZooEvent, number>;
  // declare age?: number;

  declare age?: number | null;

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
      dateOfBirth:this.dateOfBirth?.getTime(),
      dateOfAcquisition:this.dateOfAcquisition?.getTime(),
      dateOfDeath:this.dateOfDeath?.getTime(),
    }
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
      allowNull: false,
    },
    dateOfAcquisition: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    acquisitionRemarks: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // currentWeight: {
    //   type: DataTypes.DOUBLE,
    //   allowNull: true,
    // },
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
    growthStage: {
      type: DataTypes.ENUM,
      values: Object.values(AnimalGrowthStage),
      allowNull: false,
      defaultValue: AnimalGrowthStage.UNKNOWN,
    },
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
