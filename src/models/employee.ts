
import {DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute, 
    HasOneGetAssociationMixin, HasOneSetAssociationMixin} from "Sequelize";
import {conn} from '../db';
import {Keeper} from './keeper';
import {PlanningStaff} from './planningStaff';
import {GeneralStaff} from './generalStaff';
import crypto from "crypto";

function hash(string:string):string {return crypto.createHash('sha256').update(string).digest('hex');}

function uppercaseFirst(str:string){return `${str[0].toUpperCase()}${str.substr(1)}`};

function convertString(doorAccessCode:number):string{return ('0'.repeat(6-doorAccessCode.toString().length)) + doorAccessCode.toString()}

class Employee extends Model<InferAttributes<Employee>, InferCreationAttributes<Employee>> {
    declare employeeId: CreationOptional<number>;
    declare employeeName: string;
    declare employeeEmail: string;
    declare employeeAddress:string;
    declare employeePhoneNumber: string;
    declare employeePasswordHash: string;
    declare employeeSalt: string;
    declare employeeDoorAccessCode: string;
    declare employeeEducation: string;
    declare hasAdminPrivileges: boolean;
    
    declare keeper?: Keeper | null;
    declare planningStaff?: PlanningStaff | null;
    declare generalStaff?: GeneralStaff | null;

    declare getKeeper: HasOneGetAssociationMixin<Keeper>;
    declare setKeeper: HasOneSetAssociationMixin<Keeper, number>;

    declare getPlanningStaff: HasOneGetAssociationMixin<PlanningStaff>;
    declare setPlanningStaff: HasOneSetAssociationMixin<PlanningStaff, number>;

    declare getGeneralStaff: HasOneGetAssociationMixin<GeneralStaff>;
    declare setGeneralStaff: HasOneSetAssociationMixin<GeneralStaff, number>;

    static getTotalEmployees(){ // Example for static class functions
        return Employee.count();
    }

    public testPassword(password:string){
        return !hash(password + this.employeeSalt).localeCompare(this.employeePasswordHash)
    }

    static generateEmployeeSalt(){
        return (Math.random() + 1).toString(36).substring(7);
    }

    static getHash(password:string, salt:string){
        return hash(password + salt);
    }

    static async generateNewDoorAccessCode(){
        let accessCode = convertString(Math.floor(Math.random() * 999999));
        while ((await Employee.findOne({where:{employeeDoorAccessCode:accessCode}})) != null){
            accessCode = convertString(Math.floor(Math.random() * 999999));
        }
        return accessCode;
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
    employeeEmail: {
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
    },
    hasAdminPrivileges:{
        type: DataTypes.BOOLEAN,
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