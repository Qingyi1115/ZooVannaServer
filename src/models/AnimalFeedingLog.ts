import {
  BelongsToGetAssociationMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "Sequelize";
import { conn } from "../db";
import { Animal } from "./Animal";
import { FeedingPlan } from "./FeedingPlan";
import { Keeper } from "./Keeper";

class AnimalFeedingLog extends Model<
  InferAttributes<AnimalFeedingLog>,
  InferCreationAttributes<AnimalFeedingLog>
> {
  declare animalFeedingLogId: CreationOptional<number>;
  declare dateTime: Date;
  declare durationInMinutes: number;
  declare amountOffered: string;
  declare amountConsumed: string;
  declare amountLeftovers: string;
  declare presentationMethod: string;
  declare extraRemarks: string;

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
    amountOffered: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amountConsumed: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amountLeftovers: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    presentationMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    extraRemarks: {
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

