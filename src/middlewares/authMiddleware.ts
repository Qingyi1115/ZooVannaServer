import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { findEmployeeByEmail } from "../services/employeeService";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: express.NextFunction,
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];
  const SECRET_KEY = process.env.SECRET_KEY;
  if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is missing or undefined.");
  }

  try {
    let jwtPayload = jwt.verify(token, SECRET_KEY);

    findEmployeeByEmail((jwtPayload as any)["email"])
      .catch((e) => {
        console.log(e);
      })
      .then((employee) => {
        if (!!employee?.dateOfResignation)
          return res
            .status(401)
            .json({ error: "Request is not authorized! Staff resigned!" });
        (req as any).locals = { jwtPayload: jwtPayload };
        next();
      });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};
