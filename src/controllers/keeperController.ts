import { Request, Response } from "express";
import {
  findEmployeeByEmail,
  findEmployeeById
} from "../services/employeeService";
import * as KeeperService from "../services/keeperService";

export const addEnclosureToKeeper = async (
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
    const { enclosureIds } = req.body;
    const result = await findEmployeeById(Number(employeeId));
    if (await result.getKeeper()) {
      let keeper = await result.getKeeper();
      if (!keeper.isDisabled) {
        for (const enclosureId of enclosureIds) {
          await KeeperService.updateDetails((await keeper.getEmployee()).employeeId, Number(enclosureId));
        }
        return res.status(200).json({ result: "success" });
      }
      throw { error: "The keeper role has been disabled!" };
    }
    throw { error: "Employee has no keeper role!" };
  }
  catch (error: any) {
    console.log("error", error)
    return res.status(400).json({ error: error.message });
  }
}

export const removeEnclosureFromKeeper = async (
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
    const { enclosureIds } = req.body;
    const result = await findEmployeeById(Number(employeeId));
    if (await result.getKeeper()) {
      let keeper = await result.getKeeper();
      if (!keeper.isDisabled) {
        for (const enclosureId of enclosureIds) {
          await KeeperService.removeEnclosure((await keeper.getEmployee()).employeeId, Number(enclosureId));
        }
        return res.status(200).json({ updated: keeper });
      }
      throw { error: "The keeper role has been disabled!" };
    }
    throw { error: "Employee has no keeper role!" };
  }
  catch (error: any) {
    console.log("error", error)
    return res.status(400).json({ error: error.message });
  }
}

export const getAllKeepers = async (
  req: Request,
  res: Response,
) => {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const employee = await findEmployeeByEmail(email);

    // if (!employee.isAccountManager) {
    //   return res
    //     .status(403)
    //     .json({ error: "Access Denied! Account managers only!" });
    // }

    const keepers = await KeeperService.getAllKeepers();

    return res.status(200).json({ keepers: keepers });

  }
  catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

