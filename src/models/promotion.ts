import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    HasManyGetAssociationsMixin,
    HasManySetAssociationsMixin,
    HasManyAddAssociationMixin,
  } from "Sequelize";
  import { conn } from "../db";
import { Order } from "./order";
  
  class Promotion extends Model<
    InferAttributes<Promotion>,
    InferCreationAttributes<Promotion>
  > {
    declare promotionId: CreationOptional<number>;
    declare description: string;
    declare startDate: Date;
    declare endDate: Date;
    declare percentage: number;
    declare minimumSpending: number;
    declare promotionCode: string;
  
    declare orders?: Order[];
  
    declare getOrders: HasManyGetAssociationsMixin<Order>;
    declare addOrders: HasManyAddAssociationMixin<Order, number>;
    declare setOrders: HasManySetAssociationsMixin<Order, number>;
}
  
Promotion.init({
    promotionId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      percentage: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      minimumSpending: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      promotionCode: {
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
      modelName: "promotion", // We need to choose the model name
    },
  );
  
  export { Promotion };
  