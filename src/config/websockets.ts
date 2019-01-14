import sio from 'socket.io';
import * as ChatService from '@services/Chat.service';

const sharedsession = require("express-socket.io-session");
let io: sio.Server;

export default class Websockets {
  public static initialize(server, sessionData) {
    io = sio(server);
    io.use(sharedsession(sessionData));

    io.on('connection', async (socket) => {
      ChatService.addSocketIdToUser(
        socket.handshake['session'].user,
        socket.conn.id
      );
      socket.handshake['session']['socketId'] = socket.conn.id;
      socket.handshake['session'].save();

      socket.on('disconnect', async () => {});
    });
  }

  public static getIo(): sio.Server {
    return io;
  }
}
