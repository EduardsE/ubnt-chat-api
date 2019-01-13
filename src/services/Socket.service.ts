import Websockets from "@config/websockets";
import { User } from "@t/User";
import { Message } from "@t/Message";


export default class SocketService {
  private socket;

  constructor() {
    this.socket = Websockets.getIo();
  }

  public emitUserJoined(user: User) {
    this.socket.emit('user-joined', user);
  }


  public emitNewMessage(message: Message) {
    console.log('emit new message');
    this.socket.emit('new-message', message);
  }


  public emitUserDisconnected(user: User) {
    this.socket.emit('user-disconnected', user);
  }
}
