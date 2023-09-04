
import {DataTypes, Model, InferAttributes, InferCreationAttributes,
    BelongsToGetAssociationMixin, BelongsToSetAssociationMixin} from "Sequelize";
import {conn} from '../db';
import {Employee} from './employee';
import {PlannerType} from './enumerated';


class PlanningStaff extends Model<InferAttributes<PlanningStaff>, InferCreationAttributes<PlanningStaff>> {
    declare plannerType: PlannerType;

    declare employee?: Employee;

    declare getEmployee: BelongsToGetAssociationMixin<Employee>;
    declare setEmployee: BelongsToSetAssociationMixin<Employee, number>;
}

PlanningStaff.init({
    plannerType: {
        type:   DataTypes.ENUM,
        values: Object.values(PlannerType),
        allowNull: false
    },
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: 'updateTimestamp',
    sequelize: conn, // We need to pass the connection instance
    modelName: 'planningStaff' // We need to choose the model name
});

export {PlanningStaff};