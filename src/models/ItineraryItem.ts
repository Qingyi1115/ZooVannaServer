import {
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManySetAssociationsMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
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
import { Itinerary } from "./Itinerary";
import { Facility } from "./Facility";

class ItineraryItem extends Model<
  InferAttributes<ItineraryItem>,
  InferCreationAttributes<ItineraryItem>
> {
  declare orderNum: number;

  declare itinerary?: Itinerary;
  declare facility?: Facility;

  declare getItinerary: BelongsToGetAssociationMixin<Itinerary>;
  declare setItinerary: BelongsToSetAssociationMixin<Itinerary, number>;

  declare getFacility: BelongsToGetAssociationMixin<Facility>;
  declare setFacility: BelongsToSetAssociationMixin<Facility, number>;

  public toJSON(): any {
    return {
      ...this.get(),
      itinerary: this.itinerary?.toJSON(),
      facility: this.facility?.toJSON(),
    };
  }

  public async toFullJSON() {
    return {
      ...this.toJSON(),
      itinerary: (await this.getItinerary())?.toJSON(),
      facility: (await this.getFacility())?.toJSON(),
    };
  }
}

ItineraryItem.init(
  {
    orderNum: {
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
    modelName: "itineraryItem", // We need to choose the model name
  },
);

export { ItineraryItem };
