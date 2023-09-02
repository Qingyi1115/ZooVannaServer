import express from 'express';
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';

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