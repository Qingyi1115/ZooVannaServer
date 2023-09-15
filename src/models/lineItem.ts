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
import { Order } from "./order";
  
  class LineItem extends Model<
    InferAttributes<LineItem>,
    InferCreationAttributes<LineItem>
  > {
    
    declare lineItemId: CreationOptional<number>;
    declare quantityPurchased: number;
    declare unitPrice: number;
    declare subTotal: number;
  
    declare listing?: Listing;
    declare order?: Order;
  
    declare getListing: BelongsToGetAssociationMixin<Listing>;
    declare setListing: BelongsToSetAssociationMixin<Listing, number>;

    declare getOrder: BelongsToGetAssociationMixin<Order>;
    declare setOrder: BelongsToSetAssociationMixin<Order, number>;
  }
  
  LineItem.init(
    {
        lineItemId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      quantityPurchased: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      unitPrice: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      subTotal: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      createdAt: true,
      updatedAt: "updateTimestamp",
      sequelize: conn, // We need to pass the connection instance
      modelName: "lineItem", // We need to choose the model name
    },
  );
  
  export { LineItem };
  