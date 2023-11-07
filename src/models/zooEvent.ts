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
  Model
} from "Sequelize";
import { conn } from "../db";
import { Animal } from "./Animal";
import { AnimalActivity } from "./AnimalActivity";
import { AnimalClinic } from "./AnimalClinics";
import { Enclosure } from "./Enclosure";
import { EventTimingType, EventType } from "./Enumerated";
import { FeedingPlanSessionDetail } from "./FeedingPlanSessionDetail";
import { InHouse } from "./InHouse";
import { Keeper } from "./Keeper";
import { PlanningStaff } from "./PlanningStaff";
import { Employee } from "./Employee";
import { PublicEventSession } from "./PublicEventSession";

class ZooEvent extends Model<
  InferAttributes<ZooEvent>,
  InferCreationAttributes<ZooEvent>
> {
  declare zooEventId: CreationOptional<number>;
  declare eventName: string;
  declare eventDescription: string;
  declare eventIsPublic: boolean;
  declare eventType?: EventType;
  declare eventStartDateTime: Date;
  declare eventNotificationDate: Date;
  declare requiredNumberOfKeeper: number;

  // Internal
  declare eventDurationHrs: number;
  declare eventTiming: EventTimingType | null;

  // Public
  declare eventEndDateTime: Date | null;
  declare imageUrl: CreationOptional<string>;

  declare planningStaff?: PlanningStaff;
  declare keepers?: Keeper[]; // work
  declare enclosure?: Enclosure;
  declare animals?: Animal[];
  declare inHouse?: InHouse;
  declare animalClinic?: AnimalClinic;
  declare animalActivity?: AnimalActivity;
  declare feedingPlanSessionDetail?: FeedingPlanSessionDetail;
  declare employee?: Employee;
  declare publicEventSession?: PublicEventSession;

  declare getPlanningStaff: BelongsToGetAssociationMixin<PlanningStaff>;
  declare setPlanningStaff: BelongsToSetAssociationMixin<PlanningStaff, number>;

  declare getKeepers: BelongsToManyGetAssociationsMixin<Keeper>;
  declare addKeeper: BelongsToManyAddAssociationMixin<Keeper, number>;
  declare setKeepers: BelongsToManySetAssociationsMixin<Keeper, number>;
  declare removeKeeper: BelongsToManyRemoveAssociationMixin<Keeper, number>;

  declare getEnclosure: BelongsToGetAssociationMixin<Enclosure>;
  declare setEnclosure: BelongsToSetAssociationMixin<Enclosure, number>;

  declare getAnimals: BelongsToManyGetAssociationsMixin<Animal>;
  declare addAnimal: BelongsToManyAddAssociationMixin<Animal, number>;
  declare setAnimals: BelongsToManySetAssociationsMixin<Animal, number>;
  declare removeAnimal: BelongsToManyRemoveAssociationMixin<Animal, number>;

  declare getInHouse: BelongsToGetAssociationMixin<InHouse>;
  declare setInHouse: BelongsToSetAssociationMixin<InHouse, number>;

  declare getAnimalClinic: BelongsToGetAssociationMixin<AnimalClinic>;
  declare setAnimalClinic: BelongsToSetAssociationMixin<AnimalClinic, number>;

  declare getAnimalActivity: BelongsToGetAssociationMixin<AnimalActivity>;
  declare setAnimalActivity: BelongsToSetAssociationMixin<AnimalActivity, number>;

  declare getFeedingPlanSessionDetail: BelongsToGetAssociationMixin<FeedingPlanSessionDetail>;
  declare setFeedingPlanSessionDetail: BelongsToSetAssociationMixin<FeedingPlanSessionDetail, number>;

  declare getEmployee: BelongsToGetAssociationMixin<Employee>;
  declare setEmployee: BelongsToSetAssociationMixin<Employee, number>;

  declare getPublicEventSession: BelongsToGetAssociationMixin<PublicEventSession>;
  declare setPublicEventSession: BelongsToSetAssociationMixin<PublicEventSession, number>;

  public toJSON() {
    return {
      ...this.get(),
      eventNotificationDate: this.eventNotificationDate?.getTime(),
      eventStartDateTime: this.eventStartDateTime?.getTime(),
      eventEndDateTime: this.eventEndDateTime?.getTime(),
    }
  }
}

ZooEvent.init(
  {
    zooEventId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    eventName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eventNotificationDate: {
      type: DataTypes.DATE,
    },
    eventStartDateTime: {
      type: DataTypes.DATE,
    },
    eventEndDateTime: {
      type: DataTypes.DATE,
    },
    eventDurationHrs: {
      type: DataTypes.INTEGER,
    },
    eventTiming: {
      type: DataTypes.ENUM,
      values: Object.values(EventTimingType),
    },
    eventDescription: {
      type: DataTypes.STRING,
    },
    eventIsPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    eventType: {
      type: DataTypes.ENUM,
      values: Object.values(EventType),
      // allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    requiredNumberOfKeeper: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "zooEvent", // We need to choose the model name
  },
);

export { ZooEvent };

