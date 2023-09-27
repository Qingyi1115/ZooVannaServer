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
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
} from "Sequelize";
import { conn } from "../db";
import { Facility } from "./facility";
import { FacilityType } from "./enumerated";
import { GeneralStaff } from "./generalStaff";
import { FacilityLog } from "./facilityLog";
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
  declare customerReportLogs?: CustomerReportLog[];

  declare getFacility: BelongsToGetAssociationMixin<Facility>;
  declare setFacility: BelongsToSetAssociationMixin<Facility, number>;

  declare getPreviousTramStop: BelongsToGetAssociationMixin<InHouse>;
  declare setPreviousTramStop: BelongsToSetAssociationMixin<InHouse, number>;

  declare getNextTramStop: HasOneGetAssociationMixin<InHouse>;
  declare setNextTramStop: HasOneSetAssociationMixin<InHouse, number>;

  declare getMaintenanceStaffs: BelongsToManyGetAssociationsMixin<GeneralStaff>;
  declare addMaintenanceStaff: BelongsToManyAddAssociationMixin<GeneralStaff, number>;
  declare setMaintenanceStaffs: BelongsToManySetAssociationsMixin<GeneralStaff[], number>;
  declare removeMaintenanceStaff: BelongsToManyRemoveAssociationMixin<GeneralStaff, number>;

  declare getOperationStaffs: HasManyGetAssociationsMixin<GeneralStaff[]>;
  declare addOperationStaff: HasManyAddAssociationMixin<GeneralStaff, number>;
  declare setOperationStaffs: HasManySetAssociationsMixin<GeneralStaff[], number>;
  declare removeOperationStaff: HasManyRemoveAssociationMixin<GeneralStaff, number>;

  declare getFacilityLogs: HasManyGetAssociationsMixin<FacilityLog>;
  declare addFacilityLog: HasManyAddAssociationMixin<FacilityLog, number>;
  declare setFacilityLogs: HasManySetAssociationsMixin<FacilityLog, number>;
  declare removeFacilityLog: HasManyRemoveAssociationMixin<FacilityLog, number>;

  declare getEvents: HasManyGetAssociationsMixin<Event[]>;
  declare addEvent: HasManyAddAssociationMixin<Event, number>;
  declare setEvents: HasManySetAssociationsMixin<Event[], number>;
  declare removeEvent: HasManyRemoveAssociationMixin<Event, number>;

  declare getCustomerReportLogs: HasManyGetAssociationsMixin<CustomerReportLog[]>;
  declare addCustomerReportLog: HasManyAddAssociationMixin<CustomerReportLog, number>;
  declare setCustomerReportLogs: HasManySetAssociationsMixin<CustomerReportLog[], number>;
  declare removeCustomerReportLog: HasManyRemoveAssociationMixin<CustomerReportLog, number>;

  public toJSON() {
    return {
      ...this.get()
    }
  }

  public async toFullJSON() {
    return {
      ...this.get(),
      facility: (await this.getFacility()),
      previousTramStop: (await this.getPreviousTramStop()),
      nextTramStop: (await this.getNextTramStop()),
      maintenanceStaffs: await (this.getMaintenanceStaffs()),
      operationStaffs: await (this.getOperationStaffs()),
      facilityLogs: await (this.getFacilityLogs()),
      events: await (this.getEvents()),
      customerReportLogs: await (this.getCustomerReportLogs())
    };
  }
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
