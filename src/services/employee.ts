import { Console } from "console";
import { validationErrorHandler } from "../helpers/errorHandler";
import { hash } from "../helpers/security";
import { Employee } from "../models/employee";
import {
  CreationOptional,
  literal
} from "Sequelize";

export async function createNewEmployee(
  employeeName: string,
  employeeAddress: string,
  employeeEmail: string,
  employeePhoneNumber: string,
  employeeEducation: string,
  isAccountManager: Boolean,
  role: string,
  roleJson: any,
) {
  const randomPassword =
    (Math.random() + 1).toString(36).substring(7) +
    (Math.random() + 1).toString(36).substring(7);
  const randomSalt = (Math.random() + 1).toString(36).substring(7);

  const employee_details: any = {
    employeeName: employeeName,
    employeeAddress: employeeAddress,
    employeeEmail: employeeEmail,
    employeePhoneNumber: employeePhoneNumber,
    employeePasswordHash: hash(randomPassword + randomSalt),
    employeeSalt: randomSalt,
    employeeDoorAccessCode: await Employee.generateNewDoorAccessCode(),
    employeeEducation: employeeEducation,
    isAccountManager: isAccountManager,
  };
  employee_details[role] = roleJson;
  try {
    let newEmployee = await Employee.create(employee_details, {
      include: {
        association: role,
      },
    });
    return [randomPassword, newEmployee.toJSON()];
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function resetPassword(
  employeeId: CreationOptional<number>
) {
  let result = await Employee.findOne({
    where: {employeeId: employeeId},
  });

  const randomPassword =
    (Math.random() + 1).toString(36).substring(7) +
    (Math.random() + 1).toString(36).substring(7);

  if(result) {
    result.updatePassword(randomPassword);
    return randomPassword;
  }
  throw { error: "Employee does not exist"};
}

export async function findEmployeeByEmail(employeeEmail: string) {
  let result = await Employee.findOne({
    where: { employeeEmail: employeeEmail },
  });
  if (result) {
    return result;
  }
  throw { error: "Invalid email!" };
}

export async function findEmployeeById(employeeId: CreationOptional<number>) {
  let result = await Employee.findOne({
    where: { employeeId: employeeId},
  });

  if(result) {
    return result;
  }
  throw {error: "Employee does not exist"};
}

export async function employeeLogin(
  employeeEmail: string,
  password: string,
): Promise<boolean> {
  let result = await Employee.findOne({ where: {employeeEmail: employeeEmail}});
  if(result) {
    if(result.dateOfResignation == null) {
      return result.testPassword(password);
    }
    throw {
      error: "Your account has been disabled!",
    }
  }
  throw {
    error: "Employee does not exist",
  };
}

/*export async function employeeLogin(
  employeeEmail: string,
  password: string,
): Promise<boolean> {
  return !!(
    await Employee.findOne({ where: { employeeEmail: employeeEmail } })
  )?.testPassword(password);
}*/

export async function setAsAccountManager(
  employeeId: CreationOptional<number>
) {
  let employee = await Employee.findOne({
    where: {employeeId: employeeId},
  });

  if(employee) {
    if(!employee.isAccountManager) {
      if(employee.dateOfResignation == null) {
        return employee.setAsAccountManager();
      }
      throw {
        error: "Employee has been disabled"
      };
    }
    throw {
      error: "Employee is already Account Manager"
    };
  }
  throw {
    error: "Employee does not exist"
  };
}

export async function getAllEmployees() {
  return Employee.findAll({
    order: [
      [literal('dateOfResignation IS NULL'), "ASC"],
      ["dateOfResignation", "DESC"],
    ],
  });
}

export async function getEmployee(
  employeeId: CreationOptional<number>
) {
  let employee = await Employee.findOne({
    where: {employeeId: employeeId},
  });

  if(employee) {
    return employee;
  }
  throw {
    error: "Employee does not exist"
  };
}

export async function disableEmployeeAccount(
  employeeId: CreationOptional<number>
) {
  let employee = await Employee.findOne({
    where: {employeeId: employeeId},
  })

  if(employee) {
    if(employee.dateOfResignation == null) {
      return employee.disableAccount();
    }
    throw{
      error: "Employee account was disabled before on "+ employee.dateOfResignation,
    };
  }
  throw {
    error: "Employee does not exist"
  };
}


