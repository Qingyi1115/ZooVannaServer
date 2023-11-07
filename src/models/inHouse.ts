import {
  BelongsToGetAssociationMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManySetAssociationsMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "Sequelize";
import { conn } from "../db";
import { CustomerReportLog } from "./CustomerReportLog";
import { FacilityType } from "./Enumerated";
import { Facility } from "./Facility";
import { FacilityLog } from "./FacilityLog";
import { GeneralStaff } from "./GeneralStaff";
import { ZooEvent } from "./ZooEvent";
import { PublicEvent } from "./PublicEvent";

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
  declare zooEvents?: ZooEvent[];
  declare customerReportLogs?: CustomerReportLog[];
  declare publicEvents?: PublicEvent[];

  declare getFacility: BelongsToGetAssociationMixin<Facility>;
  declare setFacility: BelongsToSetAssociationMixin<Facility, number>;

  declare getPreviousTramStop: BelongsToGetAssociationMixin<InHouse>;
  declare setPreviousTramStop: BelongsToSetAssociationMixin<InHouse, number>;

  declare getNextTramStop: HasOneGetAssociationMixin<InHouse>;
  declare setNextTramStop: HasOneSetAssociationMixin<InHouse, number>;

  declare getMaintenanceStaffs: BelongsToManyGetAssociationsMixin<GeneralStaff>;
  declare addMaintenanceStaff: BelongsToManyAddAssociationMixin<GeneralStaff, number>;
  declare setMaintenanceStaffs: BelongsToManySetAssociationsMixin<GeneralStaff, number>;
  declare removeMaintenanceStaff: BelongsToManyRemoveAssociationMixin<GeneralStaff, number>;

  declare getOperationStaffs: HasManyGetAssociationsMixin<GeneralStaff>;
  declare addOperationStaff: HasManyAddAssociationMixin<GeneralStaff, number>;
  declare setOperationStaffs: HasManySetAssociationsMixin<GeneralStaff, number>;
  declare removeOperationStaff: HasManyRemoveAssociationMixin<GeneralStaff, number>;

  declare getFacilityLogs: HasManyGetAssociationsMixin<FacilityLog>;
  declare addFacilityLog: HasManyAddAssociationMixin<FacilityLog, number>;
  declare setFacilityLogs: HasManySetAssociationsMixin<FacilityLog, number>;
  declare removeFacilityLog: HasManyRemoveAssociationMixin<FacilityLog, number>;

  declare getZooEvents: HasManyGetAssociationsMixin<ZooEvent>;
  declare addZooEvent: HasManyAddAssociationMixin<ZooEvent, number>;
  declare setZooEvents: HasManySetAssociationsMixin<ZooEvent, number>;
  declare removeZooEvent: HasManyRemoveAssociationMixin<ZooEvent, number>;

  declare getCustomerReportLogs: HasManyGetAssociationsMixin<CustomerReportLog>;
  declare addCustomerReportLog: HasManyAddAssociationMixin<CustomerReportLog, number>;
  declare setCustomerReportLogs: HasManySetAssociationsMixin<CustomerReportLog, number>;
  declare removeCustomerReportLog: HasManyRemoveAssociationMixin<CustomerReportLog, number>;

  declare getPublicEvents: HasManyGetAssociationsMixin<PublicEvent>;
  declare addPublicEvent: HasManyAddAssociationMixin<PublicEvent, number>;
  declare setPublicEvents: HasManySetAssociationsMixin<PublicEvent, number>;
  declare removePublicEvent: HasManyRemoveAssociationMixin<PublicEvent, number>;

  public toJSON() {
    return {
      ...this.get()
    }
  }

  public async toFullJSON() {
    return {
      ...this.get(),
      facility: (await this.getFacility())?.toJSON(),
      previousTramStop: (await this.getPreviousTramStop())?.toJSON(),
      nextTramStop: (await this.getNextTramStop())?.toJSON(),
      maintenanceStaffs: (await this.getMaintenanceStaffs())?.map(staff => staff.toJSON()),
      operationStaffs: (await this.getOperationStaffs())?.map(staff => staff.toJSON()),
      facilityLogs: (await this.getFacilityLogs())?.map(log => log.toJSON()),
      zooEvent: (await this.getZooEvents())?.map(event => event.toJSON()),
      customerReportLogs: (await this.getCustomerReportLogs())?.map(log => log.toJSON()),
      lastMaintained: this.lastMaintained?.getTime(),
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

