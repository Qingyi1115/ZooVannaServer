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
  
  class LineItem extends Model<
    InferAttributes<LineItem>,
    InferCreationAttributes<LineItem>
  > {
    
    declare lineItemId: CreationOptional<number>;
    declare quantityPurchased: number;
    declare unitPrice: number;
    declare subTotal: number;
  
    declare listing?: Listing;
    declare customerOrder?: CustomerOrder;
  
    declare getListing: BelongsToGetAssociationMixin<Listing>;
    declare setListing: BelongsToSetAssociationMixin<Listing, number>;

    declare getCustomerOrder: BelongsToGetAssociationMixin<CustomerOrder>;
    declare setCustomerOrder: BelongsToSetAssociationMixin<CustomerOrder, number>;
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
  