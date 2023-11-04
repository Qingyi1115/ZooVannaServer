import { Request, Response } from "express";
import {
    updateDetails,
    removeEnclosure,
    updateKeeperType,
} from "../services/keeper";
import {
    createNewEmployee,
    employeeLogin,
    findEmployeeByEmail,
    getAllEmployees,
    setAsAccountManager,
    getEmployee,
    resetPassword,
    disableEmployeeAccount,
    findEmployeeById,
    setPassword
  } from "../services/employee";

export const addEnclosureToKeeperController = async (
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
        if(await result.getKeeper()) {
            let keeper = await result.getKeeper();
            if(!keeper.isDisabled) {
                for (const enclosureId of enclosureIds){
                    await updateDetails((await keeper.getEmployee()).employeeId, Number(enclosureId));
                }
                return res.status(200).json({result: "success"});
            }
            throw {error: "The keeper role has been disabled!"};
        }
        throw {error: "Employee has no keeper role!"};
    }
    catch (error: any) {
        console.log("error",error)
        return res.status(400).json({error: error.message});
    }
}

export const removeEnclosureFromKeeperController = async (
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
        if(await result.getKeeper()) {
            let keeper = await result.getKeeper();
            if(!keeper.isDisabled) {
                for (const enclosureId of enclosureIds){
                    await removeEnclosure((await keeper.getEmployee()).employeeId, Number(enclosureId));
                }
                return res.status(200).json({updated: keeper});
            }
            throw {error: "The keeper role has been disabled!"};
        }
        throw {error: "Employee has no keeper role!"};
    }
    catch (error: any) {
        console.log("error",error)
        return res.status(400).json({error: error.message});
    }
}

export const updateKeeperTypeController = async (
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
        const {roleType} = req.body;

        await updateKeeperType(Number(employeeId), roleType);

        return res.status(200).json({message: `The role type for this account has been updated to ${roleType}`});

    }
    catch (error: any) {
        return res.status(400).json({error: error.message});
    }
}