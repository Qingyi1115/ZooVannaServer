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
  declare passwordHash: string;
  declare salt: string;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare contactNo: string;
  declare birthday: Date;
  declare address: string;
  declare nationality: Country;

  declare orders?: CustomerOrder[];

  declare getOrders: HasManyGetAssociationsMixin<CustomerOrder[]>;
  declare addOrders: HasManyAddAssociationMixin<CustomerOrder, number>;
  declare setOrders: HasManySetAssociationsMixin<CustomerOrder[], number>;

  static getTotalCustomer() {
    // Example for static class functions
    return Customer.count();
  }

  public testPassword(password: string) {
    return !hash(password + this.salt).localeCompare(this.passwordHash);
  }

  public updatePassword(password: string) {
    this.passwordHash = hash(password + this.salt);
    this.save();
    return this;
  }

  static generateCustomerSalt() {
    return (Math.random() + 1).toString(36).substring(7);
  }

  public updatePasswordWithToken(password: string) {
    this.passwordHash = hash(password + this.salt);
    this.save();
    return this;
  }

  static getHash(password: string, salt: string) {
    return hash(password + salt);
  }

  public toJSON() {
    // Can control default values returned rather than manually populating json, removing secrets
    // Similar idea albert more useful when compared to java's toString
    return {
      ...this.get(),
      passwordHash: undefined,
      salt: undefined,
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
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 1000], // At least 2 characters long, less than longest name in the world (747 char) + buffer
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 1000], // At least 2 characters long, less than longest name in the world (747 char) + buffer
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Email format validation from Sequelize
      },
    },
    contactNo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isContactNumber(value: string) {
          if (!/^[0-9\s\-\(\)]+$/.test(value)) {
            throw new Error(
              "Contact number should only contain digits, spaces, hyphens, or parentheses.",
            );
          }
          if (value.replace(/[\s\-\(\)]/g, "").length < 7) {
            throw new Error("Contact number should have at least 7 digits.");
          }
        },
      },
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 1000], // At least 5 characters long
      },
    },
    nationality: {
      type: DataTypes.ENUM,
      values: Object.values(Country),
      allowNull: false,
    },
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
