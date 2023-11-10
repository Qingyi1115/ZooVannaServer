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
import { Species } from "./Species";

class Compatibility extends Model<
  InferAttributes<Compatibility>,
  InferCreationAttributes<Compatibility>
> {
  declare compatibilityId: CreationOptional<number>;
  declare speciesId1: number;
  declare speciesId2: number;

  declare specie1?: Species;
  declare specie2?: Species;

  declare getSpecies1: BelongsToGetAssociationMixin<Species>;
  declare setSpecies1: BelongsToSetAssociationMixin<Species, number>;

  declare getSpecies2: BelongsToGetAssociationMixin<Species>;
  declare setSpecies2: BelongsToSetAssociationMixin<Species, number>;
  
  public toJSON() {
    return {
      ...this.get()
    }
  }
}

// interface CompatibilityAttributes {
//   compatibility_id: number;
//   speciesId1: number;
//   speciesId2: number;
// }

// interface CompatibilityCreationAttributes
//   extends Optional<CompatibilityAttributes, "compatibility_id"> {}

// export class Compatibility
//   extends Model<CompatibilityAttributes, CompatibilityCreationAttributes>
//   implements CompatibilityAttributes
// {
//   public compatibility_id!: number;
//   public speciesId1!: number;
//   public speciesId2!: number;

//   // Timestamps (createdAt and updatedAt) are automatically added by Sequelize

//   // Define foreign key associations
//   public readonly species1?: Species;
//   public readonly species2?: Species;
// }

Compatibility.init(
  {
    compatibilityId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    speciesId1: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "Species",
        key: "speciesId",
      },
    },
    speciesId2: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "Species",
        key: "speciesId",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "compatibility",
    indexes: [
      {
        unique: true,
        fields: ["speciesId1", "speciesId2"],
      },
    ],
  },
);

export { Compatibility };

