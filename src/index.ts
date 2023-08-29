require("dotenv").config();

import express, {Express, Request, Response}  from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mysql from "mysql2";
import 'dotenv/config';

// import router from './router';

const app = express();

app.use(cors({
  credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const db = mysql.createConnection({
  // host: 'localhost',
  // user:'root',
  // password: '',
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    // port:3306,
    // database: "employees",
    // port:3306,
    // multipleStatements: true
})

const server = http.createServer(app);

const port = 3000;

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});

app.get("/", (req: Request, res: Response) => {
    res.send("HELLO)s");
});


// app.get('/createdb', (req, res) => {
//   let sql = 'CREATE DATABASE test002'
//   db.query(sql, err => {
//     if(err) {
//       throw err;
//     }
//     res.send("Database Created");
//   })
// });
