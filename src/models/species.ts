import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  CreationOptional,
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
  declare foodRemark: string;
  //--FK
  declare speciesDietNeed?: SpeciesDietNeed;
  declare speciesEnclosureNeed?: SpeciesEnclosureNeed;
  declare physiologicalReferenceNorms?: PhysiologicalReferenceNorms;

  declare getSpeciesDietNeed: BelongsToGetAssociationMixin<SpeciesDietNeed>;
  declare setSpeciesDietNeed: BelongsToSetAssociationMixin<
    SpeciesDietNeed,
    number
  >;

  // declare getSpeciesEnclosureNeed: BelongsToGetAssociationMixin<SpeciesEnclosureNeed>;
  // declare setSpeciesEnclosureNeed: BelongsToSetAssociationMixin<
  //   SpeciesEnclosureNeed,
  //   number
  // >;
  declare getSpeciesEnclosureNeed: HasOneGetAssociationMixin<SpeciesEnclosureNeed>;
  declare setSpeciesEnclosureNeed: HasOneSetAssociationMixin<
    SpeciesEnclosureNeed,
    number
  >;

  declare getPhysiologicalReferenceNorms: BelongsToGetAssociationMixin<PhysiologicalReferenceNorms>;
  declare setPhysiologicalReferenceNorms: BelongsToSetAssociationMixin<
    PhysiologicalReferenceNorms,
    number
  >;

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
      type: DataTypes.INTEGER,
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
