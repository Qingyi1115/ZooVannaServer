import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    HasManyGetAssociationsMixin,
    HasManySetAssociationsMixin,
    HasManyAddAssociationsMixin,
    HasManyRemoveAssociationMixin,
  } from "Sequelize";
  import { conn } from "../db";
import { ListingStatus, ListingType } from "./enumerated";
import { LineItem } from "./lineItem";
  
  class Listing extends Model<
    InferAttributes<Listing>,
    InferCreationAttributes<Listing>
  > {
    declare listingId: CreationOptional<number>;
    declare name: string;
    declare listingType: ListingType;
    declare description: string;
    declare criteria: string;
    declare price: number;
    declare listingStatus: ListingStatus;
    declare dateCreated: Date;
    declare dateLastUpdated: Date;
  
    declare lineItems?: LineItem[];
  
    declare getLineItems: HasManyGetAssociationsMixin<LineItem[]>;
    declare addLineItem: HasManyAddAssociationsMixin<LineItem, number>;
    declare setLineItems: HasManySetAssociationsMixin<LineItem[], number>;
    declare removeLineItem: HasManyRemoveAssociationMixin<LineItem, number>;
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
      listingType: {
          type:   DataTypes.ENUM,
          values: Object.values(ListingType),
          allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      criteria: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      listingStatus: {
          type:   DataTypes.ENUM,
          values: Object.values(ListingStatus),
          allowNull: false
      },
      dateCreated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      dateLastUpdated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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
  