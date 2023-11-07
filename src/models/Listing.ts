import {
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
import { ListingStatus, ListingType } from "./Enumerated";
import { OrderItem } from "./OrderItem";

class Listing extends Model<
  InferAttributes<Listing>,
  InferCreationAttributes<Listing>
> {
  declare listingId: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare price: number;
  declare listingType: ListingType;
  declare listingStatus: ListingStatus;

  declare orderItems?: OrderItem[];

  declare getOrderItems: HasManyGetAssociationsMixin<OrderItem>;
  declare addOrderItem: HasManyAddAssociationMixin<OrderItem, number>;
  declare setOrderItems: HasManySetAssociationsMixin<OrderItem, number>;
  declare removeOrderItem: HasManyRemoveAssociationMixin<OrderItem, number>;

  public setDisabled() {
    this.listingStatus = ListingStatus.DISCONTINUED;
    this.save();
  }

  public setEnabled() {
    this.listingStatus = ListingStatus.ACTIVE;
    this.save();
  }

  public toJSON() {
    return {
      ...this.get(),
    };
  }
}

Listing.init(
  {
    listingId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    listingType: {
      type: DataTypes.ENUM,
      values: Object.values(ListingType),
      allowNull: true,
    },
    listingStatus: {
      type: DataTypes.ENUM,
      values: Object.values(ListingStatus),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "listing", // We need to choose the model name
  },
);

export { Listing };

