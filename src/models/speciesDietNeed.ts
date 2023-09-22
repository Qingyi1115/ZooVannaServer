import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
} from "Sequelize";
import { conn } from "../db";
import {
  PresentationContainer,
  PresentationMethod,
  PresentationLocation,
  AnimalGrowthStage,
  AnimalFeedCategory,
} from "./enumerated";
import { Species } from "./species";

class SpeciesDietNeed extends Model<
  InferAttributes<SpeciesDietNeed>,
  InferCreationAttributes<SpeciesDietNeed>
> {
  declare speciesDietNeedId: CreationOptional<number>;
  declare animalFeedCategory: AnimalFeedCategory;
  declare amountPerMealGram: number;
  declare amountPerWeekGram: number;
  declare presentationContainer: PresentationContainer;
  declare presentationMethod: PresentationMethod;
  declare presentationLocation: PresentationLocation;
  declare growthStage: AnimalGrowthStage;

  declare species?: Species;

  // declare getSpecies: HasManyGetAssociationsMixin<Species>;
  // declare setSpecies: HasManySetAssociationsMixin<Species, number>;
  declare getSpecies: BelongsToGetAssociationMixin<Species>;
  declare setSpecies: BelongsToSetAssociationMixin<Species, number>;
}

SpeciesDietNeed.init(
  {
    speciesDietNeedId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    animalFeedCategory: {
      type: DataTypes.ENUM,
      values: Object.values(AnimalFeedCategory),
      allowNull: false,
    },
    amountPerMealGram: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    amountPerWeekGram: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    presentationContainer: {
      type: DataTypes.ENUM,
      values: Object.values(PresentationContainer),
      allowNull: false,
    },
    presentationMethod: {
      type: DataTypes.ENUM,
      values: Object.values(PresentationMethod),
      allowNull: false,
    },
    presentationLocation: {
      type: DataTypes.ENUM,
      values: Object.values(PresentationLocation),
      allowNull: false,
    },
    growthStage: {
      type: DataTypes.ENUM,
      values: Object.values(AnimalGrowthStage),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "speciesDietNeed", // We need to choose the model name
  },
);

export { SpeciesDietNeed };
