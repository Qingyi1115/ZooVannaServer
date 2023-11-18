import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManySetAssociationsMixin,
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
import crypto from "crypto";
import { conn } from "../db";
import { CustomerOrder } from "./CustomerOrder";
import { Country } from "./Enumerated";
import { Species } from "./Species";
import { PublicEvent } from "./PublicEvent";
import { Itinerary } from "./Itinerary";

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
  declare publicEvents?: PublicEvent[];
  declare itineraries?: Itinerary[];

  declare getCustomerOrders: HasManyGetAssociationsMixin<CustomerOrder>;
  declare addCustomerOrder: HasManyAddAssociationMixin<CustomerOrder, number>;
  declare setCustomerOrders: HasManySetAssociationsMixin<CustomerOrder, number>;
  declare removeCustomerOrder: HasManyRemoveAssociationMixin<
    CustomerOrder,
    number
  >;

  declare getSpecies: BelongsToManyGetAssociationsMixin<Species>;
  declare addSpecies: BelongsToManyAddAssociationMixin<Species, number>;
  declare setSpecies: BelongsToManySetAssociationsMixin<Species, number>;
  declare removeSpecies: BelongsToManyRemoveAssociationMixin<Species, number>;

  declare getPublicEvents: HasManyGetAssociationsMixin<PublicEvent>;
  declare addPublicEvent: HasManyAddAssociationMixin<PublicEvent, number>;
  declare setPublicEvents: HasManySetAssociationsMixin<PublicEvent, number>;
  declare removePublicEvent: HasManyRemoveAssociationMixin<PublicEvent, number>;

  declare getItineraries: HasManyGetAssociationsMixin<Itinerary>;
  declare addItinerary: HasManyAddAssociationMixin<Itinerary, number>;
  declare setItineraries: HasManySetAssociationsMixin<Itinerary, number>;
  declare removeItinerary: HasManyRemoveAssociationMixin<Itinerary, number>;

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
      birthday: this.birthday?.getTime(),
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
