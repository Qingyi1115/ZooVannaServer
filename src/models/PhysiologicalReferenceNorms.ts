import {
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "Sequelize";
import { conn } from "../db";
import { AnimalGrowthStage } from "./Enumerated";
import { Species } from "./Species";

class PhysiologicalReferenceNorms extends Model<
  InferAttributes<PhysiologicalReferenceNorms>,
  InferCreationAttributes<PhysiologicalReferenceNorms>
> {
  declare physiologicalRefId: CreationOptional<number>;
  declare minSizeMaleCm: number;
  declare maxSizeMaleCm: number;
  declare minSizeFemaleCm: number;
  declare maxSizeFemaleCm: number;
  declare minWeightMaleKg: number;
  declare maxWeightMaleKg: number;
  declare minWeightFemaleKg: number;
  declare maxWeightFemaleKg: number;
  declare minAge: number;
  declare maxAge: number;
  declare growthStage: AnimalGrowthStage;

  declare species?: Species;

  declare getSpecies: BelongsToGetAssociationMixin<Species>;
  declare setSpecies: BelongsToSetAssociationMixin<Species, number>;

  public toJSON() {
    return {
      ...this.get(),
    };
  }
}
PhysiologicalReferenceNorms.init(
  {
    physiologicalRefId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    minSizeMaleCm: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    maxSizeMaleCm: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    minSizeFemaleCm: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    maxSizeFemaleCm: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    minWeightMaleKg: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    maxWeightMaleKg: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    minWeightFemaleKg: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    maxWeightFemaleKg: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    minAge: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxAge: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    growthStage: {
      type: DataTypes.ENUM,
      values: Object.values(AnimalGrowthStage),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "physiologicalReferenceNorms", // We need to choose the model name
  },
);

export { PhysiologicalReferenceNorms };

