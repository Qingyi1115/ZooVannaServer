import express from 'express';
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import {Employee} from '../models/employee';
import {ValidationError} from "Sequelize";
import crypto from "crypto";

export function hash(string:string) {return crypto.createHash('sha256').update(string).digest('hex');}


const createToken = (email: string) => {
    const SECRET_KEY = process.env.SECRET_KEY;
    if (!SECRET_KEY) {
        throw new Error('SECRET_KEY is missing or undefined.');
    }
    return jwt.sign({ email: email }, SECRET_KEY, { expiresIn: "1d" });
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        if (email && password) {
            if (!(await Employee.findOne({where:{employeeEmail:email}}))?.testPassword(password)){
                return res.status(403).json({error:"Invalid credentials!"})
            }
            const token = createToken(email);
            res.status(200).json({ email, token });
        }
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const { email } = (req as any).locals.jwtPayload

        const employee =  await Employee.findOne({where:{employeeEmail:email}})

        if (employee == null){
            return res.status(403).json({error: "Unable to find account!"});
        }
        
        // if ((await employee.getRoleName()).localeCompare("accountManager")) {
        //     return res.status(403).json({error: "Access Denied! Account managers only!"});
        // }
        if (!employee.hasAdminPrivileges) {
            return res.status(403).json({error: "Access Denied! Account managers only!"});
        }
        console.log(req.body)
        const { employeeName, employeeAddress, employeeEmail, employeePhoneNumber, employeeEducation, hasAdminPrivileges, role, roleJson } = req.body
        if ([employeeName, employeeAddress, employeeEmail, employeePhoneNumber, employeeEducation, hasAdminPrivileges, role, roleJson ].includes(undefined)){
            console.log([employeeName, employeeAddress, employeeEmail, employeePhoneNumber, employeeEducation, hasAdminPrivileges, role, roleJson ])
            return res.status(400).json({error:"Missing information!"})
        }

        const random_password = (Math.random() + 1).toString(36).substring(7) + (Math.random() + 1).toString(36).substring(7);
        const random_salt = (Math.random() + 1).toString(36).substring(7);
        
        const employee_details: any = {
            employeeName: employeeName, 
            employeeAddress: employeeAddress,
            employeeEmail: employeeEmail,
            employeePhoneNumber: employeePhoneNumber,
            employeePasswordHash: hash(random_password + random_salt), 
            employeeSalt:random_salt,
            employeeDoorAccessCode: await Employee.generateNewDoorAccessCode(),
            employeeEducation: employeeEducation,
            hasAdminPrivileges: (hasAdminPrivileges as string).toLocaleUpperCase() == "TRUE",
          }
        employee_details[role] = roleJson;

        let new_employee = await Employee.create(employee_details, {
            include:{
              association : role
            }
          }
        );

        return res.status(200).json({password:random_password, created: new_employee})

    } catch (error: any) {
        if (error instanceof ValidationError) {
            let msgs:string[] = []
            error.errors.forEach(element => {
                msgs.push(element.message)
            });
            console.log("Error in creating users",msgs);
            return res.status(400).json({ errors: msgs });
        }
        console.log(error.message);
        return res.status(400).json({ error: error.message });
    }
}
