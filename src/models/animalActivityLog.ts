import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    BelongsToSetAssociationMixin,
    BelongsToGetAssociationMixin,
    CreationOptional,
    BelongsToManyAddAssociationMixin,
    BelongsToManyGetAssociationsMixin,
    BelongsToManySetAssociationsMixin,
    BelongsToManyRemoveAssociationMixin,
  } from "Sequelize";
  import { conn } from "../db";
  import { Animal } from "./animal";
import { ActivityType, Rating, Reaction } from "./enumerated";
import { Keeper } from "./keeper";
  
  class AnimalActivityLog extends Model<
    InferAttributes<AnimalActivityLog>,
    InferCreationAttributes<AnimalActivityLog>
  > {
    declare animalActivityLogId : CreationOptional<number>;
    declare activityType: ActivityType;
    declare dateTime : Date;
    declare durationInMinutes: number;
    declare sessionRating : Rating;
    declare animalReaction: Reaction;
    declare details : string;

    declare animals?: Animal[];
    declare keeper?: Keeper;
  
    declare getAnimals: BelongsToManyGetAssociationsMixin<Animal>;
    declare addAnimal: BelongsToManyAddAssociationMixin<Animal, number>;
    declare setAnimals: BelongsToManySetAssociationsMixin<Animal, number>;
    declare removeAnimal: BelongsToManyRemoveAssociationMixin<Animal, number>;
  
    declare getKeeper: BelongsToGetAssociationMixin<Keeper>;
    declare setKeeper: BelongsToSetAssociationMixin<Keeper, number>;
  }
  
  AnimalActivityLog.init(
    {
        animalActivityLogId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      activityType: {
        type: DataTypes.ENUM,
        values: Object.values(ActivityType),
        allowNull: false,
        },
      dateTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      durationInMinutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sessionRating: {
        type: DataTypes.ENUM,
        values: Object.values(Rating),
        allowNull: false,
        },
        animalReaction: {
          type: DataTypes.ENUM,
          values: Object.values(Reaction),
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
      modelName: "animalActivityLog", // We need to choose the model name
    },
  );
  
  export { AnimalActivityLog };
  