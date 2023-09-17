import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManySetAssociationsMixin,
    HasManyAddAssociationMixin
  } from "Sequelize";
  import { conn } from "../db";
import { Country, OrderStatus } from "./enumerated";
import { Promotion } from "./promotion";
import { Payment } from "./payment";
import { Customer } from "./customer";
import { LineItem } from "./lineItem";
  
  class CustomerOrder extends Model<
    InferAttributes<CustomerOrder>,
    InferCreationAttributes<CustomerOrder>
  > {
    declare customerOrderId: CreationOptional<number>;
    declare timeCreated: Date;
    declare totalAmount: number;
    declare status: OrderStatus;
    declare entryDate: Date;
    declare isBoughtOnline:boolean;
    declare customerEmail: string | null;
    declare customerBirthday: Date | null;
    declare customerNationality: Country | null;

    declare promotion?: Promotion;
    declare customer?: Customer;
    declare payments?: Payment[];
    declare lineItems?: LineItem[];
  
    declare getPromotion: BelongsToGetAssociationMixin<Promotion>;
    declare setPromotion: BelongsToSetAssociationMixin<Promotion, number>;

    declare getCustomer: BelongsToGetAssociationMixin<Customer>;
    declare setCustomer: BelongsToSetAssociationMixin<Customer, number>;

    declare getPayment: HasManyGetAssociationsMixin<Payment[]>;
    declare addPayment: HasManyAddAssociationMixin<Payment, number>;
    declare setPayment: HasManySetAssociationsMixin<Payment[], number>;

    declare getLineItems: HasManyGetAssociationsMixin<LineItem[]>;
    declare addLineItem: HasManyAddAssociationMixin<LineItem, number>;
    declare setLineItems: HasManySetAssociationsMixin<LineItem[], number>;

}
  
CustomerOrder.init({
  customerOrderId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      timeCreated: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      status: {
          type:   DataTypes.ENUM,
          values: Object.values(OrderStatus),
          allowNull: false
      },
      entryDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isBoughtOnline: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      customerEmail: {
        type: DataTypes.STRING
      },
      customerBirthday: {
        type: DataTypes.DATE
      },
      customerNationality: {
          type:   DataTypes.ENUM,
          values: Object.values(Country)
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      createdAt: true,
      updatedAt: "updateTimestamp",
      sequelize: conn, // We need to pass the connection instance
      modelName: "customerOrder", // We need to choose the model name
    },
  );
  
  export { CustomerOrder };
  