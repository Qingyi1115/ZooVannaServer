import express from 'express';
import { Request, Response } from "express";

import { secretKey, hash } from "../helpers/extremelyProtected";

export const authMiddleware = (req: Request, res: Response, next: express.NextFunction) => {

    if (req.path == '/api/login') {
        next();
        return;
    }
    if (req.cookies.issued && req.cookies.token && req.cookies.username) {
        if (hash(req.cookies.username + secretKey + req.cookies.issued) == req.cookies.token) {
            next();
        } else {
            res.status(403).json({ error: 'Cookies integrity check failed!' });
        }
        return;
    }
    res.status(403).json({ error: 'Login required.' });
}