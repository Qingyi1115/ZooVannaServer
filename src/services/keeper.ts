import { validationErrorHandler } from "../helpers/errorHandler";
import { hash } from "../helpers/security";
import { Keeper } from "../models/keeper";
import { Employee} from "../models/employee"
import { Enclosure } from "../models/enclosure"
import { Token } from "../models/token";
import {
  CreationOptional,
  literal
} from "Sequelize";

//might need to change implementation
export async function updateDetails(
    employeeId: CreationOptional<number>,
    enclosureId: CreationOptional<number>,
  ) {

    let employee = await Employee.findOne({
        where: {employeeId: employeeId},
    })

    if(employee) {
        let enclosure = await Enclosure.findOne({
            where: {enclosureId: enclosureId},
        });

        if(enclosure) {
            return await (await employee.getKeeper())?.addEnclosure(enclosure);  
        }
        throw {error: "Enclosure does not exist"};
    }
    throw {error: "Employee does not exist"};
  }

export async function removeEnclosure(
    employeeId: CreationOptional<number>,
    enclosureId: CreationOptional<number>,
) {
    let employee = await Employee.findOne({
        where: {employeeId: employeeId},
    })

    if(employee) {
        let enclosure = await Enclosure.findOne({
            where: {enclosureId: enclosureId},
        });

        if(enclosure) {
            //let publicEvents = await (await employee.getKeeper())?.getPublicEvents();
            const isFree = false;
            


            if(!isFree) {
                return await (await employee.getKeeper())?.removeEnclosure(enclosure);
            } 
            throw {
                error: "There is currently event connected to this keeper",
            }
        }
        throw {error: "Enclosure does not exist"};
    }
    throw {error: "Employee does not exist"};
}