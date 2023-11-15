import { CreationOptional, literal } from "Sequelize";
import * as nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { validationErrorHandler } from "../helpers/errorHandler";
import { hash } from "../helpers/security";
import { Employee } from "../models/Employee";
import { GeneralStaff } from "../models/GeneralStaff";
import { Keeper } from "../models/Keeper";
import { PlanningStaff } from "../models/PlanningStaff";
import { Token } from "../models/Token";

//Account Manager
export async function createNewEmployee(
  employeeName: string,
  employeeAddress: string,
  employeeEmail: string,
  employeePhoneNumber: string,
  employeeEducation: string,
  isAccountManager: boolean,
  employeeBirthDate: Date,
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
    employeeBirthDate: employeeBirthDate,
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

    await newEmployee.save();

    const token = uuidv4();

    const resetTokens: any = {
      token: token,
      email: employeeEmail,
      createdAt: Date.now(),
      expiresAt: Date.now() + 600000, //expires in 10 minutes
    };

    try {
      await Token.create(resetTokens);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: employeeEmail,
        subject: "Set Password",
        text: "Click the link below to set your password: ",
        html: `<a href="http://localhost:5173/employeeAccount/setPassword/${token}">Set Password</a>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    } catch (error: any) {
      throw validationErrorHandler(error);
    }
    return [randomPassword, newEmployee.toJSON()];
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function resetPassword(
  employeeId: CreationOptional<number>,
  err: Function,
  success: Function,
) {
  let result = await Employee.findOne({
    where: { employeeId: employeeId },
  });

  if (result) {
    if (result.dateOfResignation == null) {
      const token = uuidv4();

      const resetTokens: any = {
        token: token,
        email: result.employeeEmail,
        createdAt: Date.now(),
        expiresAt: Date.now() + 600000, //expires in 10 minutes
      };

      try {
        let t = await Token.create(resetTokens);
        await t.save();

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USERNAME,
          to: result.employeeEmail,
          subject: "Reset Password",
          text: "Click the link below to reset your password: ",
          html: `<a href="http://localhost:5173/employeeAccount/setPassword/${token}">Reset Password</a>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log({ message: "Failed to send email!\n" + error });
            err(error);
          } else {
            console.log("Email sent:", info.response);
            success();
          }
        });
      } catch (error: any) {
        throw validationErrorHandler(error);
      }
    } else {
      throw { message: "Employee has been disabled" };
    }
  } else {
    throw { message: "Employee does not exist" };
  }
}

export async function findEmployeeByEmail(employeeEmail: string) {
  let result = await Employee.findOne({
    where: { employeeEmail: employeeEmail },
  });
  if (result) {
    return result;
  }
  throw { message: "Invalid email employee!" };
}

export async function findEmployeeById(
  employeeId: CreationOptional<number>,
  includes: string[] = [],
) {
  let result = await Employee.findOne({
    where: { employeeId: employeeId },
    include: includes,
  });

  if (result) {
    return result;
  }
  throw { message: "Employee does not exist" };
}

export async function employeeLogin(
  employeeEmail: string,
  password: string,
): Promise<Employee> {
  let result = await Employee.findOne({
    where: { employeeEmail: employeeEmail },
    include: ["generalStaff", "keeper", "planningStaff"],
  });
  if (result) {
    if (result.dateOfResignation == null) {
      if (result.testPassword(password)) {
        return result;
      }
      throw {
        message: "Password inccorrect!",
      };
    }
    throw {
      message: "Your account has been disabled!",
    };
  }
  throw {
    message: "Email does not exist!",
  };
}

export async function setAsAccountManager(
  employeeId: CreationOptional<number>,
) {
  let employee = await Employee.findOne({
    where: { employeeId: employeeId },
  });

  if (employee) {
    if (!employee.isAccountManager) {
      if (employee.dateOfResignation == null) {
        return employee.setAsAccountManager();
      }
      throw {
        message: "Employee has been disabled",
      };
    }
    throw {
      message: "Employee is already Account Manager",
    };
  }
  throw {
    message: "Employee does not exist",
  };
}

export async function unsetAsAccountManager(
  employeeId: CreationOptional<number>,
) {
  let employee = await Employee.findOne({
    where: { employeeId: employeeId },
  });

  if (employee) {
    if (employee.isAccountManager) {
      if (employee.dateOfResignation == null) {
        console.log("Employee is now not account manager!");
        return employee.unsetAsAccountManager();
      }
      throw {
        message: "Employee has been disabled",
      };
    }
    throw {
      message: "Employee is not Account Manager",
    };
  }
  throw {
    message: "Employee does not exist",
  };
}

