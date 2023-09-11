
import {DataTypes, Model, InferAttributes, InferCreationAttributes,
    HasManySetAssociationsMixin, HasManyGetAssociationsMixin} from "Sequelize";
import {conn} from '../db';
import {PresentationContainer, PresentationMethod, PresentationLocation, AnimalGrowthState} from './enumerated';
import { Species } from "./species";

class SpeciesEnclosureNeed extends Model<InferAttributes<SpeciesEnclosureNeed>, InferCreationAttributes<SpeciesEnclosureNeed>> {
    declare speciesEnclosureNeedId: number;
    declare smallExhibitHeightRequired: number; // nullable
    declare minLandAreaRequired: number;
    declare minWaterAreaRequired: number;
    declare acceptableTempMin: number;
    declare acceptableTempMax: number;
    declare acceptableHumidityMin: number;
    declare acceptableHumidityMax: number;
    declare recommendedStandOffBarrierDistMetres: number;
    declare plantationCoveragePercent: number;

    declare species?: Species;

    declare getSpecies: HasManyGetAssociationsMixin<Species>;
    declare setSpecies: HasManySetAssociationsMixin<Species, number>;
}

SpeciesEnclosureNeed.init({
        speciesEnclosureNeedId: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true
        },
        smallExhibitHeightRequired: {
            type: DataTypes.INTEGER
        },
        minLandAreaRequired: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        minWaterAreaRequired: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        acceptableTempMin: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        acceptableTempMax: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        acceptableHumidityMin: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        acceptableHumidityMax: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        recommendedStandOffBarrierDistMetres: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        plantationCoveragePercent: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
    }, {
        freezeTableName: true,
        timestamps: true,
        createdAt: true,
        updatedAt: 'updateTimestamp',
        sequelize: conn, // We need to pass the connection instance
        modelName: 'speciesEnclosureNeed' // We need to choose the model name
});

export {SpeciesEnclosureNeed};