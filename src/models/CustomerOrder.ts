import {
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
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
import { Customer } from "./Customer";
import { OrderStatus, PaymentStatus } from "./Enumerated";
import { OrderItem } from "./OrderItem";
import { Payment } from "./Payment";
import { Promotion } from "./Promotion";

class CustomerOrder extends Model<
  InferAttributes<CustomerOrder>,
  InferCreationAttributes<CustomerOrder>
> {
  declare customerOrderId: CreationOptional<number>;
  declare bookingReference: string;
  declare totalAmount: number;
  declare orderStatus: OrderStatus;
  declare entryDate: Date;
  declare customerFirstName: string;
  declare customerLastName: string;
  declare customerContactNo: string;
  declare customerEmail: string;
  declare paymentStatus: PaymentStatus;
  declare pdfUrl: string;

  declare promotion?: Promotion;
  declare customer?: Customer;
  declare payments?: Payment[];
  declare orderItems?: OrderItem[];

  declare getPromotion: BelongsToGetAssociationMixin<Promotion>;
  declare setPromotion: BelongsToSetAssociationMixin<Promotion, number>;

  declare getCustomer: BelongsToGetAssociationMixin<Customer>;
  declare setCustomer: BelongsToSetAssociationMixin<Customer, number>;

  declare getPayments: HasManyGetAssociationsMixin<Payment>;
  declare addPayment: HasManyAddAssociationMixin<Payment, number>;
  declare setPayments: HasManySetAssociationsMixin<Payment, number>;
  declare removePayment: HasManyRemoveAssociationMixin<Payment, number>;

  declare getOrderItems: HasManyGetAssociationsMixin<OrderItem>;
  declare addOrderItem: HasManyAddAssociationMixin<OrderItem, number>;
  declare setOrderItemms: HasManySetAssociationsMixin<OrderItem, number>;
  declare removeOrderItem: HasManyRemoveAssociationMixin<OrderItem, number>;

  public toJSON() {
    return {
      ...this.get(),
      entryDate: this.entryDate?.getTime(),
    };
  }

  public setCompleted() {
    this.paymentStatus = PaymentStatus.COMPLETED;
    this.save();
  }

  public setPending() {
    this.paymentStatus = PaymentStatus.PENDING;
    this.save();
  }

  public setPdfUrl(url: string) {
    this.pdfUrl = url;
    this.save();
  }
}

CustomerOrder.init(
  {
    customerOrderId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    bookingReference: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    orderStatus: {
      type: DataTypes.ENUM,
      values: Object.values(OrderStatus),
      allowNull: false,
    },
    entryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    customerFirstName: {
      type: DataTypes.STRING,
    },
    customerLastName: {
      type: DataTypes.STRING,
    },
    customerContactNo: {
      type: DataTypes.STRING,
    },
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM,
      values: Object.values(PaymentStatus),
      allowNull: false,
    },
    pdfUrl: {
      type: DataTypes.STRING,
      allowNull: true,
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

