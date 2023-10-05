import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  BelongsToSetAssociationMixin,
  BelongsToGetAssociationMixin,
  CreationOptional,
} from "Sequelize";
import { conn } from "../db";
import { Animal } from "./animal";

class AnimalWeight extends Model<
  InferAttributes<AnimalWeight>,
  InferCreationAttributes<AnimalWeight>
> {
  declare animalWeightId: CreationOptional<number>;
  declare dateOfMeasure: Date;
  declare weightInKg: number;

  declare animal?: Animal;

  declare getAnimal: BelongsToGetAssociationMixin<Animal>;
  declare setAnimal: BelongsToSetAssociationMixin<Animal, number>;
  
  public toJSON() {
    return {
      ...this.get(),
      dateOfMeasure:this.dateOfMeasure?.getTime(),
    }
  }
}

AnimalWeight.init(
  {
    animalWeightId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    dateOfMeasure: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    weightInKg: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "animalWeight", // We need to choose the model name
  },
);

export { AnimalWeight };
