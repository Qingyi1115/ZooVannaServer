import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManySetAssociationsMixin,
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
import { AnimalActivity } from "./AnimalActivity";
import { Enclosure } from "./Enclosure";

class EnrichmentItem extends Model<
  InferAttributes<EnrichmentItem>,
  InferCreationAttributes<EnrichmentItem>
> {
  declare enrichmentItemId: CreationOptional<number>;
  declare enrichmentItemName: string;
  declare enrichmentItemImageUrl: string;

  //-- FK
  declare animalActivities?: AnimalActivity[];
  declare enclosures?: Enclosure[];

  declare getAnimalActivities: HasManyGetAssociationsMixin<AnimalActivity>;
  declare addAnimalActivity: HasManyAddAssociationMixin<AnimalActivity, number>;
  declare setAnimalActivities: HasManySetAssociationsMixin<
    AnimalActivity,
    number
  >;
  declare removeAnimalActivity: HasManyRemoveAssociationMixin<
    AnimalActivity,
    number
  >;

  declare getEnclosures: BelongsToManyGetAssociationsMixin<Enclosure>;
  declare addEnclosure: BelongsToManyAddAssociationMixin<Enclosure, number>;
  declare setEnclosures: BelongsToManySetAssociationsMixin<Enclosure, number>;
  declare removeEnclosure: BelongsToManyRemoveAssociationMixin<Enclosure, number>;

  public toJSON() {
    return {
      ...this.get(),
    };
  }
}

EnrichmentItem.init(
  {
    enrichmentItemId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    enrichmentItemName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    enrichmentItemImageUrl: {
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
    modelName: "enrichmentItem", // We need to choose the model name
  },
);

export { EnrichmentItem };
