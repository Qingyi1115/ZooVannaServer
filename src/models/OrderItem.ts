import {
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "Sequelize";
import { conn } from "../db";
import { CustomerOrder } from "./CustomerOrder";
import { Listing } from "./Listing";

class OrderItem extends Model<
  InferAttributes<OrderItem>,
  InferCreationAttributes<OrderItem>
> {
  declare orderItemId: CreationOptional<number>;
  declare verificationCode: string;
  declare isRedeemed: number;
  declare timeRedeemed: Date | null;

  declare listing?: Listing;
  declare customerOrder?: CustomerOrder;

  declare getListing: BelongsToGetAssociationMixin<Listing>;
  declare setListing: BelongsToSetAssociationMixin<Listing, number>;

  declare getCustomerOrder: BelongsToGetAssociationMixin<CustomerOrder>;
  declare setCustomerOrder: BelongsToSetAssociationMixin<CustomerOrder, number>;

  public toJSON() {
    return {
      ...this.get(),
      timeRedeemed: this.timeRedeemed?.getTime(),
    };
  }

  public addIsRedeemed() {
    this.isRedeemed++;
    this.save();
  }
}

OrderItem.init(
  {
    orderItemId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    verificationCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isRedeemed: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timeRedeemed: {
      type: DataTypes.DATE,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "orderItem", // We need to choose the model name
  },
);

export { OrderItem };
