import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  BelongsToSetAssociationMixin,
  BelongsToGetAssociationMixin,
} from "Sequelize";
import { conn } from "../db";
import { Animal } from "./animal";

class AnimalLog extends Model<
  InferAttributes<AnimalLog>,
  InferCreationAttributes<AnimalLog>
> {
  declare animalLogId: number;
  declare dateTime: Date;
  declare title: string;
  declare details: string;
  declare remarks: string;

  declare animal?: Animal;

  declare getAnimal: BelongsToGetAssociationMixin<Animal>;
  declare setAnimal: BelongsToSetAssociationMixin<Animal, number>;
}

AnimalLog.init(
  {
    animalLogId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    dateTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    remarks: {
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
    modelName: "animalLog", // We need to choose the model name
  },
);

export { AnimalLog };
