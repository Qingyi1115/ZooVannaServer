
import {DataTypes, Model, InferAttributes, InferCreationAttributes,
    BelongsToGetAssociationMixin, BelongsToSetAssociationMixin,
    HasOneGetAssociationMixin, HasOneSetAssociationMixin,
    HasManyGetAssociationsMixin, HasManySetAssociationsMixin, HasManyAddAssociationMixin} from "Sequelize";
import {conn} from '../db';
import { Facility } from "./facility";
import { FacilityType } from './enumerated';
import { GeneralStaff } from "./generalStaff";
import { FacilityLog } from "./faciltiyLog";

class InHouse extends Model<InferAttributes<InHouse>, InferCreationAttributes<InHouse>> {
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

    declare getFacility: BelongsToGetAssociationMixin<Facility>;
    declare setFacility: BelongsToSetAssociationMixin<Facility, number>;

    declare getPreviousTramStop: BelongsToGetAssociationMixin<InHouse>;
    declare setPreviousTramStop: BelongsToSetAssociationMixin<InHouse, number>;

    declare getNextTramStop: HasOneGetAssociationMixin<InHouse>;
    declare setNextTramStop: HasOneSetAssociationMixin<InHouse, number>;

    declare getMaintenanceStaffs: HasManyGetAssociationsMixin<GeneralStaff[]>;
    declare setMaintenanceStaffs: HasManySetAssociationsMixin<GeneralStaff[], number>;

    declare getOperationStaffs: HasManyGetAssociationsMixin<GeneralStaff[]>;
    declare setOperationStaffs: HasManySetAssociationsMixin<GeneralStaff[], number>;
    
    declare getFacilityLogs: HasManyGetAssociationsMixin<FacilityLog[]>;
    declare setFacilityLogs: HasManySetAssociationsMixin<FacilityLog[], number>;
    
    declare getEvents: HasManyGetAssociationsMixin<Event[]>;
    declare addEvents: HasManyAddAssociationMixin<Event, number>;
    declare setEvents: HasManySetAssociationsMixin<Event[], number>;

    // public toJSON() { 
    //     // Can control default values returned rather than manually populating json, removing secrets
    //     // Similar idea albert more useful when compared to java's toString
    //     return {...this.get(), EmployeeEmployeeId: undefined}
    // }
}

InHouse.init({
    lastMaintained: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    isPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    maxAccommodationSize: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    hasAirCon: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    facilityType: {
        type:   DataTypes.ENUM,
        values: Object.values(FacilityType),
        allowNull: false
    },
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: 'updateTimestamp',
    sequelize: conn, // We need to pass the connection instance
    modelName: 'inHouse' // We need to choose the model name
});

export {InHouse};