import {
  BelongsToGetAssociationMixin,
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
import { DayOfWeek, EventTimingType } from "./Enumerated";
import { FeedingItem } from "./FeedingItem";
import { FeedingPlan } from "./FeedingPlan";
import { ZooEvent } from "./ZooEvent";

class FeedingPlanSessionDetail extends Model<
  InferAttributes<FeedingPlanSessionDetail>,
  InferCreationAttributes<FeedingPlanSessionDetail>
> {
  declare feedingPlanSessionDetailId: CreationOptional<number>;
  declare dayOfWeek: DayOfWeek;
  declare eventTimingType: EventTimingType;
  declare durationInMinutes: number;
  declare isPublic: boolean;
  declare publicEventStartTime: string | null;
  declare requiredNumberOfKeeper: number;

  //--FK
  declare feedingPlan?: FeedingPlan;
  declare feedingItems?: FeedingItem[];
  declare zooEvents?: ZooEvent[];

  declare getFeedingPlan: BelongsToGetAssociationMixin<FeedingPlan>;
  declare setFeedingPlan: BelongsToSetAssociationMixin<FeedingPlan, number>;

  declare getFeedingItems: HasManyGetAssociationsMixin<FeedingItem>;
  declare addFeedingItem: HasManyAddAssociationMixin<FeedingItem, number>;
  declare setFeedingItems: HasManySetAssociationsMixin<FeedingItem, number>;
  declare removeFeedingItem: HasManyRemoveAssociationMixin<FeedingItem, number>;

  declare getZooEvents: HasManyGetAssociationsMixin<ZooEvent>;
  declare addZooEvent: HasManyAddAssociationMixin<ZooEvent, number>;
  declare setZooEvents: HasManySetAssociationsMixin<ZooEvent, number>;
  declare removeZooEvent: HasManyRemoveAssociationMixin<ZooEvent, number>;
}

FeedingPlanSessionDetail.init(
  {
    feedingPlanSessionDetailId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    dayOfWeek: {
      type: DataTypes.ENUM,
      values: Object.values(DayOfWeek),
      allowNull: false,
    },
    eventTimingType: {
      type: DataTypes.ENUM,
      values: Object.values(EventTimingType),
      allowNull: false,
    },
    durationInMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    publicEventStartTime: {
      type: DataTypes.STRING(5),
      allowNull: true,
      validate: {
        is: /[0-2]\d:[0-5]\d/
      }
    },
    requiredNumberOfKeeper: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "feedingPlanSessionDetail", // We need to choose the model name
  },
);

export { FeedingPlanSessionDetail };

