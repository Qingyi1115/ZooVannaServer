import {
    DataTypes,
    Model,
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
    HasManyGetAssociationsMixin,
    HasManySetAssociationsMixin,
    HasManyAddAssociationMixin,
  } from "Sequelize";
  import { conn } from "../db";
  import crypto from "crypto";
import { Country } from "./enumerated";
import { Order } from "./order";
  
  function hash(string: string): string {
    return crypto.createHash("sha256").update(string).digest("hex");
  }
  
  function uppercaseFirst(str: string) {
    return `${str[0].toUpperCase()}${str.substr(1)}`;
  }
  
  function convertString(doorAccessCode: number): string {
    return (
      "0".repeat(6 - doorAccessCode.toString().length) + doorAccessCode.toString()
    );
  }
  
  class Customer extends Model<
    InferAttributes<Customer>,
    InferCreationAttributes<Customer>
  > {

    declare customerId: CreationOptional<number>;
    declare customerPasswordHash: string;
    declare customerSalt: string;
    declare firstName: string;
    declare lastName: string;
    declare email: string;
    declare contactNo: string;
    declare birthday: Date;
    declare address: string;
    declare nationality: Country;
  
    declare orders?: Order[];
  
    declare getOrders: HasManyGetAssociationsMixin<Order[]>;
    declare addOrders: HasManyAddAssociationMixin<Order, number>;
    declare setOrders: HasManySetAssociationsMixin<Order[], number>;
  
    static getTotalCustomer() {
      // Example for static class functions
      return Customer.count();
    }
  
    public testPassword(password: string) {
      return !hash(password + this.customerSalt).localeCompare(
        this.customerPasswordHash,
      );
    }
  
    public updatePassword(password: string) {
      this.customerPasswordHash = hash(password + this.customerSalt);
      this.save();
      return this;
    }
  
    static generateCustomerSalt() {
      return (Math.random() + 1).toString(36).substring(7);
    }
  
    static getHash(password: string, salt: string) {
      return hash(password + salt);
    }
  
    public toJSON() {
      // Can control default values returned rather than manually populating json, removing secrets
      // Similar idea albert more useful when compared to java's toString
      return {
        ...this.get(),
        customerPasswordHash: undefined,
        customerSalt: undefined,
      };
    }
  }
  
  Customer.init(
    {
      customerId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      customerPasswordHash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      customerSalt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      contactNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birthday: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nationality:{
        type: DataTypes.ENUM,
        values: Object.values(Country),
        allowNull: false,
      }
    },
    {
      freezeTableName: true,
      timestamps: true,
      createdAt: true,
      updatedAt: "updateTimestamp",
      sequelize: conn, // We need to pass the connection instance
      modelName: "customer", // We need to choose the model name
    },
  );
  
  export { Customer };
  