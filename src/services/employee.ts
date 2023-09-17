import { validationErrorHandler } from "../helpers/errorHandler";
import { hash } from "../helpers/security";
import { Employee } from "../models/employee";
import {
  CreationOptional
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
    if(result.dateOfResignation == null) {
      return result;
    }
    throw { error: "Employee has been disabled"};
  }
  throw {error: "Employee does not exist"};
}

export async function employeeLogin(
  employeeEmail: string,
  password: string,
): Promise<boolean> {
  return !!(
    await Employee.findOne({ where: { employeeEmail: employeeEmail } })
  )?.testPassword(password);
}

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
  return Employee.findAll({where: {dateOfResignation : null}});
}
