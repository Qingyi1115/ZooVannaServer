import {
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
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
import { CustomerReportLog } from "./CustomerReportLog";
import { FacilityType } from "./Enumerated";
import { Facility } from "./Facility";

class ThirdParty extends Model<
  InferAttributes<ThirdParty>,
  InferCreationAttributes<ThirdParty>
> {
  declare facilityType: FacilityType;
  declare ownership: string;
  declare ownerContact: string;
  declare maxAccommodationSize: number;
  declare hasAirCon: boolean;

  declare facility?: Facility;
  declare customerReportLogs?: CustomerReportLog[];

  declare getFacility: BelongsToGetAssociationMixin<Facility>;
  declare setFacility: BelongsToSetAssociationMixin<Facility, number>;

  declare getCustomerReportLogs: HasManyGetAssociationsMixin<
    CustomerReportLog[]
  >;
  declare addCustomerReportLog: HasManyAddAssociationMixin<
    CustomerReportLog,
    number
  >;
  declare setCustomerReportLogs: HasManySetAssociationsMixin<
    CustomerReportLog[],
    number
  >;
  declare removeCustomerReportLog: HasManyRemoveAssociationMixin<
    CustomerReportLog,
    number
  >;

  public toJSON() {
    return {
      ...this.get(),
    };
  }
}
ThirdParty.init(
  {
    facilityType: {
      type: DataTypes.ENUM,
      values: Object.values(FacilityType),
      allowNull: false,
    },
    ownership: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ownerContact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maxAccommodationSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hasAirCon: {
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
    modelName: "thirdParty", // We need to choose the model name
  },
);

export { ThirdParty };

