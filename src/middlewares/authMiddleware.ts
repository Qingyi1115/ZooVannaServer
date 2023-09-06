import express from 'express';
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';

import { secretKey, hash } from "../helpers/extremelyProtected";

export const authMiddleware = (req: Request, res: Response, next: express.NextFunction) => {

    // if (req.cookies.issued && req.cookies.token && req.cookies.username) {
    //     if (hash(req.cookies.username + secretKey + req.cookies.issued) == req.cookies.token) {
    //         next();
    //     } else {
    //         res.status(403).json({ error: 'Cookies integrity check failed!' });
    //     }
    //     return;
    // }
    // res.status(403).json({ error: 'Login required.' });

    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "Authorization token required" });
    }

    const token = authorization.split(" ")[1];
    const SECRET_KEY = process.env.SECRET_KEY;
    if (!SECRET_KEY) {
        throw new Error('SECRET_KEY is missing or undefined.');
    }

    try {
        req.jwtPayload = jwt.verify(token, SECRET_KEY);
        // Find user in database
        // query here, if unable to find, there would be an error --> caught
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "Request is not authorized" });
    }
}