
import {DataTypes, Model, InferAttributes, InferCreationAttributes,
    HasManySetAssociationsMixin, HasManyGetAssociationsMixin,
    HasOneSetAssociationMixin, HasOneGetAssociationMixin,
    BelongsToGetAssociationMixin, BelongsToSetAssociationMixin} from "Sequelize";
import {conn} from '../db';
import {Employee} from './employee';
import {KeeperType, Specialization} from './enumerated';


class Keeper extends Model<InferAttributes<Keeper>, InferCreationAttributes<Keeper>> {
    declare keeperType: KeeperType;
    declare specialization: Specialization;

    declare employee?: Employee;

    declare getEmployee: BelongsToGetAssociationMixin<Employee>;
    declare setEmployee: BelongsToSetAssociationMixin<Employee, number>;

    // public toJSON() { 
    //     // Can control default values returned rather than manually populating json, removing secrets
    //     // Similar idea albert more useful when compared to java's toString
    //     return {...this.get(), EmployeeEmployeeId: undefined}
    // }
}

Keeper.init({
    keeperType: {
        type:   DataTypes.ENUM,
        values: Object.values(KeeperType),
        allowNull: false
    },
    specialization: {
        type:   DataTypes.ENUM,
        values: Object.values(Specialization),
        allowNull: false
    },
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: 'updateTimestamp',
    sequelize: conn, // We need to pass the connection instance
    modelName: 'keeper' // We need to choose the model name
});

export {Keeper};