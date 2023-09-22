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
import { AnimalSex, AcquisitionMethod, AnimalGrowthStage } from "./enumerated";
import { Species } from "./species";
import { AnimalClinic } from "./animalClinics";
import { uppercaseFirst } from "../helpers/others";
import { Enclosure } from "./enclosure";
import { AnimalLog } from "./animalLog";

class Animal extends Model<
  InferAttributes<Animal>,
  InferCreationAttributes<Animal>
> {
  declare animalId: CreationOptional<number>;
  declare animalCode: string;
  declare houseName: string;
  declare sex: AnimalSex;
  declare dateOfBirth: Date;
  declare placeOfBirth: string;
  declare rfidTagNum: string;
  declare acquisitionMethod: AcquisitionMethod;
  declare dateOfAcquisition: Date;
  declare acquisitionRemarks: string;
  declare weight: number;
  declare physicalDefiningCharacteristics: string;
  declare behavioralDefiningCharacteristics: string;
  declare dateOfDeath: Date;
  declare locationOfDeath: string;
  declare causeOfDeath: string;
  declare growthStage: AnimalGrowthStage;
  declare animalStatus: string;

  declare location?: string;

  declare species?: Species;
  declare parents?: Animal[];
  declare children?: Animal[];
  declare animalClinic?: AnimalClinic;
  declare enclosure?: Enclosure;
  declare animalLog?: AnimalLog;
  declare events?: Event[];

  declare getSpecies: BelongsToGetAssociationMixin<Species>;
  declare setSpecies: BelongsToSetAssociationMixin<Species, number>;

  declare getParents: HasManyGetAssociationsMixin<Animal>;
  declare addParent: HasManyAddAssociationMixin<Animal, number>;
  declare setParents: HasManySetAssociationsMixin<Animal, number>;
  declare removeParent: HasManyRemoveAssociationMixin<Animal,number>;

  declare getChildren: HasManyGetAssociationsMixin<Animal>;
  declare addChildren: HasManyAddAssociationMixin<Animal, number>;
  declare setChildren: HasManySetAssociationsMixin<Animal, number>;
  declare removeChildren: HasManyRemoveAssociationMixin<Animal, number>;

  declare getAnimalClinic: BelongsToGetAssociationMixin<AnimalClinic>;
  declare setAnimalClinic: BelongsToSetAssociationMixin<AnimalClinic, number>;

  declare getEnclosure: BelongsToGetAssociationMixin<Enclosure>;
  declare setEnclosure: BelongsToSetAssociationMixin<Enclosure, number>;

  declare getAnimalLogs: HasManyGetAssociationsMixin<AnimalLog>;
  declare addAnimalLog: HasManyAddAssociationMixin<AnimalLog, number>;
  declare setAnimalLogs: HasManySetAssociationsMixin<AnimalLog, number>;
  declare removeAnimalLog: HasManyRemoveAssociationMixin<AnimalLog, number>;

  declare getEvents: HasManyGetAssociationsMixin<Event>;
  declare addEvent: HasManyAddAssociationMixin<Event, number>;
  declare setEvents: HasManySetAssociationsMixin<Event, number>;
  declare removeEvent: HasManyRemoveAssociationMixin<Event, number>;
  declare age?: number;

  public getAge(): number {
    if (!this.age){
      this.age = new Date(Date.now() - this.dateOfBirth.getTime()).getFullYear() - 1970;
    }
    return this.age
  }

  public async getLocation() {
    if (!this.location) {
      let animalClinic = await this.getAnimalClinic();
      if (animalClinic) {
        this.location = "inHouse";
        return animalClinic;
      }
      let enclosure = await this.getEnclosure();
      if (enclosure) {
        this.location = "enclosure";
        return enclosure;
      }
    }
    const mixinMethodName = `get${uppercaseFirst(this.location ?? "")}`;
    return (this as any)[mixinMethodName]();
  }

  // public toJSON() {
  //     // Can control default values returned rather than manually populating json, removing secrets
  //     // Similar idea albert more useful when compared to java's toString
  //     return {...this.get(), age: this.getAge()}
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
    },
    houseName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sex: {
      type: DataTypes.ENUM,
      values: Object.values(AnimalSex),
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    placeOfBirth: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rfidTagNum: {
      type: DataTypes.STRING,
      allowNull: false,
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
      allowNull: false,
    },
    weight: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    physicalDefiningCharacteristics: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    behavioralDefiningCharacteristics: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfDeath: {
      type: DataTypes.DATE,
    },
    locationOfDeath: {
      type: DataTypes.STRING,
    },
    causeOfDeath: {
      type: DataTypes.STRING,
    },
    growthStage: {
      type: DataTypes.ENUM,
      values: Object.values(AnimalGrowthStage),
      allowNull: false,
    },
    animalStatus: {
      type: DataTypes.STRING,
      defaultValue: "",
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

Animal.addHook("afterFind", (findResult) => {
  if (!Array.isArray(findResult)) findResult = [findResult as any];
  for (const instance of findResult) {
    if (instance.dateOfBirth instanceof String) {
      instance.setDataValue("age", instance.getAge());
    }
  }
});

export { Animal };
