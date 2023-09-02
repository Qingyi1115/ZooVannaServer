
import {DataTypes, Model, InferAttributes, InferCreationAttributes, NonAttribute, 
    HasManySetAssociationsMixin, HasManyGetAssociationsMixin,
    HasOneSetAssociationMixin, HasOneGetAssociationMixin,
    BelongsToGetAssociationMixin, BelongsToSetAssociationMixin} from "Sequelize";
import {conn} from '../db';
import {Employee} from './employee';
import {KeeperType} from './enumerated';


class Keeper extends Model<InferAttributes<Keeper>, InferCreationAttributes<Keeper>> {
    declare keeperType: KeeperType;

    declare employee?: Employee;
    declare juniors?: Keeper[] | null; // Not required
    declare leader?: Keeper | null;

    declare getEmployee: BelongsToGetAssociationMixin<Employee>;
    declare setEmployee: BelongsToSetAssociationMixin<Employee, number>;

    declare getJuniors: HasManyGetAssociationsMixin<Keeper>;
    declare setJuniors: HasManySetAssociationsMixin<Keeper, number>;

    declare getLeader: HasOneGetAssociationMixin<Keeper>;
    declare setLeader: HasOneSetAssociationMixin<Keeper, number>;

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
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: 'updateTimestamp',
    sequelize: conn, // We need to pass the connection instance
    modelName: 'keeper' // We need to choose the model name
});

export {Keeper};