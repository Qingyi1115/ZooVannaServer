import {
    DataTypes,
    Model,
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "Sequelize";
import { conn } from "../db";

class EnrichmentItem extends Model<
  InferAttributes<EnrichmentItem>,
  InferCreationAttributes<EnrichmentItem>
> {
  declare enrichmentItemId: CreationOptional<number>;
  declare endirhmentItemName: string;
  declare enrichmentItemImageUrl: string;
}

EnrichmentItem.init(
  {
      enrichmentItemId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    endirhmentItemName: {
      type: DataTypes.STRING,
      allowNull: false,
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

