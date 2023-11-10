import {
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "Sequelize";
import { conn } from "../db";
import {
  AnimalFeedCategory,
  AnimalGrowthStage,
  PresentationContainer,
  PresentationLocation,
  PresentationMethod,
} from "./Enumerated";
import { Species } from "./Species";

class SpeciesDietNeed extends Model<
  InferAttributes<SpeciesDietNeed>,
  InferCreationAttributes<SpeciesDietNeed>
> {
  declare speciesDietNeedId: CreationOptional<number>;
  declare animalFeedCategory: AnimalFeedCategory;
  declare amountPerMealGramMale: number;
  declare amountPerMealGramFemale: number;
  declare amountPerWeekGramMale: number;
  declare amountPerWeekGramFemale: number;
  declare presentationContainer: PresentationContainer;
  declare presentationMethod: PresentationMethod;
  declare presentationLocation: PresentationLocation;
  declare growthStage: AnimalGrowthStage;

  declare species?: Species;

  // declare getSpecies: HasManyGetAssociationsMixin<Species>;
  // declare setSpecies: HasManySetAssociationsMixin<Species, number>;
  declare getSpecies: BelongsToGetAssociationMixin<Species>;
  declare setSpecies: BelongsToSetAssociationMixin<Species, number>;

  public toJSON() {
    return {
      ...this.get(),
    };
  }
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
    amountPerMealGramMale: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    amountPerMealGramFemale: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    amountPerWeekGramMale: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    amountPerWeekGramFemale: {
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

