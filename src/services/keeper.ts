import { validationErrorHandler } from "../helpers/errorHandler";
import { hash } from "../helpers/security";
import { Keeper } from "../models/keeper";
import { Employee } from "../models/employee";
import { Enclosure } from "../models/enclosure";
import { Token } from "../models/token";
import { CreationOptional, literal } from "Sequelize";

//might need to change implementation
export async function updateDetails(
  employeeId: CreationOptional<number>,
  enclosureId: CreationOptional<number>,
) {
  let employee = await Employee.findOne({
    where: { employeeId: employeeId },
  });

  if (employee) {
    let enclosure = await Enclosure.findOne({
      where: { enclosureId: enclosureId },
    });

    if (enclosure) {
      return await (await employee.getKeeper())?.addEnclosure(enclosure);
    }
    throw { message: "Enclosure does not exist" };
  }
  throw { message: "Employee does not exist" };
}

export async function removeEnclosure(
  employeeId: CreationOptional<number>,
  enclosureId: CreationOptional<number>,
) {
  let employee = await Employee.findOne({
    where: { employeeId: employeeId },
  });

  if (employee) {
    let enclosure = await Enclosure.findOne({
      where: { enclosureId: enclosureId },
    });

    if (enclosure) {
      let publicEvents = (await employee.getKeeper())?.zooEvents;
      let isNotFree = false;

      if (publicEvents) {
        for (const publicEvent of publicEvents) {
          if (await publicEvent.getEnclosure()) {
            isNotFree = true;
            break;
          }
        }
      }

      if (
        !isNotFree &&
        (await employee.getKeeper())?.zooEvents?.length != 0
      ) {
        isNotFree = true;
      }

      if (!isNotFree) {
        return await (await employee.getKeeper())?.removeEnclosure(enclosure);
      }
      throw {
        error: "There is currently event connected to this keeper",
      };
    }
    throw { message: "Enclosure does not exist" };
  }
  throw { message: "Employee does not exist" };
}

export async function updateKeeperType(
  employeeId: CreationOptional<number>,
  roleType: string,
) {
  let employee = await Employee.findOne({
    where: { employeeId: employeeId },
  });

  if (employee) {
    if (await employee.getKeeper()) {
      if (roleType == "KEEPER") {
        (await employee.getKeeper())?.setKeeper();
      } else if (roleType == "SENIOR KEEPER") {
        (await employee.getKeeper())?.setSeniorKeeper();
      } else {
        throw { message: "Such role type does not exist" };
      }
    } else {
      throw { message: "There is no keeper role in this account" };
    }
  } else {
    throw { message: "Employee does not exist" };
  }
}
