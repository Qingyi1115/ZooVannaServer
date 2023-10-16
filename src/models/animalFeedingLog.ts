import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  BelongsToSetAssociationMixin,
  BelongsToGetAssociationMixin,
  CreationOptional,
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
} from "Sequelize";
import { conn } from "../db";
import { Animal } from "./animal";
import { ActivityType, Rating, Reaction } from "./enumerated";
import { Keeper } from "./keeper";
import { FeedingPlan } from "./feedingPlan";

class AnimalFeedingLog extends Model<
  InferAttributes<AnimalFeedingLog>,
  InferCreationAttributes<AnimalFeedingLog>
> {
  declare animalFeedingLogId: CreationOptional<number>;
  declare dateTime: Date;
  declare durationInMinutes: number;
  declare details: string;

  declare animals?: Animal[];
  declare keeper?: Keeper;
  declare feedingPlan?: FeedingPlan;

  declare getAnimals: BelongsToManyGetAssociationsMixin<Animal>;
  declare addAnimal: BelongsToManyAddAssociationMixin<Animal, number>;
  declare setAnimals: BelongsToManySetAssociationsMixin<Animal, number>;
  declare removeAnimal: BelongsToManyRemoveAssociationMixin<Animal, number>;

  declare getKeeper: BelongsToGetAssociationMixin<Keeper>;
  declare setKeeper: BelongsToSetAssociationMixin<Keeper, number>;

  declare getFeedingPlan: BelongsToGetAssociationMixin<FeedingPlan>;
  declare setFeedingPlan: BelongsToSetAssociationMixin<FeedingPlan, number>;
}

AnimalFeedingLog.init(
  {
    animalFeedingLogId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    dateTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    durationInMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    details: {
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
    modelName: "animalFeedingLog", // We need to choose the model name
  },
);

export { AnimalFeedingLog };
