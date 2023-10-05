import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
} from "Sequelize";
import { conn } from "../db";
import { Listing } from "./listing";
import { CustomerOrder } from "./customerOrder";

class OrderItem extends Model<
  InferAttributes<OrderItem>,
  InferCreationAttributes<OrderItem>
> {
  declare orderItemId: CreationOptional<number>;
  declare verificationCode: string;
  declare isRedeemed: boolean;
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
      timeRedeemed:this.timeRedeemed?.getTime(),
    }
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
      type: DataTypes.BOOLEAN,
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
