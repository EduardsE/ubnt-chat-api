import { Message } from "@t/Message";
import { User } from "@t/User";
import SocketService from "./Socket.service";

let users: User[] = [];
let messages: Message[] = []

export function addUser(user): void {
  users.push(user);
  new SocketService().emitUserJoined(user);
  return user;
}


export function removeUser(user): void {
  users = users.filter(u => u.username !== user.username);
  new SocketService().emitUserDisconnected(user);
  return;
}


export function getConnectedUsers(): User[] {
  return users;
}


export function addMessage(message: Message): void {
  messages.push(message);
  new SocketService().emitNewMessage(message);
  return;
}


export function getStatus(): object {
  return {
    messages,
    users
  }
}
