import {
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManySetAssociationsMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "Sequelize";
import { conn } from "../db";
import { hash } from "../helpers/security";
import { AnimalActivity } from "./AnimalActivity";
import { GeneralStaff } from "./GeneralStaff";
import { Keeper } from "./Keeper";
import { PlanningStaff } from "./PlanningStaff";
import { ZooEvent } from "./ZooEvent";
import { Enclosure } from "./Enclosure";
import { Customer } from "./Customer";
import { ItineraryItem } from "./ItineraryItem";
import { Facility } from "./Facility";
import { Species } from "./Species";

function uppercaseFirst(str: string) {
  return `${str[0].toUpperCase()}${str.substr(1)}`;
}

function convertString(doorAccessCode: number): string {
  return (
    "0".repeat(6 - doorAccessCode.toString().length) + doorAccessCode.toString()
  );
}

class Itinerary extends Model<
  InferAttributes<Itinerary>,
  InferCreationAttributes<Itinerary>
> {
  declare itineraryId: CreationOptional<number>;
  declare datePlannedVisit: Date;
  declare itineraryName: string;

  declare customer?: Customer;
  declare specieses?: Species[];
  declare itineraryItems?: ItineraryItem[];

  declare getCustomer: HasOneGetAssociationMixin<Customer>;
  declare setCustomer: HasOneSetAssociationMixin<Customer, number>;

  declare getSpecieses: HasManyGetAssociationsMixin<Species>;
  declare addSpecies: HasManyAddAssociationMixin<Species, number>;
  declare setSpecieses: HasManySetAssociationsMixin<Species, number>;
  declare removeSpecies: HasManyRemoveAssociationMixin<Species, number>;

  declare getItineraryItems: HasManyGetAssociationsMixin<ItineraryItem>;
  declare addItineraryItem: HasManyAddAssociationMixin<ItineraryItem, number>;
  declare setItineraryItems: HasManySetAssociationsMixin<ItineraryItem, number>;
  declare removeItineraryItem: HasManyRemoveAssociationMixin<
    ItineraryItem,
    number
  >;

  public setItineraryName(itineraryName: string) {
    this.itineraryName = itineraryName;
    this.save();
  }

  public setDatePlannedVisit(datePlannedVisit: Date) {
    this.datePlannedVisit = datePlannedVisit;
    this.save();
  }

  public toJSON() {
    return {
      ...this.get(),
      customer: this.customer?.toJSON(),
      datePlannedVisit: this.datePlannedVisit?.getTime(),
    };
  }

  public async toFullJSON() {
    return {
      ...this.toJSON(),
      customer: (await this.getCustomer())?.toJSON(),
    };
  }
}

Itinerary.init(
  {
    itineraryId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    datePlannedVisit: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    itineraryName: {
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
    modelName: "itinerary", // We need to choose the model name
  },
);

export { Itinerary };
