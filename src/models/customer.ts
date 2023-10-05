import {
  DataTypes,
  Model,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyRemoveAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
} from "Sequelize";
import { conn } from "../db";
import crypto from "crypto";
import { Country } from "./enumerated";
import { CustomerOrder } from "./customerOrder";
import { Species } from "./species";

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
  declare nationality: Country;

  declare customerOrders?: CustomerOrder[];
  declare species?: Species[];

  declare getCustomerOrders: HasManyGetAssociationsMixin<CustomerOrder>;
  declare addCustomerOrder: HasManyAddAssociationMixin<CustomerOrder, number>;
  declare setCustomerOrders: HasManySetAssociationsMixin<CustomerOrder, number>;
  declare removeCustomerOrder: HasManyRemoveAssociationMixin<CustomerOrder, number>;

  declare getSpecies: BelongsToManyGetAssociationsMixin<Species>;
  declare addSpecies: BelongsToManyAddAssociationMixin<Species, number>;
  declare setSpecies: BelongsToManySetAssociationsMixin<Species, number>;
  declare removeSpecies: BelongsToManyRemoveAssociationMixin<Species, number>;

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
    return {
      ...this.get(),
      passwordHash: undefined,
      salt: undefined,
      birthday:this.birthday?.getTime(),
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
