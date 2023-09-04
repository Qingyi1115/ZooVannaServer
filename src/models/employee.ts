
import {DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute, 
    HasOneGetAssociationMixin, HasOneSetAssociationMixin} from "Sequelize";
import {conn} from '../db';
import {Keeper} from './keeper';
import {PlanningStaff} from './planningStaff';

function uppercaseFirst(str:string){return `${str[0].toUpperCase()}${str.substr(1)}`};

class Employee extends Model<InferAttributes<Employee>, InferCreationAttributes<Employee>> {
    declare employeeId: CreationOptional<number>;
    declare employeeName: string;
    declare employeeAddress:string;
    declare employeePhoneNumber: string;
    declare employeePasswordHash: string;
    declare employeeSalt: string;
    declare employeeDoorAccessCode: string;
    declare employeeEducation: string;
    declare role?: string;

    declare keeper?: Keeper | null;
    declare planningStaff?: PlanningStaff | null;

    declare getKeeper: HasOneGetAssociationMixin<Keeper>;
    declare setKeeper: HasOneSetAssociationMixin<Keeper, number>;

    declare getPlanningStaff: HasOneGetAssociationMixin<PlanningStaff>;
    declare setPlanningStaff: HasOneSetAssociationMixin<PlanningStaff, number>;

    static getTotalEmployees(){ // Example for static class functions
        return Employee.count()
    }

    public async getRole(){
        if (!this.role) {
            let keeper = await this.getKeeper();
            if (keeper){
                this.role = "keeper";
                return keeper;
            }
            let planningStaff = await this.getPlanningStaff();
            if (planningStaff){
                this.role = "planningStaff";
                return planningStaff;
            }
            return null;
        }else{
            // As we can see this method will save the role and in the future only call required method in the future, saving some time
            const mixinMethodName = `get${uppercaseFirst(this.role)}`;
            return (this as any)[mixinMethodName]();
        }
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
    },
    role:{
        type: DataTypes.STRING
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