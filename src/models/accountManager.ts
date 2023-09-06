import {DataTypes, Model, InferAttributes, InferCreationAttributes,
    BelongsToGetAssociationMixin, BelongsToSetAssociationMixin} from "Sequelize";
import {conn} from '../db';
import {Employee} from './employee';
import {GeneralStaffType} from './enumerated';


class AccountManager extends Model<InferAttributes<AccountManager>, InferCreationAttributes<AccountManager>> {
    declare employee?: Employee;

    declare getEmployee: BelongsToGetAssociationMixin<Employee>;
    declare setEmployee: BelongsToSetAssociationMixin<Employee, number>;
}

AccountManager.init({
    // ??
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: 'updateTimestamp',
    sequelize: conn, // We need to pass the connection instance
    modelName: 'generalStaff' // We need to choose the model name
});

export {AccountManager};