import express from "express";

import login from './login';

const router = express.Router();

export default (): express.Router => {
    login(router)
    return router;
}