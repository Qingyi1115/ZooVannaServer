import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
} from "Sequelize";
import { conn } from "../db";
import { EventTimingType, EventType } from "./enumerated";
import { Enclosure } from "./enclosure";
import { PlanningStaff } from "./planningStaff";
import { Keeper } from "./keeper";
import { Animal } from "./animal";
import { InHouse } from "./inHouse";
import { AnimalClinic } from "./animalClinics";

class Event extends Model<
  InferAttributes<Event>,
  InferCreationAttributes<Event>
> {
  declare eventId: number;
  declare eventName: String;
  declare eventNotificationDate: Date;
  declare eventStartDateTime: Date;
  declare eventEndDateTime: Date;
  declare eventDurationHrs: number;
  declare isFlexible: boolean;
  declare eventTiming: EventTimingType;
  declare eventDescription: string;
  declare eventIsPublic: boolean;
  declare eventType: EventType;

  declare planningStaff?: PlanningStaff;
  declare keepers?: Keeper[];
  declare enclosure?: Enclosure;
  declare animal?: Animal;
  declare inHouse?: InHouse;
  declare animalClinic?: AnimalClinic;

  declare getPlanningStaff: BelongsToGetAssociationMixin<PlanningStaff>;
  declare setPlanningStaff: BelongsToSetAssociationMixin<PlanningStaff, number>;

  declare getKeepers: BelongsToManyGetAssociationsMixin<Keeper[]>;
  declare addKeeper: BelongsToManyAddAssociationMixin<Keeper, number>;
  declare setKeepers: BelongsToManySetAssociationsMixin<Keeper[], number>;

  declare getEnclosure: BelongsToGetAssociationMixin<Enclosure>;
  declare setEnclosure: BelongsToSetAssociationMixin<Enclosure, number>;

  declare getAnimal: BelongsToGetAssociationMixin<Animal>;
  declare setAnimal: BelongsToSetAssociationMixin<Animal, number>;

  declare getInHouse: BelongsToGetAssociationMixin<InHouse>;
  declare setInHouse: BelongsToSetAssociationMixin<InHouse, number>;

  declare getAnimalClinic: BelongsToGetAssociationMixin<AnimalClinic>;
  declare setAnimalClinic: BelongsToSetAssociationMixin<AnimalClinic, number>;

  // public toJSON() {
  //     // Can control default values returned rather than manually populating json, removing secrets
  //     // Similar idea albert more useful when compared to java's toString
  //     return {...this.get(), age: this.getAge()}
  // }
}

Event.init(
  {
    eventId: {
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
      allowNull: false,
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
    isFlexible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "event", // We need to choose the model name
  },
);

export { Event };
