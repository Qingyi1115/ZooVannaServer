
import {DataTypes, Model, InferAttributes, InferCreationAttributes,
    HasManySetAssociationsMixin, HasManyGetAssociationsMixin} from "Sequelize";
import {conn} from '../db';
import {PresentationContainer, PresentationMethod, PresentationLocation, AnimalGrowthState} from './enumerated';
import { Species } from "./species";

class SpeciesDietNeed extends Model<InferAttributes<SpeciesDietNeed>, InferCreationAttributes<SpeciesDietNeed>> {
    declare speciesDietNeedId: number;
    declare amountPerMealGram: number;
    declare amountPerWeekGram: number;
    declare presentationContainer: PresentationContainer;
    declare presentationMethod: PresentationMethod;
    declare presentationLocation: PresentationLocation;
    declare animalGrowthState: AnimalGrowthState;

    declare species?: Species;

    declare getSpecies: HasManyGetAssociationsMixin<Species>;
    declare setSpecies: HasManySetAssociationsMixin<Species, number>;
}

SpeciesDietNeed.init({
    speciesDietNeedId: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
    amountPerMealGram: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    amountPerWeekGram: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    presentationContainer: {
        type:   DataTypes.ENUM,
        values: Object.values(PresentationContainer),
        allowNull: false
    },
    presentationMethod: {
        type:   DataTypes.ENUM,
        values: Object.values(PresentationMethod),
        allowNull: false
    },
    presentationLocation: {
        type:   DataTypes.ENUM,
        values: Object.values(PresentationLocation),
        allowNull: false
    },
    animalGrowthState: {
        type:   DataTypes.ENUM,
        values: Object.values(AnimalGrowthState),
        allowNull: false
    },
    }, {
        freezeTableName: true,
        timestamps: true,
        createdAt: true,
        updatedAt: 'updateTimestamp',
        sequelize: conn, // We need to pass the connection instance
        modelName: 'speciesDietNeed' // We need to choose the model name
});

export {SpeciesDietNeed};