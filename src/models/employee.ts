
import {DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes,
    HasOneGetAssociationMixin, HasOneSetAssociationMixin} from "Sequelize";
import {conn} from '../db';
import {Keeper} from './keeper';

class Employee extends Model<InferAttributes<Model>, InferCreationAttributes<Model>> {
    declare employeeId: CreationOptional<number>;
    declare employeeName: string;
    declare employeeAddress:string;
    declare employeePhoneNumber: string;
    declare employeePasswordHash: string;
    declare employeeSalt: string;
    declare employeeDoorAccessCode: string;
    declare employeeEducation: string;

    declare keeper: Keeper | null;

    declare getKeeper: HasOneGetAssociationMixin<Keeper>;
    declare setKeeper: HasOneSetAssociationMixin<Keeper, number>;

    static getTotalEmployees(){ // Example for static class functions
        return Employee.count()
    }

    public setName(name: string){ // Example to define instance functions
        this.employeeName = name;
    }

    public toJSON() { 
        // Can control default values returned rather than manually populating json, removing secrets
        // Similar idea albert more useful when compared to java's toString
        return {...this.get(), employeePasswordHash: undefined, employeeSalt: undefined}
    }
}

Employee.init({
    employeeId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    employeeName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
        
    },
    employeeAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    employeePhoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    employeePasswordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    employeeSalt: {
        type: DataTypes.STRING,
        allowNull: false
    },
    employeeDoorAccessCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    employeeEducation: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: 'updateTimestamp',
    sequelize: conn, // We need to pass the connection instance
    modelName: 'employee' // We need to choose the model name
});

export {Employee};