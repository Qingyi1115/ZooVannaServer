import express from 'express';
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import {Employee} from '../models/employee';
import { AccountManager } from 'models/accountManager';

import { secretKey, hash } from "../helpers/extremelyProtected";

const createToken = (email: string) => {
    const SECRET_KEY = process.env.SECRET_KEY;
    if (!SECRET_KEY) {
        throw new Error('SECRET_KEY is missing or undefined.');
    }
    return jwt.sign({ email: email }, SECRET_KEY, { expiresIn: "1d" });
};

export const oldlogin = (req: Request, res: Response) => {
    let email = req.body.email
    let password = req.body.password
    // Searches for such name and password

    if (email && password) {
        let now = new Date().getTime().toString();
        res.cookie('username', email, { maxAge: 1000 * 60 * 15 });
        res.cookie('token', hash(email + secretKey + now), { maxAge: 1000 * 60 * 15 });
        res.cookie('issued', now, { maxAge: 1000 * 60 * 15 });
        return res.status(200).json({ "status": "success" });
    }
    return res.status(500).json({ error: 'Login failed.' });
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        if (email && password) {// check in DB, verify login details
            // const user = await User.login(username, password); 
            const user = { email: email }
            // create a token
            const token = createToken(email);

            res.status(200).json({ email, token });
        }
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const { email } = req.jwtPayload

        const employee =  await Employee.findOne({where:{eomployeeEmail:email}})

        if ((await employee.getRole()).localeCompare("AccountManager")) {
            return res.status(403).json({error: "Access Denied! Account managers only!"});
        }

        const { employeeName, employeeAddress, employeeEmail, employeePhoneNumber, employeeEducation } = req.body

        const random_password = (Math.random() + 1).toString(36).substring(7) + (Math.random() + 1).toString(36).substring(7);
        const random_salt = (Math.random() + 1).toString(36).substring(7);
        
        let marry = await Employee.create({
            employeeName: employeeName, 
            employeeAddress: employeeAddress,
            employeeEmail: employeeEmail,
            employeePhoneNumber: employeePhoneNumber,
            employeePasswordHash: hash(random_password + random_salt), 
            employeeSalt:random_salt,
            employeeDoorAccessCode: Employee.generateNewDoorAccessCode(),
            employeeEducation: employeeEducation,
        });

        return res.status(200).json({password:random_password})

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}
