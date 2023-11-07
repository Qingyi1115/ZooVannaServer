import {
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model
} from "Sequelize";
import { conn } from "../db";
import { CustomerOrder } from "./CustomerOrder";

class Promotion extends Model<
  InferAttributes<Promotion>,
  InferCreationAttributes<Promotion>
> {
  declare promotionId: CreationOptional<number>;
  declare title: string;
  declare description: string;
  declare publishDate: Date;
  declare startDate: Date;
  declare endDate: Date;
  declare percentage: number;
  declare minimumSpending: number;
  declare promotionCode: string;
  declare maxRedeemNum: number;
  declare currentRedeemNum: number;
  declare imageUrl: string;

  declare customerOrder?: CustomerOrder[];

  declare getCustomerOrders: HasManyGetAssociationsMixin<CustomerOrder[]>;
  declare addCustomerOrder: HasManyAddAssociationMixin<CustomerOrder, number>;
  declare setCustomerOrders: HasManySetAssociationsMixin<
    CustomerOrder[],
    number
  >;
  declare removeCustomerOrder: HasManyRemoveAssociationMixin<
    CustomerOrder,
    number
  >;

  // async getCurrentRedeemNum() {
  //   try {
  //     // Use the association method to get related CustomerOrders
  //     const customerOrders = await this.getCustomerOrders({
  //       where: {
  //         [Op.or]: [{ status: "ACTIVE" }, { status: "COMPLETED" }],
  //       },
  //     });

  //     // Check if customerOrders is null or an empty array
  //     if (!customerOrders || customerOrders.length === 0) {
  //       return 0;
  //     }

  //     // Count the number of retrieved CustomerOrders
  //     const count = customerOrders.length;
  //     return count;
  //   } catch (error) {
  //     // Handle any potential errors here
  //     console.error("Error counting customerOrders:", error);
  //     throw error;
  //   }
  // }

  public incrementCurrentRedeemNum() {
    this.currentRedeemNum = this.currentRedeemNum + 1;
    this.save();
    return this;
  }

  public decrementCurrentRedeemNum() {
    if (this.currentRedeemNum > 0) {
      this.currentRedeemNum = this.currentRedeemNum - 1;
      this.save();
    }
    return this;
  }

  public toJSON() {
    return {
      ...this.get(),
      publishDate: this.publishDate?.getTime(),
      startDate: this.startDate?.getTime(),
      endDate: this.endDate?.getTime(),
    };
  }
}

Promotion.init(
  {
    promotionId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publishDate: {
      type: DataTypes.DATE,
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
      unique: true,
    },
    maxRedeemNum: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    currentRedeemNum: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    imageUrl: {
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

