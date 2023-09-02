require("dotenv").config();

import express, {Express, Request, Response}  from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import 'dotenv/config';

import userRoutes from './routes/user'
import {seedDatabase} from './models/index' 
import {conn} from './db';


const app = express();

app.use(cors({
  credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

const port = 3000;

server.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}/`);
  await conn.authenticate();
  console.log("Database connected!")
  await seedDatabase();
  console.log("Database built!")
});

app.get("/", (req: Request, res: Response) => {
    res.send("HELLO)s");
});


app.use('/api/user/', userRoutes);