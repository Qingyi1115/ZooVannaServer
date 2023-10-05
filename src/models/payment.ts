import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
  } from "Sequelize";
  import { conn } from "../db";
import { PaymentStatus, PaymentType } from "./enumerated";
import { CustomerOrder } from "./customerOrder";
  
  class Payment extends Model<
    InferAttributes<Payment>,
    InferCreationAttributes<Payment>
  > {
    declare paymentId: CreationOptional<number>;
    declare amount: number;
    declare time: Date;
    declare paymentType: PaymentType;
    declare paymentStatus: PaymentStatus;
    declare transactionId: string;
    declare description: string;
    
    declare customerOrder?: CustomerOrder;
  
    declare getCustomerOrder: BelongsToGetAssociationMixin<CustomerOrder>;
    declare setCustomerOrder: BelongsToSetAssociationMixin<CustomerOrder, number>;
    
  public toJSON() {
    return {
      ...this.get(),
      time:this.time?.getTime(),
    }
  }
  
}
  
Payment.init({
    paymentId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      paymentType: {
          type:   DataTypes.ENUM,
          values: Object.values(PaymentType),
          allowNull: false
      },
      paymentStatus: {
          type:   DataTypes.ENUM,
          values: Object.values(PaymentStatus),
          allowNull: false
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
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
      modelName: "payment", // We need to choose the model name
    },
  );
  
  export { Payment };
  