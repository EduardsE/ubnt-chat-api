import Websockets from "@config/websockets";
import { User } from "@t/User";
import { Message } from "@t/Message";


export default class SocketService {
  private socket;

  constructor() {
    this.socket = Websockets.getIo();
  }

  public emitUserConnected(user: User) {
    this.socket.emit('user-connected', user);
  }


  public emitNewMessage(message: Message) {
    this.socket.emit('new-message', message);
  }


  public emitUserDisconnected(user: User, dueToInactivity: boolean = false) {
    this.socket.emit('user-disconnected', {
      ...user,
      dueToInactivity
    });
  }


  public disconnectUser(user: User) {
    this.socket.sockets.connected[user.socketId].disconnect();
  }


  public sendInactivityDisconnectNotif(user: User) {
    this.socket.sockets.connected[user.socketId].emit(
      'disconnect-due-to-inactivity'
    );
  }
}
