import Websockets from "@config/websockets";
import { User } from "@t/User";
import { Message } from "@t/Message";


export default class SocketService {
  private socket: SocketIO.Server;

  constructor() {
    this.socket = Websockets.getIo();
  }


  /**
   * Emits new connection event to all users.
   * @param user
   */
  public emitUserConnected(user: User) {
    this.socket.emit('user-connected', {
      ...user,
      eventId: this.generateEventId()
    });
  }


  /**
   * Emits new message to all users.
   * @param message
   */
  public emitNewMessage(message: Message) {
    this.socket.emit('new-message', {
      ...message,
      eventId: this.generateEventId()
    });
  }


  /**
   * Emits disconnection event to all users.
   * @param user
   * @param dueToInactivity indicates weather user was disconnected due to inactivity
   * @return void
   */
  public emitUserDisconnected(user: User, dueToInactivity: boolean = false) {
    user = { ...user};
    delete user['socketId'];

    this.socket.emit('user-disconnected', {
      ...user,
      eventId: this.generateEventId(),
      dueToInactivity
    });
  }


  /**
   * Disconnects specific users socket.
   * @param user
   */
  public disconnectUser(user: User): void {
    this.socket.sockets.connected[user.socketId].disconnect();
  }


  /**
   * Notifies client that it's about to be disconnected due to inactivity
   * @param user
   * @reutur void
   */
  public sendInactivityDisconnectNotif(user: User): void {
    this.socket.sockets.connected[user.socketId].emit(
      'disconnect-due-to-inactivity'
    );
  }


  /**
   * Generates a random ID for doublicate checking
   * @reutur string
   */
  private generateEventId(): string {
    return Math.random().toString(36).substring(3);
  }
}
