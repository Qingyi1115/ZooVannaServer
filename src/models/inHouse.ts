import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyRemoveAssociationMixin,
} from "Sequelize";
import { conn } from "../db";
import { Facility } from "./facility";
import { FacilityType } from "./enumerated";
import { GeneralStaff } from "./generalStaff";
import { FacilityLog } from "./faciltiyLog";
import { CustomerReportLog } from "./customerReportLog";

class InHouse extends Model<
  InferAttributes<InHouse>,
  InferCreationAttributes<InHouse>
> {
  declare lastMaintained: Date;
  declare isPaid: Boolean;
  declare maxAccommodationSize: number;
  declare hasAirCon: Boolean;
  declare facilityType: FacilityType;

  declare facility?: Facility;
  declare previousTramStop?: InHouse;
  declare nextTramStop?: InHouse;
  declare maintenanceStaffs?: GeneralStaff[];
  declare operationStaffs?: GeneralStaff[];
  declare facilityLogs?: FacilityLog[];
  declare events?: Event[];
  declare customerReportLogs?:CustomerReportLog[];

  declare getFacility: BelongsToGetAssociationMixin<Facility>;
  declare setFacility: BelongsToSetAssociationMixin<Facility, number>;

  declare getPreviousTramStop: BelongsToGetAssociationMixin<InHouse>;
  declare setPreviousTramStop: BelongsToSetAssociationMixin<InHouse, number>;

  declare getNextTramStop: HasOneGetAssociationMixin<InHouse>;
  declare setNextTramStop: HasOneSetAssociationMixin<InHouse, number>;

  declare getMaintenanceStaffs: HasManyGetAssociationsMixin<GeneralStaff[]>;
  declare addMaintenanceStaff: HasManyAddAssociationMixin<GeneralStaff, number>;
  declare setMaintenanceStaffs: HasManySetAssociationsMixin<GeneralStaff[], number>;
  declare removeMaintenanceStaff: HasManyRemoveAssociationMixin<GeneralStaff, number>;

  declare getOperationStaffs: HasManyGetAssociationsMixin<GeneralStaff[]>;
  declare addOperationStaff: HasManyAddAssociationMixin<GeneralStaff,number>;
  declare setOperationStaffs: HasManySetAssociationsMixin<GeneralStaff[],number>;
  declare removeOperationStaff: HasManyRemoveAssociationMixin<GeneralStaff,number>;

  declare getFacilityLogs: HasManyGetAssociationsMixin<FacilityLog[]>;
  declare addFacilityLog: HasManyAddAssociationMixin<FacilityLog, number>;
  declare setFacilityLogs: HasManySetAssociationsMixin<FacilityLog[], number>;
  declare removeFacilityLog: HasManyRemoveAssociationMixin<FacilityLog, number>;

  declare getEvents: HasManyGetAssociationsMixin<Event[]>;
  declare addEvent: HasManyAddAssociationMixin<Event, number>;
  declare setEvents: HasManySetAssociationsMixin<Event[], number>;
  declare removeEvent: HasManyRemoveAssociationMixin<Event, number>;
  
  declare getCustomerReportLogs: HasManyGetAssociationsMixin<CustomerReportLog[]>;
  declare addCustomerReportLog: HasManyAddAssociationMixin<CustomerReportLog, number>;
  declare setCustomerReportLogs: HasManySetAssociationsMixin<CustomerReportLog[], number>;
  declare removeCustomerReportLog: HasManyRemoveAssociationMixin<CustomerReportLog, number>;

  // public toJSON() {
  //     // Can control default values returned rather than manually populating json, removing secrets
  //     // Similar idea albert more useful when compared to java's toString
  //     return {...this.get(), EmployeeEmployeeId: undefined}
  // }
}

InHouse.init(
  {
    lastMaintained: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
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
    facilityType: {
      type: DataTypes.ENUM,
      values: Object.values(FacilityType),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "inHouse", // We need to choose the model name
  },
);

export { InHouse };
