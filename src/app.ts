import cors from 'cors';
import express from 'express'
import session from 'express-session';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import Environment from '@env';
import Websockets from "@config/websockets";

import AuthRoutes from '@routes/Auth';
import ChatRoutes from '@routes/Chat';

class App {
  public express: any;
  public corsOptions: object;


  constructor() {
    this.express = express();
    this.configureCors();
    this.configureExpressSession();
    this.configureMorgan();
    this.mountRoutes();
    this.configureWebSockets();
  }


  private mountRoutes(): void {
    const router = express.Router()
    this.express.use('/', router);
    this.express.use('/auth', AuthRoutes);
    this.express.use('/chat', ChatRoutes);
  }


  private configureCors(): void {
    const corsOptions = {
      credentials: true,
      origin: [
        Environment.uiUrl,
      ],
    }

    this.express.use(cors(corsOptions));
  }


  private configureExpressSession() {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(cookieParser());

    var RedisStore = require('connect-redis')(session);

    this.express.use(session({
      store: new RedisStore({
        host: Environment.redis.host,
        port: Environment.redis.port,
      }),
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    }))
  }


  private configureMorgan() {
    this.express.use(morgan('tiny'));
  }


  private configureWebSockets() {
    var server = require('http').createServer(this.express);
    Websockets.initialize(server);
    server.listen(3001);
  }
}

export default new App().express;
