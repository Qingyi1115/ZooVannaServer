import { Request, Response } from "express";
import { createToken } from "../helpers/security";
import {
  createNewEmployee,
  employeeLogin,
  findEmployeeByEmail,
  getAllEmployees,
  setAsAccountManager,
  getEmployee,
  resetPassword,
  disableEmployeeAccount,
  setPassword,
  unsetAsAccountManager,
  enableRole,
  disableRole,
  // updateGeneralStaffType,
  // updatePlanningStaffType,
  updateRoleType,
  updateSpecializationType,
  getAllGeneralStaffs
} from "../services/employee";
import { PlannerType } from "../models/enumerated";
import { GeneralStaff } from "../models/generalStaff";

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const employeeData = await employeeLogin(email, password);
      if (!employeeData) {
        return res.status(403).json({ error: "Invalid credentials!" });
      }
      const token = createToken(email);
      return res.status(200).json({ token, employeeData: employeeData.toJSON() });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export async function updateEmployeeAccountController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    const { 
      employeeAddress, 
      employeeEmail, 
      employeePhoneNumber,
      employeeEducation
    } = req.body;

    for (const [field, v] of Object.entries({
      employeeAddress:employeeAddress, 
      employeeEmail:employeeEmail, 
      employeePhoneNumber:employeePhoneNumber,
      employeeEducation:employeeEducation})){
        
        if (v !== undefined){
          (employee as any)[field] = v;
        } 
      }
    employee.save();
    
    let token = undefined;
    if (employeeEmail !== undefined){
      token = createToken(employee.employeeEmail);
    }
    
    return res.status(200).json({newToken: token, employee: employee.toJSON()});
  } catch (error: any) {
    console.log("errore",error);
    return res.status(400).json({error: error.message});
  }
};

export async function updateEmployeePasswordController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    const { 
      newPassword,
      oldPassword
    } = req.body;

    if ([newPassword, oldPassword].every(
        (field) => field === undefined,
      )
    ) {
      return res.status(400).json({ error: "Missing information!" });
    }
    if (!employee.testPassword(oldPassword)) throw {message: "Wrong password!"}

    employee.updatePassword(newPassword);
    
    return res.status(200).json({result: "Success!"});
  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({error: error.message});
  }
};

export const getSelfController = async (req: Request, res: Response) => {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);
    return res.status(200).json({ employee: await employee.toFullJSON() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const createEmployeeController = async (req: Request, res: Response) => {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

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

    let generatedOneTimePassword,
      newEmployee = await createNewEmployee(
        employeeName,
        employeeAddress,
        employeeEmail,
        employeePhoneNumber,
        employeeEducation,
        isAccountManager,
        employeeBirthDate,
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

export async function setAccountManagerController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (!employee.isAccountManager) {
      return res
        .status(403)
        .json({ error: "Access Denied! Account managers only!" });
    }

    const { employeeId } = req.params;

    let result = await setAsAccountManager(Number(employeeId));
    
    return res.status(200).json({employee: result});
} catch (error: any) {
  console.log(error.message);
  return res.status(400).json({error: error.message});
}
};

export async function unsetAccountManagerController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (!employee.isAccountManager) {
      return res
        .status(403)
        .json({ error: "Access Denied! Account managers only!" });
    }

    const { employeeId } = req.params;

    let result = await unsetAsAccountManager(Number(employeeId));
    
    return res.status(200).json({employee: result});
  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({error: error.message});
  }
};

export async function getAllEmployeesController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (!employee.isAccountManager) {
      return res
        .status(403)
        .json({ error: "Access Denied! Account managers only!" });
    }

    const {includes=[] } = req.body;
    const _includes : string[] = []
    for (const role of ["keeper", "generalStaff", "planningStaff"]){
      if (includes.includes(role)) _includes.push(role)
    }

    let result = await getAllEmployees(_includes);
    return res.status(200).json({employees: result});

  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({error: error.message});
  } 
}

export async function getAllGeneralStaffsController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (!employee.isAccountManager || (await employee.getPlanningStaff())?.plannerType == PlannerType.OPERATIONS_MANAGER) {
      return res
        .status(403)
        .json({ error: "Access Denied!" });
    }

    const {includes=[] } = req.body;
    const _includes : string[] = ["employee"]
    for (const role of ["maintainedFacilities", "operatedFacility", "sensors"]){
      if (includes.includes(role)) _includes.push(role)
    }

    let generalStaffs: GeneralStaff[] = await getAllGeneralStaffs(_includes);

    return res.status(200).json({generalStaffs: generalStaffs});

  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({error: error.message});
  } 
}