export async function getAllEmployees(
  includes: string[] = [],
): Promise<Employee[]> {
  return Employee.findAll({
    order: [
      [literal("dateOfResignation IS NULL"), "DESC"],
      ["dateOfResignation", "DESC"],
    ],
    include: includes,
  });
}

export async function getAllGeneralStaffs(
  includes: string[] = [],
): Promise<GeneralStaff[]> {
  let generalStaffs = await GeneralStaff.findAll({
    include: includes,
  });

  const valid_staff = [];
  for (const staff of generalStaffs) {
    if (!staff.employee?.dateOfResignation && !staff.isDisabled)
      valid_staff.push(staff);
  }

  return valid_staff;
}

export async function getEmployee(
  employeeId: CreationOptional<number>,
): Promise<Employee> {
  let employee = await Employee.findOne({
    where: { employeeId: employeeId },
    include: ["keeper", "generalStaff", "planningStaff"],
  });

  if (employee) {
    return employee;
  }
  throw {
    message: "Employee does not exist",
  };
}

export async function getKeeperByEmployeeId(
  employeeId: number,
): Promise<Keeper> {
  let employee = await getEmployee(employeeId);

  if (employee) {
    return employee.getKeeper({
      include: [
        {
          association: "employee",
          required: true,
        },
      ],
    });
  }
  throw {
    message: "Employee does not exist",
  };
}

export async function disableEmployeeAccount(
  employeeId: CreationOptional<number>,
  dateOfResignation: Date,
) {
  let employee = await Employee.findOne({
    where: { employeeId: employeeId },
  });

  if (employee) {
    if (employee.dateOfResignation == null) {
      return employee.disableAccount(dateOfResignation);
    }
    throw {
      message:
        "Employee account was disabled before on " + employee.dateOfResignation,
    };
  }
  throw {
    message: "Employee does not exist",
  };
}

export async function setPassword(token: string, password: string) {
  let realToken = await Token.findOne({
    where: { token: token },
  });

  if (realToken) {
    let employee = await Employee.findOne({
      where: { employeeEmail: realToken.email },
    });

    if (employee) {
      if (employee.dateOfResignation == null) {
        if (realToken.expiresAt.getTime() > Date.now()) {
          realToken.destroy();
          return employee.updatePassword(password);
        }
        realToken.destroy();
        throw { message: "Token has expired" };
      }
      realToken.destroy();
      throw { message: "Employee has been disabled" };
    }
    realToken.destroy();
    throw { message: "Employee does not exist" };
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
    where: { employeeId: employeeId },
    include: ["keeper", "generalStaff", "planningStaff"],
  });

  if (employee) {
    if (role === "Keeper") {
      if (employee.keeper) {
        employee.keeper.enable();
        await employee.keeper.save();
      } else {
        const keeper: any = roleJson;
        let newKeeper = await Keeper.create(keeper);
        await newKeeper.save();
        newKeeper.setEmployee(employee);
        employee.setKeeper(newKeeper);
        console.log(newKeeper);
      }
    } else if (role === "Planning Staff") {
      if (employee.planningStaff) {
        employee.planningStaff.enable();
        await employee.planningStaff.save();
        return employee;
      } else {
        const planning: any = roleJson;
        let newPlanning = await PlanningStaff.create(planning);
        newPlanning.setEmployee(employee);
        employee.setPlanningStaff(newPlanning);
        return employee;
      }
    } else if (role === "General Staff") {
      if (employee.generalStaff) {
        employee.generalStaff.enable();
        await employee.generalStaff.save();
      } else {
        const general: any = roleJson;
        let newGeneral = await GeneralStaff.create(general);
        newGeneral.enable();
        newGeneral.setEmployee(employee);
        employee.setGeneralStaff(newGeneral);
      }
    } else {
      throw { message: "The role does not exist" };
    }
  } else {
    throw { message: "Employee does not exist" };
  }
}

