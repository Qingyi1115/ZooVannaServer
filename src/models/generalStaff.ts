
import {DataTypes, Model, InferAttributes, InferCreationAttributes,
    BelongsToGetAssociationMixin, BelongsToSetAssociationMixin} from "Sequelize";
import {conn} from '../db';
import {Employee} from './employee';
import {GeneralStaffType} from './enumerated';
import { InHouse } from "./inHouse";


class GeneralStaff extends Model<InferAttributes<GeneralStaff>, InferCreationAttributes<GeneralStaff>> {
    declare generalStaffType: GeneralStaffType;

    declare employee?: Employee;
    declare maintainedFacilities?: InHouse[];
    declare operatedFacility?: InHouse;

    declare getEmployee: BelongsToGetAssociationMixin<Employee>;
    declare setEmployee: BelongsToSetAssociationMixin<Employee, number>;

    declare getMaintainedFacilities: BelongsToGetAssociationMixin<InHouse[]>;
    declare setMaintainedFacilities: BelongsToSetAssociationMixin<InHouse[], number>;

    declare getOperatedFacility: BelongsToGetAssociationMixin<InHouse>;
    declare setOperatedFacility: BelongsToSetAssociationMixin<InHouse, number>;
}

GeneralStaff.init({
    generalStaffType: {
        type:   DataTypes.ENUM,
        values: Object.values(GeneralStaffType),
        allowNull: false
    },
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: 'updateTimestamp',
    sequelize: conn, // We need to pass the connection instance
    modelName: 'generalStaff' // We need to choose the model name
});

export {GeneralStaff};