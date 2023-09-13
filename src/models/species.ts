import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
} from "Sequelize";
import { conn } from "../db";
import {
  ConservationStatus,
  Continent,
  GroupSexualDynamic,
} from "./enumerated";
import { SpeciesDietNeed } from "./speciesDietNeed";
import { SpeciesEnclosureNeed } from "./speciesEnclosureNeed";

class Species extends Model<
  InferAttributes<Species>,
  InferCreationAttributes<Species>
> {
  declare speciesId: number;
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
  declare nativeBiome: string;
  declare educationalDescription: string;
  declare groupSexualDynamic: GroupSexualDynamic;
  declare isBigHabitatSpecies: Boolean;
  declare imageUrl: string;
  declare generalDietPreference: string;

  declare speciesDietNeed?: SpeciesDietNeed;
  declare speciesEnclosureNeed?: SpeciesEnclosureNeed;

  declare getSpeciesDietNeed: BelongsToGetAssociationMixin<SpeciesDietNeed>;
  declare setSpeciesDietNeed: BelongsToSetAssociationMixin<
    SpeciesDietNeed,
    number
  >;

  declare getSpeciesEnclosureNeed: BelongsToGetAssociationMixin<SpeciesEnclosureNeed>;
  declare setSpeciesEnclosureNeed: BelongsToSetAssociationMixin<
    SpeciesEnclosureNeed,
    number
  >;
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
    },
    commonName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    scientificName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aliasName: {
      type: DataTypes.STRING,
      allowNull: false,
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
    nativeBiome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    educationalDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    groupSexualDynamic: {
      type: DataTypes.ENUM,
      values: Object.values(GroupSexualDynamic),
      allowNull: false,
    },
    isBigHabitatSpecies: {
      type: DataTypes.BOOLEAN,
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
