
import {DataTypes, Model, InferAttributes, InferCreationAttributes,
    HasManySetAssociationsMixin, HasManyGetAssociationsMixin} from "Sequelize";
import {conn} from '../db';
import { SpeciesEnclosureNeed } from "./speciesEnclosureNeed";
import { Enclosure } from "./enclosure";

class TerrainDistribution extends Model<InferAttributes<TerrainDistribution>, InferCreationAttributes<TerrainDistribution>> {
    declare terrainDistributionId: number;
    declare longGrassPercent: number;
    declare shortGrassPercent: number;
    declare rockPercent: number;
    declare sandPercent: number;
    declare snowPercent: number;
    declare soilPercent: number;

    declare speciesEnclosureNeedMins?: SpeciesEnclosureNeed;
    declare speciesEnclosureNeedMaxs?: SpeciesEnclosureNeed;
    declare enclosure?: Enclosure;

    declare getSpeciesEnclosureNeedMins: HasManyGetAssociationsMixin<SpeciesEnclosureNeed>;
    declare setSpeciesEnclosureNeedMins: HasManySetAssociationsMixin<SpeciesEnclosureNeed, number>;

    declare getSpeciesEnclosureNeedMaxs: HasManyGetAssociationsMixin<SpeciesEnclosureNeed>;
    declare setSpeciesEnclosureNeedMaxs: HasManySetAssociationsMixin<SpeciesEnclosureNeed, number>;

    declare getEnclosure: HasManyGetAssociationsMixin<Enclosure>;
    declare setEnclosure: HasManySetAssociationsMixin<Enclosure, number>;
}

TerrainDistribution.init({
    terrainDistributionId: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true
        },
        longGrassPercent: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        shortGrassPercent: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rockPercent: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sandPercent: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        snowPercent: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        soilPercent: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        freezeTableName: true,
        timestamps: true,
        createdAt: true,
        updatedAt: 'updateTimestamp',
        sequelize: conn, // We need to pass the connection instance
        modelName: 'terrainDistribution' // We need to choose the model name
});

export {TerrainDistribution};