
import {DataTypes, Model, InferAttributes, InferCreationAttributes,
    BelongsToGetAssociationMixin, BelongsToSetAssociationMixin,
    HasOneGetAssociationMixin, HasOneSetAssociationMixin,
    HasManyGetAssociationsMixin, HasManySetAssociationsMixin} from "Sequelize";
import {conn} from '../db';
import { Facility } from "./facility";
import { FacilityType } from './enumerated';
import { GeneralStaff } from "./generalStaff";

class InHouse extends Model<InferAttributes<InHouse>, InferCreationAttributes<InHouse>> {
    declare lastMaintained: Date;
    declare isPaid: Boolean;
    declare maxAccommodationSize: number;
    declare hasAirCon: Boolean;
    declare facilityType: FacilityType;
    
    declare facility?: Facility;
    declare previousTramStop?: InHouse;
    declare nextTramStop?: InHouse;
    declare maintenanceStaff?: GeneralStaff;
    declare operationStaff?: GeneralStaff;
    
    declare getFacility: BelongsToGetAssociationMixin<Facility>;
    declare setFacility: BelongsToSetAssociationMixin<Facility, number>;

    declare getPreviousTramStop: BelongsToGetAssociationMixin<InHouse>;
    declare setPreviousTramStop: BelongsToSetAssociationMixin<InHouse, number>;

    declare getNextTramStop: HasOneGetAssociationMixin<InHouse>;
    declare setNextTramStop: HasOneSetAssociationMixin<InHouse, number>;

    declare getMaintenanceStaff: HasManyGetAssociationsMixin<GeneralStaff>;
    declare setMaintenanceStaff: HasManySetAssociationsMixin<GeneralStaff, number>;

    declare getOperationStaff: HasManyGetAssociationsMixin<GeneralStaff>;
    declare setOperationStaff: HasManySetAssociationsMixin<GeneralStaff, number>;



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