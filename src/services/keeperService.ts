import { CreationOptional } from "Sequelize";
import { Employee } from "../models/Employee";
import { Enclosure } from "../models/Enclosure";
import { Keeper } from "../models/Keeper";

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

export async function removeEnclosure(employeeId: number, enclosureId: number) {
  let employee = await Employee.findOne({
    where: { employeeId: employeeId },
  });

  if (employee) {
    let enclosure = await Enclosure.findOne({
      where: { enclosureId: enclosureId },
    });

    if (enclosure) {
      let publicEvents = (await employee.getKeeper())?.zooEvents;

      if (publicEvents) {
        for (const publicEvent of publicEvents) {
          if ((await publicEvent.getEnclosure()).enclosureId == enclosureId) {
            throw {
              message:
                "This keeper is currently managing an event at the enclosure!",
            };
          }
        }
      }

      {
        /*if (!isNotFree && (await employee.getKeeper())?.zooEvents?.length != 0) {
        isNotFree = true;
      }

      if (!isNotFree) {
        return await (await employee.getKeeper())?.removeEnclosure(enclosure);
      }
      throw {
        error: "There is currently event connected to this keeper",
      };
    */
      }
      return await (await employee.getKeeper())?.removeEnclosure(enclosure);
    }
    throw { message: "Enclosure does not exist" };
  }
  throw { message: "Employee does not exist" };
}

export async function getAllKeepers() {
  return Keeper.findAll({
    include: {
      association: "employee",
      required: true,
    },
  });
}

export async function updateKeeperType(employeeId: number, roleType: string) {
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
