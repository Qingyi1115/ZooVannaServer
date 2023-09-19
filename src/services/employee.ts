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

//Account Manager
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
  
  if(result) {
    if(result.dateOfResignation == null) {
      const token = uuidv4();

      const resetTokens: any = {
        token: token,
        email: result.employeeEmail,
        createdAt: Date.now(),
        expiresAt: Date.now() + 600000, //expires in 10 minutes
      };

      try {
        await Token.create(resetTokens);

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
          html: '<a href="http://localhost:3000/employee/resetForgottenPassword/${token}">Reset Password</a>',
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
          } else {
            console.log('Email sent:', info.response);
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

export async function getAllEmployees(includes: any): Promise<Employee[]> {
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



