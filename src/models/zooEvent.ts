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
  HasManyRemoveAssociationMixin,
  CreationOptional,
} from "Sequelize";
import { conn } from "../db";
import { EventTimingType, EventType } from "./enumerated";
import { Enclosure } from "./enclosure";
import { PlanningStaff } from "./planningStaff";
import { Keeper } from "./keeper";
import { Animal } from "./animal";
import { InHouse } from "./inHouse";
import { AnimalClinic } from "./animalClinics";
import { AnimalActivity } from "./animalActivity";

class ZooEvent extends Model<
  InferAttributes<ZooEvent>,
  InferCreationAttributes<ZooEvent>
> {
  declare zooEventId: CreationOptional<number>;
  declare eventName: String;
  declare eventNotificationDate: Date;
  declare eventStartDateTime: Date;
  declare eventEndDateTime: Date | null;
  declare eventDurationHrs: number;
  declare eventTiming: EventTimingType | null;
  declare eventDescription: string;
  declare eventIsPublic: boolean;
  declare eventType?: EventType;

  declare planningStaff?: PlanningStaff;
  declare keepers?: Keeper[]; // work
  declare enclosure?: Enclosure;
  declare animal?: Animal;
  declare inHouse?: InHouse;
  declare animalClinic?: AnimalClinic;
  declare AnimalActivity?: AnimalActivity;

  declare getPlanningStaff: BelongsToGetAssociationMixin<PlanningStaff>;
  declare setPlanningStaff: BelongsToSetAssociationMixin<PlanningStaff, number>;

  declare getKeepers: BelongsToManyGetAssociationsMixin<Keeper>;
  declare addKeeper: BelongsToManyAddAssociationMixin<Keeper, number>;
  declare setKeepers: BelongsToManySetAssociationsMixin<Keeper, number>;
  declare removeKeeper: HasManyRemoveAssociationMixin<Keeper, number>;

  declare getEnclosure: BelongsToGetAssociationMixin<Enclosure>;
  declare setEnclosure: BelongsToSetAssociationMixin<Enclosure, number>;

  declare getAnimal: BelongsToGetAssociationMixin<Animal>;
  declare setAnimal: BelongsToSetAssociationMixin<Animal, number>;

  declare getInHouse: BelongsToGetAssociationMixin<InHouse>;
  declare setInHouse: BelongsToSetAssociationMixin<InHouse, number>;

  declare getAnimalClinic: BelongsToGetAssociationMixin<AnimalClinic>;
  declare setAnimalClinic: BelongsToSetAssociationMixin<AnimalClinic, number>;
  
  declare getAnimalActivity: BelongsToGetAssociationMixin<AnimalActivity>;
  declare setAnimalActivity: BelongsToSetAssociationMixin<AnimalActivity, number>;

  public toJSON() {
      return {
        ...this.get(),
        eventNotificationDate:this.eventNotificationDate?.getTime(),
        eventStartDateTime:this.eventStartDateTime?.getTime(),
        eventEndDateTime:this.eventEndDateTime?.getTime(),
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
