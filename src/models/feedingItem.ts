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
import { AnimalFeedCategory, FoodUnit } from "./enumerated";
import { FeedingPlan } from "./feedingPlan";
import { Animal } from "./animal";

class FeedingItem extends Model<
  InferAttributes<FeedingItem>,
  InferCreationAttributes<FeedingItem>
> {
  declare feedingItemId: CreationOptional<number>;
  declare foodCategory: string;
  declare amount: number;
  declare unit: string;

  //--FK
  declare animal?: Animal;
  declare feedingPlans?: FeedingPlan;

  declare getAnimal: BelongsToGetAssociationMixin<Animal>;
  declare setAnimal: BelongsToSetAssociationMixin<Animal, number>;

  declare getFeedingPlans: HasManyGetAssociationsMixin<FeedingPlan>;
  declare addFeedingPlan: HasManyAddAssociationMixin<FeedingPlan, number>;
  declare setFeedingPlans: HasManySetAssociationsMixin<FeedingPlan, number>;
  declare removeFeedingPlan: HasManyRemoveAssociationMixin<FeedingPlan, number>;
}

FeedingItem.init(
  {
    feedingItemId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    foodCategory: {
      type: DataTypes.ENUM,
      values: Object.values(AnimalFeedCategory),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    unit: {
      type: DataTypes.ENUM,
      values: Object.values(FoodUnit),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "feedingItem", // We need to choose the model name
  },
);

export { FeedingItem };