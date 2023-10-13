import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManySetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  CreationOptional,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
} from "Sequelize";
import { conn } from "../db";
import { Animal } from "./animal";
import { ActivityType, DayOfTheWeek, EventTimingType } from "./enumerated";
import { EnrichmentItem } from "./enrichmentItem";
import { ZooEvent } from "./zooEvent";

class AnimalActivity extends Model<
  InferAttributes<AnimalActivity>,
  InferCreationAttributes<AnimalActivity>
> {
  declare animalActivityId: CreationOptional<number>;
  declare activityType: ActivityType;
  declare title: string;
  declare details: string;
  declare startDate:Date;
  declare endDate:Date;
  declare dayOfTheWeek: DayOfTheWeek | null;
  declare eventTimingType: EventTimingType;
  declare durationInMinutes: number;

  // declare declare  FK
  declare animals?: Animal[];
  declare enrichmentItems?: EnrichmentItem[];
  declare zooEvents?: ZooEvent[];

  declare getAnimals: HasManyGetAssociationsMixin<Animal>;
  declare addAnimal: HasManyAddAssociationMixin<Animal, number>;
  declare setAnimals: HasManySetAssociationsMixin<Animal, number>;
  declare removeAnimal: HasManyRemoveAssociationMixin<Animal, number>;

  declare getEnrichmentItems: HasManyGetAssociationsMixin<EnrichmentItem>;
  declare addEnrichmentItem: HasManyAddAssociationMixin<EnrichmentItem, number>;
  declare setAEnrichmentItems: HasManySetAssociationsMixin<
    EnrichmentItem,
    number
  >;
  declare removeEnrichmentItem: HasManyRemoveAssociationMixin<
    EnrichmentItem,
    number
  >;

  declare getZooEvents: HasManyGetAssociationsMixin<ZooEvent>;
  declare addZooEvent: HasManyAddAssociationMixin<ZooEvent, number>;
  declare setZooEvents: HasManySetAssociationsMixin<ZooEvent, number>;
  declare removeZooEvent: HasManyRemoveAssociationMixin<ZooEvent, number>;
}

AnimalActivity.init(
  {
    animalActivityId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    activityType: {
      type: DataTypes.ENUM,
      values: Object.values(ActivityType),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
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
    dayOfTheWeek: {
      type: DataTypes.ENUM,
      values: Object.values(DayOfTheWeek)
    },
    eventTimingType: {
      type: DataTypes.ENUM,
      values: Object.values(EventTimingType)
    },
    durationInMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "animalActivity", // We need to choose the model name
  },
);

export { AnimalActivity };
