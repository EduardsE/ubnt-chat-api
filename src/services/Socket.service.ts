import Websockets from "@config/websockets";
import { User } from "@t/User";
import { Message } from "@t/Message";


export default class SocketService {
  private socket;

  constructor() {
    this.socket = Websockets.getIo();
  }

  public emitUserConnected(user: User) {
    this.socket.emit('user-connected', {
      ...user,
      eventId: this.generateEventId()
    });
  }


  public emitNewMessage(message: Message) {
    this.socket.emit('new-message', {
      ...message,
      eventId: this.generateEventId()
    });
  }


  public emitUserDisconnected(user: User, dueToInactivity: boolean = false) {
    user = { ...user};
    delete user['socketId'];

    this.socket.emit('user-disconnected', {
      ...user,
      eventId: this.generateEventId(),
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


  private generateEventId(): string {
    return Math.random().toString(36).substring(3);
  }
}
