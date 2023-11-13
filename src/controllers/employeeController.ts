import { Request, Response } from "express";
import { createToken } from "../helpers/security";
import { GeneralStaffType, PlannerType } from "../models/Enumerated";
import { GeneralStaff } from "../models/GeneralStaff";
import * as EmployeeService from "../services/employeeService";

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const employeeData = await EmployeeService.employeeLogin(email, password);
      if (!employeeData) {
        return res.status(403).json({ error: "Invalid credentials!" });
      }
      const token = createToken(email);
      return res
        .status(200)
        .json({ token, employeeData: await employeeData.toFullJSON() });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateEmployeeAccount(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    const {
      employeeAddress,
      employeeEmail,
      employeePhoneNumber,
      employeeEducation,
    } = req.body;

    for (const [field, v] of Object.entries({
      employeeAddress: employeeAddress,
      employeeEmail: employeeEmail,
      employeePhoneNumber: employeePhoneNumber,
      employeeEducation: employeeEducation,
    })) {
      if (v !== undefined) {
        (employee as any)[field] = v;
      }
    }
    await employee.save();

    let token = undefined;
    if (employeeEmail !== undefined) {
      token = createToken(employee.employeeEmail);
    }

    return res
      .status(200)
      .json({ newToken: token, employee: employee.toJSON() });
  } catch (error: any) {
    console.log("errore", error);
    return res.status(400).json({ error: error.message });
  }
}

export async function updateEmployeePassword(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    const { newPassword, oldPassword } = req.body;

    if ([newPassword, oldPassword].every((field) => field === undefined)) {
      return res.status(400).json({ error: "Missing information!" });
    }
    if (!employee.testPassword(oldPassword))
      throw { message: "Wrong password!" };

    employee.updatePassword(newPassword);

    return res.status(200).json({ result: "Success!" });
  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({ error: error.message });
  }
}

export const getSelf = async (req: Request, res: Response) => {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);
    return res.status(200).json({ employee: await employee.toFullJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    if (!employee.isAccountManager) {
      return res
        .status(403)
        .json({ error: "Access Denied! Account managers only!" });
    }
    const {
      employeeName,
      employeeAddress,
      employeeEmail,
      employeePhoneNumber,
      employeeEducation,
      employeeBirthDate,
      isAccountManager,
      role,
      roleJson,
    } = req.body;
    if (
      [
        employeeName,
        employeeAddress,
        employeeEmail,
        employeePhoneNumber,
        employeeEducation,
        employeeBirthDate,
        isAccountManager,
        role,
        roleJson,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        employeeName,
        employeeAddress,
        employeeEmail,
        employeePhoneNumber,
        employeeEducation,
        employeeBirthDate,
        isAccountManager,
        role,
        roleJson,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let [generatedOneTimePassword, newEmployee] =
      await EmployeeService.createNewEmployee(
        employeeName,
        employeeAddress,
        employeeEmail,
        employeePhoneNumber,
        employeeEducation,
        isAccountManager,
        new Date(employeeBirthDate),
        role,
        roleJson,
      );

    return res
      .status(200)
      .json({ password: generatedOneTimePassword, created: newEmployee });
  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({ error: error.message });
  }
};

export async function setAccountManager(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    if (!employee.isAccountManager) {
      return res
        .status(403)
        .json({ error: "Access Denied! Account managers only!" });
    }

    const { employeeId } = req.params;

    let result = await EmployeeService.setAsAccountManager(Number(employeeId));

    return res.status(200).json({ employee: result });
  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({ error: error.message });
  }
}

export async function unsetAccountManager(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    if (!employee.isAccountManager) {
      return res
        .status(403)
        .json({ error: "Access Denied! Account managers only!" });
    }

    const { employeeId } = req.params;

    let result = await EmployeeService.unsetAsAccountManager(
      Number(employeeId),
    );

    return res.status(200).json({ employee: result });
  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({ error: error.message });
  }
}

export async function getAllEmployees(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    if (!employee.isAccountManager) {
      return res
        .status(403)
        .json({ error: "Access Denied! Account managers only!" });
    }

    const { includes = [] } = req.body;
    const _includes: any[] = [];
    for (const role of ["generalStaff", "planningStaff"]) {
      if (includes.includes(role)) _includes.push(role);
    }
    if (includes.includes["keeper"]) {
      _includes.push({
        association: "keeper",
        required: false,
        include: [
          {
            association: "zooEvents",
            required: false,
          },
        ],
      });
    }

    let result = await EmployeeService.getAllEmployees(_includes);
    return res.status(200).json({ employees: result });
  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({ error: error.message });
  }
}

export async function getAllGeneralStaffs(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    if (
      !employee.isAccountManager &&
      (await employee.getPlanningStaff())?.plannerType !=
        PlannerType.OPERATIONS_MANAGER &&
      (await employee.getGeneralStaff())?.generalStaffType !=
        GeneralStaffType.ZOO_MAINTENANCE
    ) {
      return res.status(403).json({ error: "Access Denied!" });
    }

    const { includes = [] } = req.body;
    const _includes: string[] = ["employee"];
    for (const role of [
      "maintainedFacilities",
      "operatedFacility",
      "sensors",
    ]) {
      if (includes.includes(role)) _includes.push(role);
    }

    let generalStaffs: GeneralStaff[] =
      await EmployeeService.getAllGeneralStaffs(_includes);
    for (const staff of generalStaffs) {
      let opFacility = await staff.getOperatedFacility();
      if (opFacility) {
        (staff as any).dataValues["operatedFacilityName"] = (
          await opFacility.getFacility()
        ).facilityName;
      }
    }

    return res.status(200).json({ generalStaffs: generalStaffs });
  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({ error: error.message });
  }
}

