import cors from 'cors';
import express from 'express'
import session from 'express-session';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { Logger } from './helpers/Logger';
import AuthRoutes from '@routes/Auth';
import ChatRoutes from '@routes/Chat';
import Environment from '@env';
import Websockets from "@config/websockets";

class App {
  public express: any;
  public sockets: any;
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

    const sessionData = session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    })

    this.express.use(sessionData);
    this.configureWebSockets(sessionData);
  }


  private configureMorgan() {
    this.express.use(morgan('tiny'));
  }


  private configureWebSockets(sessionData) {
    const socketPort = process.env.PORT || 3001
    const socketServer = require('http').createServer(this.express);
    Websockets.initialize(this.sockets, sessionData);
    this.sockets = socketServer.listen(socketPort, (err: Error) => {
      Logger.info('Started socket server');
      if (err) {
        Logger.info(`Couldn't start socket server`, err);
        return console.log(err)
      }
    })
  }
}

export default new App();
