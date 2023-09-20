import { Console } from "console";
import { validationErrorHandler } from "../helpers/errorHandler";
import { hash } from "../helpers/security";
import { Employee } from "../models/employee";
import { Keeper } from "../models/keeper";
import { Token } from "../models/token";
import {
  CreationOptional,
  literal
} from "Sequelize";
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { PlanningStaff } from "../models/planningStaff";
import { GeneralStaff } from "../models/generalStaff";
import { Request, Response } from "express";

//Account Manager
export async function createNewEmployee(
  employeeName: string,
  employeeAddress: string,
  employeeEmail: string,
  employeePhoneNumber: string,
  employeeEducation: string,
  employeeBirthDate: Date,
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
    employeeBirthDate: employeeBirthDate,
  };
  employee_details[role] = roleJson;
  try {
    let newEmployee = await Employee.create(employee_details, {
      include: {
        association: role,
      },
    });

    await newEmployee.save();
    return [randomPassword, newEmployee.toJSON()];
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function resetPassword(
  employeeId: CreationOptional<number>,
  err:Function,
  success:Function
) {
  let result = await Employee.findOne({
    where: {employeeId: employeeId},
  });
  
  console.log("it is here");
  console.log(result);
  if(result) {
    if(result.dateOfResignation == null) {
      console.log("hel");
      const token = uuidv4();

      const resetTokens: any = {
        token: token,
        email: result.employeeEmail,
        createdAt: Date.now(),
        expiresAt: Date.now() + 600000, //expires in 10 minutes
      };

      try {
        let t = await Token.create(resetTokens);
        t.save();
        console.log("here??");

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USERNAME,
          to: result.employeeEmail,
          subject: 'Reset Password',
          text: 'Click the link below to reset your password: ',
          html: `<a href="http://localhost:5173/employeeAccount/resetForgottenPassword/${token}">Reset Password</a>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log({ message: "Failed to send email!\n" + error });
            err(error);
          } else {
            console.log('Email sent:', info.response);
            success();
          }
        });
      }
      catch (error: any) {
        throw validationErrorHandler(error);
      }
    }
    else {
      throw {error: "Employee has been disabled"};
    } 
  }
  else {
    throw { error: "Employee does not exist"};
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

export async function findEmployeeById(
  employeeId: CreationOptional<number>,
  includes: string[] = []
  ) {
  let result = await Employee.findOne({
    where: { employeeId: employeeId},
    include: includes
  });

  if(result) {
    return result;
  }
  throw {error: "Employee does not exist"};
}

export async function employeeLogin(
  employeeEmail: string,
  password: string,
): Promise<Employee> {
  let result = await Employee.findOne({ 
    where: {employeeEmail: employeeEmail},
    include: ["generalStaff", "keeper", "planningStaff"]
  });
  if(result) {
    if(result.dateOfResignation == null && result.testPassword(password)) {
      return result;
    }
    throw {
      error: "Your account has been disabled!",
    }
  }
  throw {
    error: "Employee does not exist",
  };
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

export async function unsetAsAccountManager(
  employeeId: CreationOptional<number>
) {
  let employee = await Employee.findOne({
    where: {employeeId: employeeId},
  });

  if(employee) {
    if(employee.isAccountManager) {
      if(employee.dateOfResignation == null) {
        console.log("Employee is now not account manager!");
        return employee.unsetAsAccountManager();
      }
      throw {
        error: "Employee has been disabled"
      };
    }
    throw {
      error: "Employee is not Account Manager"
    };
  }
  throw {
    error: "Employee does not exist"
  };
}

export async function getAllEmployees(includes: string[] = []): Promise<Employee[]> {
  console.log('hereeeeee');
  console.log(includes);
  return Employee.findAll({
    order: [
      [literal('dateOfResignation IS NULL'), "ASC"],
      ["dateOfResignation", "DESC"],
    ],
    include: includes,
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

export async function setPassword(
  token: string,
  password: string,
) {
  let realToken = await Token.findOne({
    where: {token: token},
  });

  if(realToken) {
    let employee = await Employee.findOne({
      where: {employeeEmail: realToken.email},
    });

    if(employee) {
      if(employee.dateOfResignation == null) {
        if(realToken.expiresAt.getTime() <= Date.now()) {
          realToken.destroy();
          return employee.updatePassword(password);
        } 
        realToken.destroy();
        throw {error: "Token has expired"};
      }
      realToken.destroy();
      throw {error: "Employee has been disabled"};
    }
    realToken.destroy();
    throw{error: "Employee does not exist"};
  }
}

/*export async function changeRole(
  role: string,
) {
  
}*/

export async function enableRole(
  employeeId: CreationOptional<number>,
  role: string,
  roleJson: any,
) {
  let employee = await Employee.findOne({
    where: {employeeId: employeeId},
  })

  if(employee) {
    if (role == "Keeper") {
      if(await employee.getKeeper()) {
        (await employee.getKeeper())?.enable();
      } else {
        const keeper: any = roleJson;
        let newKeeper = await Keeper.create(keeper);
        employee.setKeeper(newKeeper);
      }

    }

    else if (role == "Planning Staff") {
      if(await employee.getPlanningStaff()) {
        (await employee.getPlanningStaff())?.enable();
      }
      else {
        const planning: any = roleJson;
        let newPlanning = await PlanningStaff.create(planning);
        employee.setPlanningStaff(newPlanning);
      }
      
    }

    else if( role == "General Staff") {
      if(await employee.getGeneralStaff()) {
        (await employee.getGeneralStaff())?.enable();
      }
      else {
        const general: any = roleJson;
        let newGeneral = await GeneralStaff.create(general);
        employee.setGeneralStaff(newGeneral);
      }
    }

    else {
      throw {error: "The role does not exist"};
    }

  } else {
    throw {error: "Employee does not exist"};
  }
}

export async function disableRole(
  employeeId: CreationOptional<number>,
  role: string,
) {
  let employee = await Employee.findOne({
    where: {employeeId: employeeId},
  })

  if(employee) {
    if (role == "Keeper") {
      if(await employee.getKeeper()) {
        throw {error: "Keeper role does not exist in this account"};
      } else {
        (await employee.getKeeper())?.disable();
      }

    }

    else if (role == "Planning Staff") {
      if(await employee.getPlanningStaff()) {
        throw {error: "Planning Staff role does not exist in this account"};
      }
      else {
        (await employee.getPlanningStaff())?.disable();
      }
      
    }

    else if( role == "General Staff") {
      if(await employee.getGeneralStaff()) {
        throw {error: "General Staff role does not exist in this account"};
      }
      else {
        (await employee.getGeneralStaff())?.disable();
      }
    }

    else {
      throw {error: "The role does not exist"};
    }

  } else {
    throw {error: "Employee does not exist"};
  }
}

export async function updateGeneralStaffType(
  employeeId: CreationOptional<number>,
  roleType: string,
) {
  let employee = await Employee.findOne({
    where: {employeeId: employeeId},
  });

  if(employee) {
      if(await employee.getGeneralStaff()) {
          if(roleType == "MAINTENANCE") {
              (await employee.getGeneralStaff())?.setMaintenance();
          }

          else if(roleType == "OPERATIONS") {
              (await employee.getGeneralStaff())?.setOperations();
          }

          else {
              throw {error: "Such role type does not exist"};
          }

      } else {
          throw {error: "There is no general staff role in this account"};
      }
      
  } else {
      throw {error: "Employee does not exist"};
  }
}

export async function updatePlanningStaffType(
  employeeId: CreationOptional<number>,
  roleType: string,
) {
  let employee = await Employee.findOne({
    where: {employeeId: employeeId},
  });

  if(employee) {
      if(await employee.getPlanningStaff()) {
          if(roleType == "CURATOR") {
            (await employee.getPlanningStaff())?.setCurator();
          }

          else if(roleType == "SALES") {
            (await employee.getPlanningStaff())?.setSales();
          }

          else if(roleType == "MARKETING") {
            (await employee.getPlanningStaff())?.setMarketing();
          }

          else if(roleType == "OPERATIONS MANAGER") {
            (await employee.getPlanningStaff())?.setOperationsManager();
          }

          else if(roleType == "CUSTOMER OPERATIONS") {
            (await employee.getPlanningStaff())?.setCustomerOperations();
          }

          else {
              throw {error: "Such role type does not exist"};
          }

      } else {
          throw {error: "There is no planning staff role in this account"};
      }
      
  } else {
      throw {error: "Employee does not exist"};
  }
}


