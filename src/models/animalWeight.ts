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
import { Animal } from "./Animal";

class AnimalWeight extends Model<
  InferAttributes<AnimalWeight>,
  InferCreationAttributes<AnimalWeight>
> {
  declare animalWeightId: CreationOptional<number>;
  declare weightInKg: number;
  declare dateOfMeasure: Date;

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
    weightInKg: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    dateOfMeasure: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
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
