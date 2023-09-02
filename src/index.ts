require("dotenv").config();

import express, { Express, Request, Response } from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mysql from "mysql2";
import 'dotenv/config';

// import router from './router';
import userRoutes from "./routes/user"
import { authMiddleware } from './middlewares/authMiddleware';

const app = express();

app.use(cors({
  credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DB || "zoovanna",
  port: parseInt(process.env.MYSQL_DB_PORT || "3306"),
  // multipleStatements: true
})

const server = http.createServer(app);

const port = 3000;

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});

app.use((req, res, next) => {
  console.log(req.path, req.method);
  // console.log(req.body);
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.send("HELLO)s");
});


app.use('/api/user/', userRoutes);
