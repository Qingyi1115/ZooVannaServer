require("dotenv").config();

import express, { Express, Request, Response } from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
// import multer, { FileFilterCallback } from 'multer';
// import "dotenv/config";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/.env' }); // For my laptop

import employeeRoutes from "./routes/employee";
import customerRoutes from "./routes/customer";
import assetFacilityRoutes from "./routes/assetFacility";
import speciesRoutes from "./routes/species";
import { seedDatabase, createDatabase } from "./models/index";
import { conn } from "./db";

const truthy = ["TRUE", "true", "True", "1"];
const app = express();

app.use(
  cors({
    credentials: true,
  }),
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

const port = 3000;

server.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}/`);
  await conn.authenticate();
  console.log("Database connected!");

  if (truthy.includes(process.env.RESET_DB || "")) {
    await createDatabase({ forced: true });
    console.log("Database built!");
    await seedDatabase();
    console.log("Database seeded!");
  } else {
    console.log("Database left untouched!");
  }
});

app.use((req, res, next) => {
  console.log(req.path, req.method);
  console.log("socket localAddress :<",req.socket.localAddress,">",req.socket.localAddress=="::1" )
  console.log("socket remoteAddress :<",req.socket.remoteAddress,">")
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.send("HELLO)s");
});

app.use("/api/employee/", employeeRoutes);
app.use("/api/customer/", customerRoutes);
app.use("/api/assetFacility/", assetFacilityRoutes);
app.use("/api/species", speciesRoutes);
