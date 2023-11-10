import {
  BelongsToGetAssociationMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "Sequelize";
import { conn } from "../db";
import { Animal } from "./Animal";
import { AnimalActivity } from "./AnimalActivity";
import { Rating } from "./Enumerated";
import { Keeper } from "./Keeper";
  
  class AnimalObservationLog extends Model<
    InferAttributes<AnimalObservationLog>,
    InferCreationAttributes<AnimalObservationLog>
  > {
    declare animalObservationLogId : CreationOptional<number>;
    declare dateTime : Date;
    declare durationInMinutes: number;
    declare observationQuality : Rating;
    declare details : string;

    declare animals?: Animal[];
    declare keeper?: Keeper;
    declare animalActivity?: AnimalActivity;
  
    declare getAnimals: BelongsToManyGetAssociationsMixin<Animal>;
    declare addAnimal: BelongsToManyAddAssociationMixin<Animal, number>;
    declare setAnimals: BelongsToManySetAssociationsMixin<Animal, number>;
    declare removeAnimal: BelongsToManyRemoveAssociationMixin<Animal, number>;
  
    declare getKeeper: BelongsToGetAssociationMixin<Keeper>;
    declare setKeeper: BelongsToSetAssociationMixin<Keeper, number>;

    declare getAnimalActivity: BelongsToGetAssociationMixin<AnimalActivity>;
    declare setAnimalActivity: BelongsToSetAssociationMixin<AnimalActivity, number>;
  }
  
  AnimalObservationLog.init(
    {
        animalObservationLogId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      dateTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      durationInMinutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      observationQuality: {
        type: DataTypes.ENUM,
        values: Object.values(Rating),
        allowNull: false,
        },
      details: {
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
      modelName: "animalObservationLog", // We need to choose the model name
    },
  );
  
  export { AnimalObservationLog };
  