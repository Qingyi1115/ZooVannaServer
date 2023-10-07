import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManySetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  CreationOptional,
  Op,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
} from "Sequelize";
import { conn } from "../db";
import {
  AnimalGrowthStage,
  ConservationStatus,
  Continent,
  GroupSexualDynamic,
} from "./enumerated";
import { SpeciesDietNeed } from "./speciesDietNeed";
import { SpeciesEnclosureNeed } from "./speciesEnclosureNeed";
import { PhysiologicalReferenceNorms } from "./physiologicalReferenceNorms";
import { Compatibility } from "./compatibility";
import { Customer } from "./customer";
import { Animal } from "./animal";

class Species extends Model<
  InferAttributes<Species>,
  InferCreationAttributes<Species>
> {
  declare speciesId: CreationOptional<number>;
  declare speciesCode: string;
  declare commonName: string;
  declare scientificName: string;
  declare aliasName: string;
  declare conservationStatus: ConservationStatus;
  declare domain: string;
  declare kingdom: string;
  declare phylum: string;
  declare speciesClass: string;
  declare order: string;
  declare family: string;
  declare genus: string;
  declare nativeContinent: Continent;
  declare nativeBiomes: string;
  declare educationalDescription: string;
  declare educationalFunFact: string;
  declare groupSexualDynamic: GroupSexualDynamic;
  declare habitatOrExhibit: string;
  declare imageUrl: string;
  declare generalDietPreference: string;
  declare lifeExpectancyYears: number;
  declare ageToJuvenile: number;
  declare ageToAdolescent: number;
  declare ageToAdult: number;
  declare ageToElder: number;
  declare foodRemark: string;
  //--FK
  declare speciesEnclosureNeed?: SpeciesEnclosureNeed;
  declare physiologicalReferenceNorms?: PhysiologicalReferenceNorms[];
  declare speciesDietNeeds?: SpeciesDietNeed[];
  declare compatibilities?: Compatibility[];
  declare customers?: Customer[];
  declare animals?: Animal[];

  declare getSpeciesEnclosureNeed: HasOneGetAssociationMixin<SpeciesEnclosureNeed>;
  declare setSpeciesEnclosureNeed: HasOneSetAssociationMixin<
    SpeciesEnclosureNeed,
    number
  >;

  declare getPhysiologicalRefNorm: HasManyGetAssociationsMixin<PhysiologicalReferenceNorms>;
  declare addPhysiologicalRefNorm: HasManyAddAssociationMixin<
    PhysiologicalReferenceNorms,
    number
  >;
  declare setPhysiologicalRefNorm: HasManySetAssociationsMixin<
    PhysiologicalReferenceNorms,
    number
  >;
  declare removePhysiologicalRefNorm: HasManyRemoveAssociationMixin<
    PhysiologicalReferenceNorms,
    number
  >;

  declare getSpeciesDietNeed: HasManyGetAssociationsMixin<SpeciesDietNeed>;
  declare addSpeciesDietNeed: HasManyAddAssociationMixin<
    SpeciesDietNeed,
    number
  >;
  declare setSpeciesDietNeed: HasManySetAssociationsMixin<
    SpeciesDietNeed,
    number
  >;
  declare removeSpeciesDietNeed: HasManyRemoveAssociationMixin<
    SpeciesDietNeed,
    number
  >;

  declare getCompatibilities: HasManyGetAssociationsMixin<Compatibility>;
  declare addCompatibilities: HasManyAddAssociationMixin<Compatibility, number>;
  declare setCompatibilities: HasManySetAssociationsMixin<
    Compatibility,
    number
  >;
  declare removeCompatibilities: HasManyRemoveAssociationMixin<
    Compatibility,
    number
  >;

  declare getAnimals: HasManyGetAssociationsMixin<Animal>;
  declare addAnimals: HasManyAddAssociationMixin<Animal, number>;
  declare setAnimals: HasManySetAssociationsMixin<Animal, number>;
  declare removeAnimals: HasManyRemoveAssociationMixin<Animal, number>;

  declare getCustomers: BelongsToManyGetAssociationsMixin<Customer>;
  declare addCustomer: BelongsToManyAddAssociationMixin<Customer, number>;
  declare setCustomers: BelongsToManySetAssociationsMixin<Customer, number>;
  declare removeCustomer: BelongsToManyRemoveAssociationMixin<Customer, number>;

  static async getNextSpeciesCode() {
    try {
      const maxId: number = await this.max("speciesId");
      const nextId = (maxId || 0) + 1;
      return `SPE${String(nextId).padStart(3, "0")}`;
    } catch (error) {
      console.error("Error generating species code:", error);
      throw error; // Optionally, re-throw the error for further handling
    }
  }

  public getSpeciesId() {
    return this.speciesId;
  }

  // Custom method to check compatibility
  public async isCompatible(otherSpecies: Species): Promise<boolean> {
    const isCompatible = await Compatibility.findOne({
      where: {
        [Op.or]: [
          {
            speciesId1: this.speciesId,
            speciesId2: otherSpecies.speciesId,
          },
          {
            speciesId1: otherSpecies.speciesId,
            speciesId2: this.speciesId,
          },
        ],
      },
    });

    return !!isCompatible;
  }

  public toJSON() {
    return {
      ...this.get(),
    };
  }
}

Species.init(
  {
    speciesId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    speciesCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    commonName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    scientificName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aliasName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    conservationStatus: {
      type: DataTypes.ENUM,
      values: Object.values(ConservationStatus),
      allowNull: false,
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kingdom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phylum: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    speciesClass: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    family: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nativeContinent: {
      type: DataTypes.ENUM,
      values: Object.values(Continent),
      allowNull: false,
    },
    nativeBiomes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    educationalDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    educationalFunFact: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    groupSexualDynamic: {
      type: DataTypes.ENUM,
      values: Object.values(GroupSexualDynamic),
      allowNull: false,
    },
    habitatOrExhibit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    generalDietPreference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lifeExpectancyYears: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    ageToJuvenile: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    ageToAdolescent: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    ageToAdult: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    ageToElder: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    foodRemark: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "species", // We need to choose the model name
  },
);

export { Species };
