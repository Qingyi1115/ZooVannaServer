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
import { DayOfWeek, EventTimingType } from "./enumerated";
import { ZooEvent } from "./zooEvent";
import { FeedingPlan } from "./feedingPlan";
import { FeedingItem } from "./feedingItem";

class FeedingPlanSessionDetail extends Model<
  InferAttributes<FeedingPlanSessionDetail>,
  InferCreationAttributes<FeedingPlanSessionDetail>
> {
  declare feedingPlanDetailId: CreationOptional<number>;
  declare dayOftheWeek: string;
  declare eventTimingType: string;

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
    feedingPlanDetailId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    dayOftheWeek: {
      type: DataTypes.ENUM,
      values: Object.values(DayOfWeek),
      allowNull: false,
    },
    eventTimingType: {
      type: DataTypes.ENUM,
      values: Object.values(EventTimingType),
      allowNull: false,
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
