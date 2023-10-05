import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  BelongsToSetAssociationMixin,
  BelongsToGetAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManySetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  CreationOptional,
} from "Sequelize";
import { conn } from "../db";
import { Animal } from "./animal";
import { ActivityType, EventTimingType } from "./enumerated";
import { EnrichmentItem } from "./enrichmentItem";
import { Employee } from "./employee";

class AnimalActivity extends Model<
  InferAttributes<AnimalActivity>,
  InferCreationAttributes<AnimalActivity>
> {
  declare animalActivityId: CreationOptional<number>;
  declare activityType: ActivityType;
  declare title: string;
  declare details: string;
  declare date: Date;
  declare session: EventTimingType;
  declare durationInMinutes: number;

  // -- FK
  declare animals?: Animal[];
  declare enrichmentItems?: EnrichmentItem[];
  declare employee?: Employee;

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

  declare getEmployee: HasOneGetAssociationMixin<Employee>;
  declare setEmployee: HasOneSetAssociationMixin<Employee, number>;
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
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    session: {
      type: DataTypes.ENUM,
      values: Object.values(EventTimingType),
      allowNull: false,
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