export async function disableRole(
  employeeId: CreationOptional<number>,
  role: string,
) {
  console.log("this " + role);
  let employee = await Employee.findOne({
    where: { employeeId: employeeId },
    include: ["keeper", "generalStaff", "planningStaff"],
  });

  if (employee) {
    if (role === "Keeper") {
      if (employee.keeper) {
        employee.keeper.disable();
        await employee.keeper.save();
        console.log("it was heree");
      } else {
        throw { message: "Keeper role does not exist in this account" };
      }
    } else if (role === "Planning Staff") {
      if (employee.planningStaff) {
        employee.planningStaff.disable();
        await employee.planningStaff.save();
      } else {
        throw { message: "Planning Staff role does not exist in this account" };
      }
    } else if (role === "General Staff") {
      if (employee.generalStaff) {
        employee.generalStaff.disable();
        await employee.generalStaff.save();
      } else {
        throw { message: "General Staff role does not exist in this account" };
      }
    } else {
      throw { message: "The role does not exist" };
    }
  } else {
    throw { message: "Employee does not exist" };
  }
}

export async function verifyToken(token: string) {
  let result = await Token.findOne({
    where: { token: token },
  });

  if (result) {
    if (result.expiresAt.getTime() > Date.now()) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

// export async function updateGeneralStaffType(
//   employeeId: CreationOptional<number>,
//   roleType: string,
// ) {
//   let employee = await Employee.findOne({
//     where: {employeeId: employeeId},
//   });

//   if(employee) {
//       if(await employee.getGeneralStaff()) {
//           if(roleType == "MAINTENANCE") {
//               (await employee.getGeneralStaff())?.setMaintenance();
//           }

//           else if(roleType == "OPERATIONS") {
//               (await employee.getGeneralStaff())?.setOperations();
//           }

//           else {
//               throw { message: "Such role type does not exist"};
//           }

//       } else {
//           throw { message: "There is no general staff role in this account"};
//       }

//   } else {
//       throw { message: "Employee does not exist"};
//   }
// }

// export async function updatePlanningStaffType(
//   employeeId: CreationOptional<number>,
//   roleType: string,
// ) {
//   let employee = await Employee.findOne({
//     where: {employeeId: employeeId},
//   });

//   if(employee) {
//       if(await employee.getPlanningStaff()) {
//           if(roleType == "CURATOR") {
//             (await employee.getPlanningStaff())?.setCurator();
//           }

//           else if(roleType == "SALES") {
//             (await employee.getPlanningStaff())?.setSales();
//           }

//           else if(roleType == "MARKETING") {
//             (await employee.getPlanningStaff())?.setMarketing();
//           }

//           else if(roleType == "OPERATIONS MANAGER") {
//             (await employee.getPlanningStaff())?.setOperationsManager();
//           }

//           else if(roleType == "CUSTOMER OPERATIONS") {
//             (await employee.getPlanningStaff())?.setCustomerOperations();
//           }

//           else {
//               throw { message: "Such role type does not exist"};
//           }

//       } else {
//           throw { message: "There is no planning staff role in this account"};
//       }

//   } else {
//       throw { message: "Employee does not exist"};
//   }
// }

export async function updateRoleType(
  employeeId: CreationOptional<number>,
  role: string,
  roleType: string,
) {
  let employee = await Employee.findOne({
    where: { employeeId: employeeId },
    include: ["keeper", "generalStaff", "planningStaff"],
  });

  if (employee) {
    if (role === "Keeper") {
      if (employee.keeper) {
        employee.keeper.updateKeeperType(roleType);
      } else {
        throw { message: "Keeper role does not exist in this account" };
      }
    } else if (role === "Planning Staff") {
      if (employee.planningStaff) {
        employee.planningStaff.updatePlanningStaffType(roleType);
      } else {
        throw { message: "Planning Staff role does not exist in this account" };
      }
    } else if (role === "General Staff") {
      if (employee.generalStaff) {
        employee.generalStaff.updateGeneralStaffType(roleType);
      } else {
        throw { message: "General Staff role does not exist in this account" };
      }
    } else {
      throw { message: "The role does not exist" };
    }
  } else {
    throw { message: "Employee does not exist" };
  }
}

export async function updateSpecializationType(
  employeeId: CreationOptional<number>,
  role: string,
  specialization: string,
) {
  let employee = await Employee.findOne({
    where: { employeeId: employeeId },
    include: ["keeper", "generalStaff", "planningStaff"],
  });

  if (employee) {
    if (role === "Keeper") {
      if (employee.keeper) {
        employee.keeper.updateSpecialization(specialization);
      } else {
        throw { message: "Keeper role does not exist in this account" };
      }
    } else if (role === "Planning Staff") {
      if (employee.planningStaff) {
        employee.planningStaff.updateSpecialization(specialization);
      } else {
        throw { message: "Planning Staff role does not exist in this account" };
      }
    } else {
      throw { message: "The role does not exist" };
    }
  } else {
    throw { message: "Employee does not exist" };
  }
}
