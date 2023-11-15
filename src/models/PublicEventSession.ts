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
import { DayOfWeek, RecurringPattern } from "./Enumerated";
import { PublicEvent } from "./PublicEvent";
import { ZooEvent } from "./ZooEvent";

class PublicEventSession extends Model<
  InferAttributes<PublicEventSession>,
  InferCreationAttributes<PublicEventSession>
> {
  declare publicEventSessionId: CreationOptional<number>;
  declare recurringPattern: RecurringPattern;
  declare dayOfWeek: DayOfWeek | null; //nullable
  declare dayOfMonth: number | null; //nullable
  declare durationInMinutes: number;
  declare time: string;
  declare daysInAdvanceNotification: number;

  declare publicEvent?: PublicEvent;
  declare zooEvents?: ZooEvent[];

  declare getPublicEvent: BelongsToGetAssociationMixin<PublicEvent>;
  declare setPublicEvent: BelongsToSetAssociationMixin<PublicEvent, number>;

  declare getZooEvents: HasManyGetAssociationsMixin<ZooEvent>;
  declare addZooEvent: HasManyAddAssociationMixin<ZooEvent, number>;
  declare setZooEvents: HasManySetAssociationsMixin<ZooEvent, number>;
  declare removeZooEvent: HasManyRemoveAssociationMixin<ZooEvent, number>;

  // declare getItineraryItems: HasManyGetAssociationsMixin<ItineraryItem>;
  // declare addItineraryItem: HasManyAddAssociationMixin<ItineraryItem, number>;
  // declare setItineraryItems: HasManySetAssociationsMixin<ItineraryItem, number>;
  // declare removeItineraryItem: HasManyRemoveAssociationMixin<ItineraryItem, number>;

  public toJSON() {
    return {
      ...this.get(),
    };
  }

  public async toFullJSON() {
    return {
      ...this.toJSON(),
    };
  }
}

PublicEventSession.init(
  {
    publicEventSessionId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    recurringPattern: {
      type: DataTypes.ENUM,
      values: Object.values(RecurringPattern),
      allowNull: false,
    },
    dayOfWeek: {
      type: DataTypes.ENUM,
      values: Object.values(DayOfWeek),
      allowNull: true,
    },
    dayOfMonth: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    durationInMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING(5),
      allowNull: false,
      validate: {
        is: /[0-2]\d:[0-5]\d/,
      },
    },
    daysInAdvanceNotification: {
      type: DataTypes.DOUBLE(10, 6),
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "publicEventSession", // We need to choose the model name
  },
);

export { PublicEventSession };
