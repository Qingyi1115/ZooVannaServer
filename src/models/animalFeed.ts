import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from "Sequelize";
import { conn } from "../db";
import { AnimalFeedCategory } from "./enumerated";

class AnimalFeed extends Model<
  InferAttributes<AnimalFeed>,
  InferCreationAttributes<AnimalFeed>
> {
  declare animalFeedId: number;
  declare animalFeedName: string;
  declare animalFeedImageUrl: string;
  declare animalFeedCategory: AnimalFeedCategory;
  
  // public toJSON() {
  //     // Can control default values returned rather than manually populating json, removing secrets
  //     // Similar idea albert more useful when compared to java's toString
  //     return {...this.get(), EmployeeEmployeeId: undefined}
  // }
}

AnimalFeed.init(
  {
    animalFeedId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    animalFeedName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    animalFeedImageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    animalFeedCategory: {
      type: DataTypes.ENUM,
      values: Object.values(AnimalFeedCategory),
      allowNull: false,
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
