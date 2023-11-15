import {
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "Sequelize";
import { conn } from "../db";
import { EventType } from "./Enumerated";
import { Animal } from "./Animal";
import { Keeper } from "./Keeper";
import { InHouse } from "./InHouse";
import { Customer } from "./Customer";
import { PublicEventSession } from "./PublicEventSession";

class PublicEvent extends Model<
  InferAttributes<PublicEvent>,
  InferCreationAttributes<PublicEvent>
> {
  declare publicEventId: CreationOptional<number>;
  declare eventType: EventType;
  declare title: string;
  declare details: string;
  declare imageUrl: string;
  declare startDate: Date;
  declare endDate: Date | null;
  declare isDisabled: boolean;

  declare animals?: Animal[];
  declare keepers?: Keeper[];
  declare inHouse?: InHouse;
  declare publicEventSessions?: PublicEventSession[];
  declare customers?: Customer[];
  // declare itineraryItems?: ItineraryItem[];

  declare getAnimals: HasManyGetAssociationsMixin<Animal>;
  declare addAnimal: HasManyAddAssociationMixin<Animal, number>;
  declare setAnimals: HasManySetAssociationsMixin<Animal, number>;
  declare removeAnimal: HasManyRemoveAssociationMixin<Animal, number>;

  declare getKeepers: HasManyGetAssociationsMixin<Keeper>;
  declare addKeeper: HasManyAddAssociationMixin<Keeper, number>;
  declare setKeepers: HasManySetAssociationsMixin<Keeper, number>;
  declare removeKeeper: HasManyRemoveAssociationMixin<Keeper, number>;

  declare getInHouse: BelongsToGetAssociationMixin<InHouse>;
  declare setInHouse: BelongsToSetAssociationMixin<InHouse, number>;

  declare getCustomers: HasManyGetAssociationsMixin<Customer>;
  declare addCustomer: HasManyAddAssociationMixin<Customer, number>;
  declare setCustomers: HasManySetAssociationsMixin<Customer, number>;
  declare removeCustomer: HasManyRemoveAssociationMixin<Customer, number>;

  // declare getItineraryItems: HasManyGetAssociationsMixin<ItineraryItem>;
  // declare addItineraryItem: HasManyAddAssociationMixin<ItineraryItem, number>;
  // declare setItineraryItems: HasManySetAssociationsMixin<ItineraryItem, number>;
  // declare removeItineraryItem: HasManyRemoveAssociationMixin<ItineraryItem, number>;

  declare getPublicEventSessions: HasManyGetAssociationsMixin<PublicEventSession>;
  declare addPublicEventSession: HasManyAddAssociationMixin<PublicEventSession, number>;
  declare setPublicEventSessions: HasManySetAssociationsMixin<PublicEventSession, number>;
  declare removePublicEventSession: HasManyRemoveAssociationMixin<PublicEventSession, number>;

  public toJSON() {
    return {
      ...this.get(),
      startDate: this.startDate?.getTime(),
      endDate: this.endDate?.getTime(),
    }
  }

  public async toFullJSON() {
    return {
      ...this.toJSON(),
    };
  }
}

PublicEvent.init(
  {
    publicEventId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    eventType: {
      type: DataTypes.ENUM,
      values: Object.values(EventType),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    // sensorReadings: {
    //   type: DataTypes.STRING(5000),
    //   set(val) {
    //     this.setDataValue("sensorReadings", JSON.stringify(val ?? ""));
    //   },
    // },
    startDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    endDate: {
      type: DataTypes.DATE,
    },
    isDisabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "publicEvent", // We need to choose the model name
  },
);

export { PublicEvent };

