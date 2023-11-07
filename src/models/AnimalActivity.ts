import {
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model
} from "Sequelize";
import { conn } from "../db";
import { Animal } from "./Animal";
import { AnimalActivityLog } from "./AnimalActivityLog";
import { AnimalObservationLog } from "./AnimalObservationLog";
import { EnrichmentItem } from "./EnrichmentItem";
import {
  ActivityType,
  DayOfWeek,
  EventTimingType,
  RecurringPattern,
} from "./Enumerated";
import { ZooEvent } from "./ZooEvent";

// type Time = {
//   hours: number;
//   minutes: number;
// };

class AnimalActivity extends Model<
  InferAttributes<AnimalActivity>,
  InferCreationAttributes<AnimalActivity>
> {
  declare animalActivityId: CreationOptional<number>;
  declare activityType: ActivityType;
  declare title: string;
  declare details: string;
  declare startDate: Date;
  declare endDate: Date;
  declare recurringPattern: RecurringPattern;
  declare dayOfWeek: DayOfWeek | null;
  declare dayOfMonth: number | null;
  declare eventTimingType: EventTimingType;
  declare durationInMinutes: number;
  declare requiredNumberOfKeeper:number;

  // declare declare  FK
  declare animals?: Animal[];
  declare enrichmentItems?: EnrichmentItem[];
  declare zooEvents?: ZooEvent[];
  declare animalActivityLog?: AnimalActivityLog[];
  declare animalObservationLogs?: AnimalObservationLog[];

  declare getAnimals: HasManyGetAssociationsMixin<Animal>;
  declare addAnimal: HasManyAddAssociationMixin<Animal, number>;
  declare setAnimals: HasManySetAssociationsMixin<Animal, number>;
  declare removeAnimal: HasManyRemoveAssociationMixin<Animal, number>;

  declare getEnrichmentItems: HasManyGetAssociationsMixin<EnrichmentItem>;
  declare addEnrichmentItem: HasManyAddAssociationMixin<EnrichmentItem, number>;
  declare setAEnrichmentItems: HasManySetAssociationsMixin<
    EnrichmentItem,
    number
  >;
  declare removeEnrichmentItem: HasManyRemoveAssociationMixin<
    EnrichmentItem,
    number
  >;

  declare getZooEvents: HasManyGetAssociationsMixin<ZooEvent>;
  declare addZooEvent: HasManyAddAssociationMixin<ZooEvent, number>;
  declare setZooEvents: HasManySetAssociationsMixin<ZooEvent, number>;
  declare removeZooEvent: HasManyRemoveAssociationMixin<ZooEvent, number>;

  declare getAnimalActivityLogs: HasManyGetAssociationsMixin<AnimalActivityLog>;
  declare addAnimalActivityLog: HasManyAddAssociationMixin<AnimalActivityLog, number>;
  declare setAnimalActivityLogs: HasManySetAssociationsMixin<AnimalActivityLog, number>;
  declare removeAnimalActivityLog: HasManyRemoveAssociationMixin<AnimalActivityLog, number>;

  declare getAnimalObservationLogs: HasManyGetAssociationsMixin<AnimalObservationLog>;
  declare addAnimalObservationLog: HasManyAddAssociationMixin<AnimalObservationLog, number>;
  declare setAnimalObservationLogs: HasManySetAssociationsMixin<AnimalObservationLog, number>;
  declare removeAnimalObservationLog: HasManyRemoveAssociationMixin<AnimalObservationLog, number>;

  public toJSON() {
    return {
      ...this.get(),
      startDate: this.startDate?.getTime(),
      endDate: this.endDate?.getTime(),
    };
  }

  public async toFullJSON() {
    return {
      ...this.toJSON(),
      animals: (await this.getAnimals())?.map((obj) => obj.toJSON()),
      enrichmentItems: (await this.getEnrichmentItems())?.map((obj) =>
        obj.toJSON(),
      ),
      zooEvents: (await this.getZooEvents())?.map((obj) => obj.toJSON()),
    };
  }
}

AnimalActivity.init(
  {
    animalActivityId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    activityType: {
      type: DataTypes.ENUM,
      values: Object.values(ActivityType),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    recurringPattern: {
      type: DataTypes.ENUM,
      values: Object.values(RecurringPattern),
      allowNull: false,
    },
    dayOfWeek: {
      type: DataTypes.ENUM,
      values: Object.values(DayOfWeek),
    },
    dayOfMonth: {
      type: DataTypes.INTEGER,
    },
    eventTimingType: {
      type: DataTypes.ENUM,
      values: Object.values(EventTimingType),
    },
    durationInMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requiredNumberOfKeeper: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "animalActivity", // We need to choose the model name
  },
);

export { AnimalActivity };