export async function getEmployee(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    if (!employee.isAccountManager) {
      return res
        .status(403)
        .json({ error: "Access Denied! Account managers only!" });
    }

    const { employeeId } = req.params;

    let result = await EmployeeService.getEmployee(Number(employeeId));
    return res.status(200).json({ employee: result });
  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({ error: error.message });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    if (!employee.isAccountManager) {
      return res
        .status(403)
        .json({ error: "Access Denied! Account managers only!" });
    }

    const { employeeId } = req.params;

    EmployeeService.resetPassword(
      Number(employeeId),
      (error: string) => {
        res.status(200).json({ message: "Failed to send email!\n" + error });
      },
      () => {
        res
          .status(200)
          .json({ message: "Email for reset password has been sent" });
      },
    );
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function disableEmployeeAccount(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    if (!employee.isAccountManager) {
      return res
        .status(403)
        .json({ error: "Access Denied! Account managers only!" });
    }

    const { employeeId } = req.params;
    const dateOfResignation = new Date();

    let result = await EmployeeService.disableEmployeeAccount(
      Number(employeeId),
      dateOfResignation,
    );
    return res.status(200).json({ date: result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function resetForgottenPassword(req: Request, res: Response) {
  try {
    const { token, password } = req.body;

    if ([token, password].includes(undefined)) {
      console.log("Missing field(s): ", {
        token,
        password,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let result = await EmployeeService.setPassword(token, password);
    return res.status(200).json({ result: result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function enableRole(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    if (!employee.isAccountManager) {
      return res
        .status(403)
        .json({ error: "Access Denied! Account managers only!" });
    }

    const { employeeId } = req.params;
    const result = req.body;

    const ress = await EmployeeService.enableRole(
      Number(employeeId),
      result.role,
      result.roleJson,
    );

    return res
      .status(200)
      .json({ message: `The ${result.role} role has been enabled` });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function disableRole(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    if (!employee.isAccountManager) {
      return res
        .status(403)
        .json({ error: "Access Denied! Account managers only!" });
    }

    const { employeeId } = req.params;
    const roleJson = req.body;

    await EmployeeService.disableRole(Number(employeeId), roleJson.role);
    return res
      .status(200)
      .json({ message: `The ${roleJson.role} role has been disabled` });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function updateRoleType(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    if (!employee.isAccountManager) {
      return res
        .status(403)
        .json({ error: "Access Denied! Account managers only!" });
    }

    const { employeeId } = req.params;
    const result = req.body;

    await EmployeeService.updateRoleType(
      Number(employeeId),
      result.role,
      result.roleType,
    );
    return res
      .status(200)
      .json({ message: `The ${result.role} roleType has been updated` });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function updateSpecializationType(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await EmployeeService.findEmployeeByEmail(email);

    if (!employee.isAccountManager) {
      return res
        .status(403)
        .json({ error: "Access Denied! Account managers only!" });
    }

    const { employeeId } = req.params;
    const result = req.body;

    await EmployeeService.updateSpecializationType(
      Number(employeeId),
      result.role,
      result.specializationType,
    );
    return res
      .status(200)
      .json({ message: `The ${result.role} specialization has been updated` });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function verifyToken(req: Request, res: Response) {
  try {
    const { token } = req.params;
    console.log(token);
    const result = await EmployeeService.verifyToken(token);
    return res.status(200).json({ result: result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

// export async function updateGeneralStaffType(req: Request, res: Response) {
//   try {
//       const { email } = (req as any).locals.jwtPayload;
//       const employee = await EmployeeService.findEmployeeByEmail(email);

//       if (!employee.isAccountManager) {
//       return res
//           .status(403)
//           .json({ error: "Access Denied! Account managers only!" });
//       }

//       const {employeeId} = req.params;
//       const {roleType} = req.body;

//       await updateGeneralStaffType(Number(employeeId), roleType);

//       return res.status(200).json({message: `The role type for this account has been updated to ${roleType}`});

//   }
//   catch (error: any) {
//       return res.status(400).json({error: error.message});
//   }
// }

// export async function updatePlanningStaffType(req: Request, res: Response) {
//   try {
//       const { email } = (req as any).locals.jwtPayload;
//       const employee = await EmployeeService.findEmployeeByEmail(email);

//       if (!employee.isAccountManager) {
//       return res
//           .status(403)
//           .json({ error: "Access Denied! Account managers only!" });
//       }

//       const {employeeId} = req.params;
//       const {roleType} = req.body;

//       await updatePlanningStaffType(Number(employeeId), roleType);

//       return res.status(200).json({message: `The role type for this account has been updated to ${roleType}`});

//   }
//   catch (error: any) {
//       return res.status(400).json({error: error.message});
//   }
// }
