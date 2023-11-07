import {
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from "Sequelize";
import { conn } from "../db";
import { Species } from "./Species";

class SpeciesEnclosureNeed extends Model<
  InferAttributes<SpeciesEnclosureNeed>,
  InferCreationAttributes<SpeciesEnclosureNeed>
> {
  declare speciesEnclosureNeedId: CreationOptional<number>;
  declare smallExhibitHeightRequired: number; // nullable
  declare minLandAreaRequired: number;
  declare minWaterAreaRequired: number;
  declare acceptableTempMin: number;
  declare acceptableTempMax: number;
  declare acceptableHumidityMin: number;
  declare acceptableHumidityMax: number;
  declare recommendedStandOffBarrierDistMetres: number;
  declare plantationCoveragePercentMin: number;
  declare plantationCoveragePercentMax: number;
  declare longGrassPercentMin: number;
  declare longGrassPercentMax: number;
  declare shortGrassPercentMin: number;
  declare shortGrassPercentMax: number;
  declare rockPercentMin: number;
  declare rockPercentMax: number;
  declare sandPercentMin: number;
  declare sandPercentMax: number;
  declare snowPercentMin: number;
  declare snowPercentMax: number;
  declare soilPercentMin: number;
  declare soilPercentMax: number;

  declare species?: Species;

  // declare getSpecies: HasManyGetAssociationsMixin<Species>;
  // declare setSpecies: HasManySetAssociationsMixin<Species, number>;
  declare getSpecies: BelongsToGetAssociationMixin<Species>;
  declare setSpecies: BelongsToSetAssociationMixin<Species, number>;
  
  public toJSON() {
    return {
      ...this.get(),
    }
  }
}

SpeciesEnclosureNeed.init(
  {
    speciesEnclosureNeedId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    smallExhibitHeightRequired: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    minLandAreaRequired: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    minWaterAreaRequired: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    acceptableTempMin: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    acceptableTempMax: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    acceptableHumidityMin: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    acceptableHumidityMax: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    recommendedStandOffBarrierDistMetres: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    plantationCoveragePercentMin: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    plantationCoveragePercentMax: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    longGrassPercentMin: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    longGrassPercentMax: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shortGrassPercentMin: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shortGrassPercentMax: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rockPercentMin: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rockPercentMax: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sandPercentMin: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sandPercentMax: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    snowPercentMin: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    snowPercentMax: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    soilPercentMin: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    soilPercentMax: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "speciesEnclosureNeed", // We need to choose the model name
  },
);

export { SpeciesEnclosureNeed };

