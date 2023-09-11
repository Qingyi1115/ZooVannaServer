
import {DataTypes, Model, InferAttributes, InferCreationAttributes,
    BelongsToGetAssociationMixin, BelongsToSetAssociationMixin,
    HasManySetAssociationsMixin, HasManyGetAssociationsMixin, HasManyAddAssociationMixin} from "Sequelize";
import {conn} from '../db';
import { Facility } from "./facility";
import { Specialization } from './enumerated';
import { MedicalSupply } from "./medicalSupply";
import { Animal } from "./animal";


class AnimalClinic extends Model<InferAttributes<AnimalClinic>, InferCreationAttributes<AnimalClinic>> {
    declare specializationType: Specialization;
    
    declare facility?: Facility;
    declare medicalSupply?: MedicalSupply;
    declare animals? : Animal[];
    
    declare getFacility: BelongsToGetAssociationMixin<Facility>;
    declare setFacility: BelongsToSetAssociationMixin<Facility, number>;

    declare getMedicalSupply: BelongsToGetAssociationMixin<MedicalSupply>;
    declare setMedicalSupply: BelongsToSetAssociationMixin<MedicalSupply, number>;
    
    declare getAnimals: HasManyGetAssociationsMixin<Animal[]>;
    declare addAnimal: HasManyAddAssociationMixin<Animal[], number>;
    declare setAnimals: HasManySetAssociationsMixin<Animal[], number>;

    // public toJSON() { 
    //     // Can control default values returned rather than manually populating json, removing secrets
    //     // Similar idea albert more useful when compared to java's toString
    //     return {...this.get(), EmployeeEmployeeId: undefined}
    // }
}

AnimalClinic.init({
    specializationType: {
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
    modelName: 'animalClinic' // We need to choose the model name
});

export {AnimalClinic};