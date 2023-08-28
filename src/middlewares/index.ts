import express from 'express';
import {secretKey, hash} from "../extremelyProtected";

export const isAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) =>{

    if (req.path == '/api/login'){
        next();
        return;
    }
    if (req.cookies.issued && req.cookies.token && req.cookies.username) {
        if (hash(req.cookies.username + secretKey + req.cookies.issued) == req.cookies.token){
        next();
        }else{
        res.status(403).json({error:'Cookies integrity check failed!'});
        }
        return;
    }
    res.status(403).json({error:'Login required.'});
}