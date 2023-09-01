
import {DataTypes, Model, InferAttributes, InferCreationAttributes} from "Sequelize";
import {conn} from '../db';
import {Employee} from './employee';
import {KeeperType} from './enumerated';


class Keeper extends Model<InferAttributes<Keeper>, InferCreationAttributes<Keeper>> {
    declare employee: Employee;
    declare juniors: [Keeper] | null; // Not required
    declare leader: Keeper | null;
    declare keeperType: KeeperType;
}

Keeper.init({
    keeperType: {
        type:   DataTypes.ENUM,
        values: Object.values(KeeperType)
    },
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: 'updateTimestamp',
    sequelize: conn, // We need to pass the connection instance
    modelName: 'Keeper' // We need to choose the model name
});

export {Keeper};