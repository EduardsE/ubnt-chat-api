import sio from 'socket.io';
import * as ChatService from '@services/Chat.service';

const sharedsession = require("express-socket.io-session");
let io: sio.Server;

export default class Websockets {
  public static initialize(server, sessionData) {
    io = sio(server, {
      transports: ['websocket', 'polling'],
      // origins: '*:*'
    });

    io.use(sharedsession(sessionData));

    io.on('connection', async (socket) => {
      socket.on('disconnect', () => {
        ChatService.removeUserOnSocketDisconnect(socket.id);
      });

      try {
        ChatService.addSocketIdToUser(
          socket.handshake['session'].user,
          socket.conn.id
        );
      } catch(error) {
        socket.emit('accessing-without-auth');
        socket.disconnect();
      }

      socket.handshake['session']['socketId'] = socket.conn.id;
      socket.handshake['session'].save();
    });
  }

  public static getIo(): sio.Server {
    return io;
  }
}
