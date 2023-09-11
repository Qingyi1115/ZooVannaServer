
import {DataTypes, Model, InferAttributes, InferCreationAttributes,
    BelongsToSetAssociationMixin,
    BelongsToGetAssociationMixin} from "Sequelize";
import {conn} from '../db';
import { Enclosure } from "./enclosure";
import { Biome } from "./enumerated";

class Plantation extends Model<InferAttributes<Plantation>, InferCreationAttributes<Plantation>> {
    declare plantationId: number;
    declare name: string;
    declare biome: Biome;

    declare enclosure?: Enclosure;

    declare getEnclosure: BelongsToGetAssociationMixin<Enclosure>;
    declare setEnclosure: BelongsToSetAssociationMixin<Enclosure, number>;
}

Plantation.init({
    plantationId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    biome: {
        type:   DataTypes.ENUM,
        values: Object.values(Biome),
        allowNull: false
    },
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: 'updateTimestamp',
    sequelize: conn, // We need to pass the connection instance
    modelName: 'plantation' // We need to choose the model name
});

export {Plantation};