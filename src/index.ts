import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

// import router from './router';
import login from './router/login';
import {secretKey, hash} from "./extremelyProtected";

const app = express();

app.use(cors({
  credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use((req, res, next) =>{
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
})

app.use('/api/login', login());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log('Server running on http://localhost:8080/');
});


// app.use('/', router());
