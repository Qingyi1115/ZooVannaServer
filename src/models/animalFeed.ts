import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "Sequelize";
import { conn } from "../db";
import { AnimalFeedCategory } from "./enumerated";

class AnimalFeed extends Model<
  InferAttributes<AnimalFeed>,
  InferCreationAttributes<AnimalFeed>
> {
  declare animalFeedId: CreationOptional<number>;
  declare animalFeedName: string;
  declare animalFeedImageUrl: string;
  declare animalFeedCategory: AnimalFeedCategory;
}

AnimalFeed.init({
  animalFeedId: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  animalFeedName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  animalFeedImageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  animalFeedCategory: {
    type: DataTypes.ENUM,
    values: Object.values(AnimalFeedCategory),
    allowNull: false
  },
},
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "animalFeed", // We need to choose the model name
  },
);

export { AnimalFeed };

