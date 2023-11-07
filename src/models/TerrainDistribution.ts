import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from "Sequelize";
import { conn } from "../db";

class TerrainDistribution extends Model<
  InferAttributes<TerrainDistribution>,
  InferCreationAttributes<TerrainDistribution>
> {
  declare terrainDistributionId: CreationOptional<number>;
  declare longGrassPercent: number;
  declare shortGrassPercent: number;
  declare rockPercent: number;
  declare sandPercent: number;
  declare snowPercent: number;
  declare soilPercent: number;

  // declare enclosure?: Enclosure;

  // declare getEnclosure: HasManyGetAssociationsMixin<Enclosure>;
  // declare setEnclosure: HasManySetAssociationsMixin<Enclosure, number>;

  public toJSON() {
    return {
      ...this.get(),
    };
  }
}

TerrainDistribution.init(
  {
    terrainDistributionId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    longGrassPercent: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shortGrassPercent: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rockPercent: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sandPercent: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    snowPercent: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    soilPercent: {
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
    modelName: "terrainDistribution", // We need to choose the model name
  },
);

export { TerrainDistribution };

