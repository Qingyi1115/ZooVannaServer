import {
  BelongsToGetAssociationMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "Sequelize";
import { conn } from "../db";
import { Animal } from "./Animal";
import { AnimalFeedingLog } from "./AnimalFeedingLog";
import { FeedingPlanSessionDetail } from "./FeedingPlanSessionDetail";
import { Species } from "./Species";

class FeedingPlan extends Model<
  InferAttributes<FeedingPlan>,
  InferCreationAttributes<FeedingPlan>
> {
  declare feedingPlanId: CreationOptional<number>;
  declare feedingPlanDesc: string;
  declare startDate: Date;
  declare endDate: Date;
  declare title:string;

  //--FK
  declare species?: Species;
  declare animals?: Animal[];
  declare feedingPlanSessionDetails?: FeedingPlanSessionDetail[];
  declare animalFeedingLog?: AnimalFeedingLog[];
  //   declare zooEvents?: ZooEvent[];

  declare getSpecies: BelongsToGetAssociationMixin<Species>;
  declare setSpecies: BelongsToSetAssociationMixin<Species, number>;

  declare getAnimals: HasManyGetAssociationsMixin<Animal>;
  declare addAnimal: HasManyAddAssociationMixin<Animal, number>;
  declare setAnimals: HasManySetAssociationsMixin<Animal, number>;
  declare removeAnimal: HasManyRemoveAssociationMixin<Animal, number>;

  declare getFeedingPlanSessionDetails: HasManyGetAssociationsMixin<FeedingPlanSessionDetail>;
  declare addFeedingPlanSessionDetail: HasManyAddAssociationMixin<
    FeedingPlanSessionDetail,
    number
  >;
  declare setFeedingPlanSessionDetails: HasManySetAssociationsMixin<
    FeedingPlanSessionDetail,
    number
  >;
  declare removeFeedingPlanSessionDetail: HasManyRemoveAssociationMixin<
    FeedingPlanSessionDetail,
    number
  >;

  declare getAnimalFeedingLogs: BelongsToManyGetAssociationsMixin<AnimalFeedingLog>;
  declare addAnimalFeedingLog: BelongsToManyAddAssociationMixin<
    AnimalFeedingLog,
    number
  >;
  declare setAnimalFeedingLogs: BelongsToManySetAssociationsMixin<
    AnimalFeedingLog,
    number
  >;
  declare removeAnimalFeedingLog: BelongsToManyRemoveAssociationMixin<
    AnimalFeedingLog,
    number
  >;

  //   declare getZooEvents: HasManyGetAssociationsMixin<ZooEvent>;
  //   declare addZooEvent: HasManyAddAssociationMixin<ZooEvent, number>;
  //   declare setZooEvents: HasManySetAssociationsMixin<ZooEvent, number>;
  //   declare removeZooEvent: HasManyRemoveAssociationMixin<ZooEvent, number>;
}

FeedingPlan.init(
  {
    feedingPlanId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    feedingPlanDesc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    title: {
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
    modelName: "feedingPlan", // We need to choose the model name
  },
);

export { FeedingPlan };