export async function getEmployeeController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (!employee.isAccountManager) {
      return res
        .status(403)
        .json({ error: "Access Denied! Account managers only!" });
    }

    const {employeeId} = req.params;

    let result = await getEmployee(Number(employeeId));     
    return res.status(200).json({employee: result});
    
  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({error: error.message});
  }
};

export async function resetPasswordController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (!employee.isAccountManager) {
      return res
        .status(403)
        .json({ error: "Access Denied! Account managers only!" });
    }

    const {employeeId} = req.params;

    resetPassword(Number(employeeId), (error:string) =>{
      res.status(200).json({ message: "Failed to send email!\n" + error });
    }, () =>{
      res.status(200).json({message: "Email for reset password has been sent"});
    }
    );
  }
  catch (error: any) {
    return res.status(400).json({error: error.message});
  }
}

export async function disableEmployeeAccountController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (!employee.isAccountManager) {
      return res
        .status(403)
        .json({ error: "Access Denied! Account managers only!" });
    }

    const {employeeId} = req.params;
    const dateOfResignation = new Date();

    let result = await disableEmployeeAccount(Number(employeeId), dateOfResignation);
    return res.status(200).json({date: result});
  }
  catch (error: any) {
    return res.status(400).json({error: error.message});
  }
}

export async function resetForgottenPasswordController(req: Request, res: Response) {
  try {
    const {
      token,
      password
    } = req.body;

    if (
      [
        token,
        password
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        token,
        password
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let result = await setPassword(token, password);
    return res.status(200).json({employee: result});
  }
  catch (error: any) {
    return res.status(400).json({error: error.message});
  }
}

export async function enableRoleController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (!employee.isAccountManager) {
      return res
        .status(403)
        .json({ error: "Access Denied! Account managers only!" });
    }

    const {employeeId} = req.params;
    const result = req.body;
    console.log(result);
    console.log(employeeId);
    

    const ress = await enableRole(Number(employeeId), result.role, result.roleJson);
    console.log(ress + "hereeee");
    return res.status(200).json({message: `The ${result.role} role has been enabled`});
  }
  catch (error: any) {
    return res.status(400).json({error: error.message});
  }
}

export async function disableRoleController(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (!employee.isAccountManager) {
      return res
        .status(403)
        .json({ error: "Access Denied! Account managers only!" });
    }

    const {employeeId} = req.params;
    const roleJson = req.body;
    console.log(roleJson, roleJson.role);

    await disableRole(Number(employeeId), roleJson.role);
    return res.status(200).json({message: `The ${roleJson.role} role has been disabled`});

  }
  catch (error: any) {
    return res.status(400).json({error: error.message});
  }
}

export const updateRoleTypeController = async (
  req: Request, 
  res: Response,
) => {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (!employee.isAccountManager) {
      return res
        .status(403)
        .json({ error: "Access Denied! Account managers only!" });
    }

    const {employeeId} = req.params;
    const result = req.body;
    console.log(result.role, result.roleType);

    await updateRoleType(Number(employeeId), result.role, result.roleType);
    return res.status(200).json({message: `The ${result.role} roleType has been updated`});

  }
  catch (error: any) {
    return res.status(400).json({error: error.message});
  }
}

export const updateSpecializationTypeController = async (
  req: Request, 
  res: Response,
) => {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    if (!employee.isAccountManager) {
      return res
        .status(403)
        .json({ error: "Access Denied! Account managers only!" });
    }

    const {employeeId} = req.params;
    const result = req.body;
    console.log(result.role, result.specializationType);

    await updateSpecializationType(Number(employeeId), result.role, result.specializationType);
    return res.status(200).json({message: `The ${result.role} specialization has been updated`});

  }
  catch (error: any) {
    return res.status(400).json({error: error.message});
  }
}

// export async function updateGeneralStaffTypeController(req: Request, res: Response) {
//   try {
//       const { email } = (req as any).locals.jwtPayload;
//       const employee = await findEmployeeByEmail(email);

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

// export async function updatePlanningStaffTypeController(req: Request, res: Response) {
//   try {
//       const { email } = (req as any).locals.jwtPayload;
//       const employee = await findEmployeeByEmail(email);

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

