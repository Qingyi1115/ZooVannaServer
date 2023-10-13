import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    BelongsToSetAssociationMixin,
    BelongsToGetAssociationMixin,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
    CreationOptional,
  } from "Sequelize";
  import { conn } from "../db";
  import { DayOfTheWeek, EventTimingType } from "./enumerated";
import { ZooEvent } from "./zooEvent";
import { AnimalActivity } from "./animalActivity";
  
  class AnimalActivitySession extends Model<
    InferAttributes<AnimalActivitySession>,
    InferCreationAttributes<AnimalActivitySession>
  > {
    declare animalActivitySessionId: CreationOptional<number>;
    declare startDate:Date;
    declare endDate:Date;
    declare dayOfTheWeek: DayOfTheWeek;
    declare eventTimingType: EventTimingType;
    declare durationInMinutes: number;

    // declare declare  FK
    declare zooEvent?: ZooEvent;
    declare animalActivity?: AnimalActivity;
  
    declare getZooEvent: HasOneGetAssociationMixin<ZooEvent>;
    declare setZooEvent: HasOneSetAssociationMixin<ZooEvent, number>;
    
    declare getAnimalActivity: BelongsToGetAssociationMixin<AnimalActivity>;
    declare setAnimalActivity: BelongsToSetAssociationMixin<AnimalActivity, number>;
  }
  
  AnimalActivitySession.init(
    {
        animalActivitySessionId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      startDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      endDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      dayOfTheWeek: {
        type: DataTypes.ENUM,
        values: Object.values(DayOfTheWeek),
        allowNull: false,
      },
      eventTimingType: {
        type: DataTypes.ENUM,
        values: Object.values(EventTimingType),
        allowNull: false,
      },
      durationInMinutes: {
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
      modelName: "animalActivitySession", // We need to choose the model name
    },
  );
  
  export { AnimalActivitySession };
  