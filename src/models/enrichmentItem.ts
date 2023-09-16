import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from "Sequelize";
import { conn } from "../db";

class EnrichmentItem extends Model<
  InferAttributes<EnrichmentItem>,
  InferCreationAttributes<EnrichmentItem>
> {
  declare enrichmentItemId: number;
  declare enrichmentItemName: string;
  declare enrichmentItemImageUrl: string;
  
  // public toJSON() {
  //     // Can control default values returned rather than manually populating json, removing secrets
  //     // Similar idea albert more useful when compared to java's toString
  //     return {...this.get(), EmployeeEmployeeId: undefined}
  // }
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
    },
    enrichmentItemImageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    }
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
