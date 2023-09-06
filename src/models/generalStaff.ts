
import {DataTypes, Model, InferAttributes, InferCreationAttributes,
    BelongsToGetAssociationMixin, BelongsToSetAssociationMixin} from "Sequelize";
import {conn} from '../db';
import {Employee} from './employee';
import {GeneralStaffType} from './enumerated';


class GeneralStaff extends Model<InferAttributes<GeneralStaff>, InferCreationAttributes<GeneralStaff>> {
    declare generalStaffType: GeneralStaffType;

    declare employee?: Employee;

    declare getEmployee: BelongsToGetAssociationMixin<Employee>;
    declare setEmployee: BelongsToSetAssociationMixin<Employee, number>;
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