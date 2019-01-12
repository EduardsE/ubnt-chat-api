import cors from 'cors';
import express from 'express'
import session from 'express-session';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import Environment from '@env';
import * as AuthController from '@controllers/AuthController';

class App {
  public express: any;
  public corsOptions: object;


  constructor() {
    this.express = express();
    this.configureCors();
    this.configureExpressSession();
    this.configureMorgan();
    this.mountRoutes();
  }


  private mountRoutes(): void {
    const router = express.Router()
    this.express.use('/', router);
    this.express.use('/login', AuthController.login);
  }


  private configureCors(): void {
    const corsOptions = {
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
}

export default new App().express;
