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
} from "../services/employee";

export const login = async (req: Request, res: Response) => {
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
        (isAccountManager as string).toLocaleUpperCase() == "TRUE",
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

export const updateEmployeeAccountController = async (req: Request, res: Response) => {};

export const setAccountManagerController = async (
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

    const { employeeId } = req.params;

    let result = await setAsAccountManager(Number(employeeId));
    
    return res.status(200).json({set: result});
} catch (error: any) {
  console.log(error.message);
  return res.status(400).json({error: error.message});
}
};

export const unsetAccountManagerController = async (
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

    const { employeeId } = req.params;

    let result = await unsetAsAccountManager(Number(employeeId));
    
    return res.status(200).json({unset: result});
  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({error: error.message});
  }
};

export const getAllEmployeesController = async (
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

    const {includes } = req.body();
    const[_includes] = [includes.includes("keeper"), includes.includes("generalStaff"), includes.includes("planningStaff")] 

    let result = await getAllEmployees(_includes);
    return res.status(200).json({employees: result});

  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({error: error.message});
  } 
}

export const getEmployeeController = async (
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

    let result = await getEmployee(Number(employeeId));     
    return res.status(200).json({employee: result});
    
  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({error: error.message});
  }
};

export const resetPasswordController = async (
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

    await resetPassword(Number(employeeId));
    return res.status(200).json({message: "Email for reset password has been sent"});
  }
  catch (error: any) {
    return res.status(400).json({error: error.message});
  }
}

export const disableEmployeeAccountController = async (
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

    let result = await disableEmployeeAccount(Number(employeeId));
    return res.status(200).json({date: result});
  }
  catch (error: any) {
    return res.status(400).json({error: error.message});
  }
}

export const resetForgottenPasswordController = async (
  req: Request,
  res: Response,
) => {
  try {
    const {token, password} = req.body;

    let result = await setPassword(token, password);
    return res.status(200).json({employee: result});
  }
  catch (error: any) {
    return res.status(400).json({error: error.message});
  }
}

export const enableRoleController = async (
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
    const {role, roleJson} = req.body;

    await enableRole(Number(employeeId), role, roleJson);
    return res.status(200).json({message: `The ${role} role has been enabled`});
  }
  catch (error: any) {
    return res.status(400).json({error: error.message});
  }
}

export const disableRoleController = async (
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
    const {role} = req.body;

    await disableRole(Number(employeeId), role);
    return res.status(200).json({message: `The ${role} role has been disabled`});

  }
  catch (error: any) {
    return res.status(400).json({error: error.message});
  }
}