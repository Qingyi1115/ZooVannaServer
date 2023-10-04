import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManySetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
} from "Sequelize";
import { conn } from "../db";
import { AnimalGrowthStage } from "./enumerated";
import { Species } from "./species";

class PhysiologicalReferenceNorms extends Model<
  InferAttributes<PhysiologicalReferenceNorms>,
  InferCreationAttributes<PhysiologicalReferenceNorms>
> {
  declare physiologicalRefId: CreationOptional<number>;
  declare sizeMaleCm: number;
  declare sizeFemaleCm: number;
  declare weightMaleKg: number;
  declare weightFemaleKg: number;
  declare minAge: number;
  declare maxAge: number;
  declare growthStage: AnimalGrowthStage;

  // declare species?: Species[];
  declare species?: Species;

  // declare getSpecies: HasManyGetAssociationsMixin<Species[]>;
  // declare addSpecies: HasManyAddAssociationMixin<Species, number>;
  // declare setSpecies: HasManySetAssociationsMixin<Species[], number>;
  // declare removeSpecies: HasManyRemoveAssociationMixin<Species, number>;

  declare getSpecies: BelongsToGetAssociationMixin<Species>;
  declare setSpecies: BelongsToSetAssociationMixin<Species, number>;
}
PhysiologicalReferenceNorms.init(
  {
    physiologicalRefId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    sizeMaleCm: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    sizeFemaleCm: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    weightMaleKg: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    weightFemaleKg: {
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
