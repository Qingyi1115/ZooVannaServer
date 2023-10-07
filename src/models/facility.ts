import {
  DataTypes,
  Model,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasManyRemoveAssociationMixin,
} from "Sequelize";
import { conn } from "../db";
import { InHouse } from "./inHouse";
import { ThirdParty } from "./thirdParty";
import { AnimalClinic } from "./animalClinics";
import { uppercaseFirst } from "../helpers/others";
import { HubProcessor } from "./hubProcessor";
import { Enclosure } from "./enclosure";

class Facility extends Model<
  InferAttributes<Facility>,
  InferCreationAttributes<Facility>
> {
  declare facilityId: CreationOptional<number>;
  declare facilityName: string;
  declare xCoordinate: number;
  declare yCoordinate: number;
  declare isSheltered: boolean;

  declare facilityDetail?: string;

  declare hubProcessors?: HubProcessor[];
  declare inHouse?: InHouse;
  declare thirdParty?: ThirdParty;
  declare animalClinic?: AnimalClinic;
  declare enclosure?: Enclosure;

  declare getHubProcessors: HasManyGetAssociationsMixin<HubProcessor[]>;
  declare addHubProcessor: HasManyAddAssociationMixin<HubProcessor, number>;
  declare setHubProcessors: HasManySetAssociationsMixin<HubProcessor[], number>;
  declare removeHubProcessor: HasManyRemoveAssociationMixin<
    HubProcessor,
    number
  >;

  declare getInHouse: HasOneGetAssociationMixin<InHouse>;
  declare setInHouse: HasOneSetAssociationMixin<InHouse, number>;

  declare getThirdParty: HasOneGetAssociationMixin<ThirdParty>;
  declare setThirdParty: HasOneSetAssociationMixin<ThirdParty, number>;

  declare getAnimalClinic: HasOneGetAssociationMixin<AnimalClinic>;
  declare setAnimalClinic: HasOneSetAssociationMixin<AnimalClinic, number>;

  declare getEnclosure: HasOneGetAssociationMixin<Enclosure>;
  declare setEnclosure: HasOneSetAssociationMixin<Enclosure, number>;

  public async getFacilityDetail() {
    if (!this.facilityDetail) {
      let inHouse = await this.getInHouse();
      if (inHouse) {
        this.facilityDetail = "inHouse";
        return inHouse;
      }
      let thirdParty = await this.getThirdParty();
      if (thirdParty) {
        this.facilityDetail = "thirdParty";
        return thirdParty;
      }
      let animalClinic = await this.getAnimalClinic();
      if (animalClinic) {
        this.facilityDetail = "animalClinic";
        return animalClinic;
      }
    }
    const mixinMethodName = `get${uppercaseFirst(this.facilityDetail ?? "")}`;
    return (this as any)[mixinMethodName]();
  }

  public toJSON() {
    // Can control default values returned rather than manually populating json, removing secrets
    // Similar idea albert more useful when compared to java's toString
    return this.get(); //{...this.get(), employeePasswordHash: undefined, employeeSalt: undefined}
  }

  public async toFullJson() {
    const _json: any = {
      ...this.get(),
      facilityDetailJson: await this.getFacilityDetail(),
      hubProcessors: await this.getHubProcessors(),
    };
    _json.facilityDetail = this.facilityDetail;
    return _json;
  }
}

Facility.init(
  {
    facilityId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    facilityName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    xCoordinate: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
    yCoordinate: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
    facilityDetail: {
      type: DataTypes.STRING,
    },
    isSheltered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "facility", // We need to choose the model name
  },
);

export { Facility };
