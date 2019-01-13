import sio from 'socket.io';

let io: sio.Server;

export default class Websockets {
  public static initialize(server) {
    io = sio(server);

    io.on('connection', async (socket) => {
      console.log('connected');
      // io.emit('user-joined', "hello world");
      // console.log(socket);

      socket.on('new-message', (data) => {
        console.log(data);
      });

      socket.on('disconnect', async () => {

      });
    });
  }

  public static getIo(): sio.Server {
    return io;
  }
}
