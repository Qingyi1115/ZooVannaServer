import express from 'express';
import { Request, Response } from "express";

import { secretKey, hash } from "../helpers/extremelyProtected";

export const login = (req: Request, res: Response) => {
    let username = req.body.username
    let password = req.body.password
    // Searches for such name and password

    if (username && password) {
        let now = new Date().getTime().toString();
        res.cookie('username', username, { maxAge: 1000 * 60 * 15 });
        res.cookie('token', hash(username + secretKey + now), { maxAge: 1000 * 60 * 15 });
        res.cookie('issued', now, { maxAge: 1000 * 60 * 15 });
        return res.status(200).json({ "status": "success" });
    }
    return res.status(500).json({ error: 'Login failed.' });
}