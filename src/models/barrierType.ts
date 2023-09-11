
import {DataTypes, Model, InferAttributes, InferCreationAttributes,
    BelongsToSetAssociationMixin,
    BelongsToGetAssociationMixin} from "Sequelize";
import {conn} from '../db';
import { Enclosure } from "./enclosure";

class BarrierType extends Model<InferAttributes<BarrierType>, InferCreationAttributes<BarrierType>> {
    declare barrierTypeId: number;
    declare barrierMaterialName: string;
    declare barrierTransparency: number;
    declare climbable: boolean;
    declare watertight: boolean;
    declare remarks: string;

    declare enclosure?: Enclosure;

    declare getEnclosure: BelongsToGetAssociationMixin<Enclosure>;
    declare setEnclosure: BelongsToSetAssociationMixin<Enclosure, number>;
}

BarrierType.init({
    barrierTypeId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    barrierMaterialName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    barrierTransparency: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    climbable: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    watertight: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    remarks: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: 'updateTimestamp',
    sequelize: conn, // We need to pass the connection instance
    modelName: 'barrierType' // We need to choose the model name
});

export {BarrierType};