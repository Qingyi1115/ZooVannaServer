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
import { CustomerOrder } from "./customerOrder";
  
  function hash(string: string): string {
    return crypto.createHash("sha256").update(string).digest("hex");
  }
  
  function uppercaseFirst(str: string) {
    return `${str[0].toUpperCase()}${str.substr(1)}`;
  }
  
  
  class Customer extends Model<
    InferAttributes<Customer>,
    InferCreationAttributes<Customer>
  > {

    declare customerId: CreationOptional<number>;
    declare customerUsername: string;
    declare customerPasswordHash: string;
    declare customerSalt: string;
    declare customerFirstName: string;
    declare customerLastName: string;
    declare customerEmail: string;
    declare customerContactNo: string;
    declare customerBirthday: Date;
    declare customerAddress: string;
    declare customerNationality: Country;
  
    declare customerOrder?: CustomerOrder[];
  
    declare getCustomerOrders: HasManyGetAssociationsMixin<CustomerOrder[]>;
    declare addCustomerOrder: HasManyAddAssociationMixin<CustomerOrder, number>;
    declare setCustomerOrders: HasManySetAssociationsMixin<CustomerOrder[], number>;
  
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
      customerUsername: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      customerPasswordHash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      customerSalt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customerFirstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customerLastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customerEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      customerContactNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customerBirthday: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      customerAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customerNationality:{
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
  