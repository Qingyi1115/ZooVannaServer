
import {DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute, 
    HasManyGetAssociationsMixin, HasManySetAssociationsMixin} from "Sequelize";
import {conn} from '../db';
import {Sensor} from './sensor';

function uppercaseFirst(str:string){return `${str[0].toUpperCase()}${str.substr(1)}`};

class Facility extends Model<InferAttributes<Facility>, InferCreationAttributes<Facility>> {
    declare facilityId: CreationOptional<number>;
    declare facilityName: string;
    declare xCoordinate:number;
    declare yCoordinate: number;

    declare facilityDetail?: string;

    declare sensors?: [Sensor] | null;

    declare getSensors: HasManyGetAssociationsMixin<Sensor>;
    declare setSensors: HasManySetAssociationsMixin<Sensor, number>;

    public async getFacilityDetail(){
        if (!this.facilityDetail) {
        //     let keeper = await this.getKeeper();
        //     if (keeper){
        //         this.role = "keeper";
        //         return keeper;
        //     }
        //     let planningStaff = await this.getPlanningStaff();
        //     if (planningStaff){
        //         this.role = "planningStaff";
        //         return planningStaff;
        //     }
            return null;
        }else{
            // As we can see this method will save the role and in the future only call required method in the future, saving some time
            const mixinMethodName = `get${uppercaseFirst(this.facilityDetail)}`;
            return (this as any)[mixinMethodName]();
        }
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