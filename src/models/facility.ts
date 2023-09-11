
import {DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute, 
    HasManyGetAssociationsMixin, HasManySetAssociationsMixin, HasManyAddAssociationMixin,
    HasOneGetAssociationMixin, HasOneSetAssociationMixin} from "Sequelize";
import {conn} from '../db';
import {Sensor} from './sensor';
import{InHouse} from'./inHouse';
import { ThirdParty } from "./thirdParty";
import { AnimalClinic } from "./animalClinics";

function uppercaseFirst(str:string){return `${str[0].toUpperCase()}${str.substr(1)}`};

class Facility extends Model<InferAttributes<Facility>, InferCreationAttributes<Facility>> {
    declare facilityId: CreationOptional<number>;
    declare facilityName: string;
    declare xCoordinate:number;
    declare yCoordinate: number;

    declare facilityDetail?: string;

    declare sensors?: Sensor[];
    declare inHouse?: InHouse;
    declare thirdParty?: ThirdParty;
    declare animalClinic?: AnimalClinic;

    declare getSensors: HasManyGetAssociationsMixin<Sensor>;
    declare setSensors: HasManySetAssociationsMixin<Sensor, number>;
    declare addSensor: HasManyAddAssociationMixin<Sensor, number>;
    
    declare getInHouse: HasOneGetAssociationMixin<InHouse>;
    declare setInHouse: HasOneSetAssociationMixin<InHouse, number>;

    declare getThirdParty: HasOneGetAssociationMixin<ThirdParty>;
    declare setThirdParty: HasOneSetAssociationMixin<ThirdParty, number>;

    declare getAnimalClinic: HasOneGetAssociationMixin<AnimalClinic>;
    declare setAnimalClinic: HasOneSetAssociationMixin<AnimalClinic, number>;

    public async getFacilityDetail(){
        if (!this.facilityDetail) {
            let inHouse = await this.getInHouse();
            if (inHouse){
                this.facilityDetail = "inHouse";
                return inHouse;
            }
            let thirdParty = await this.getThirdParty();
            if (thirdParty){
                this.facilityDetail = "thirdParty";
                return thirdParty;
            }
            let animalClinic = await this.getAnimalClinic();
            if (animalClinic){
                this.facilityDetail = "animalClinic";
                return animalClinic;
            }
        }
        const mixinMethodName = `get${uppercaseFirst(this.facilityDetail ?? "")}`;
        return (this as any)[mixinMethodName]();
    }
    
    public toJSON() { 
        // Can control default values returned rather than manually populating json, removing secrets
        // Similar idea albert more useful when compared to java's toString
        return this.get() //{...this.get(), employeePasswordHash: undefined, employeeSalt: undefined}
    }
}

Facility.init({
    facilityId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    facilityName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    xCoordinate: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    yCoordinate: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    facilityDetail:{
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: 'updateTimestamp',
    sequelize: conn, // We need to pass the connection instance
    modelName: 'facility' // We need to choose the model name
});

export {Facility};