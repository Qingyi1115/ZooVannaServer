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
  setPassword
} from "../services/employee";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      if (!(await employeeLogin(email, password))) {
        return res.status(403).json({ error: "Invalid credentials!" });
      }
      const token = createToken(email);
      res.status(200).json({ email, token });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
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

export const updateEmployeeAccount = async (req: Request, res: Response) => {};

export const setAccountManager = async (
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

    const { employeeId } = req.body;

    let result = await setAsAccountManager(employeeId);
    
    return res.status(200).json({created: result});
} catch (error: any) {
  console.log(error.message);
  return res.status(400).json({error: error.message});
}
};

export const retrieveAllEmployees = async (
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

    let result = await getAllEmployees();
    return res.status(200).json({list: result});

  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({error: error.message});
  } 
}

export const retrieveEmployee = async (
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

export const resetPasswords = async (
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

export const disableEmployee = async (
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

export const resetForgottenPassword = async (
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
