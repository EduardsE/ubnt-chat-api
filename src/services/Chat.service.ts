import { Message } from "@t/Message";
import { User } from "@t/User";
import SocketService from "./Socket.service";
import moment from 'moment';

let disconnectAfterSeconds = 10000000;
let users: User[] = [];
let messages: Message[] = [];

// Disconnects users after 10 seconds
(() => {
  setInterval(() => {
    users.map(user => {
      if (
        moment() > moment(user.lastActivityAt)
        .add(disconnectAfterSeconds, 'seconds')
      ) {
        this.disconnectDueToInactivity(user);
      };
    })
  }, 10000)
})()

export function addUser(user): void {
  users.push({
    ...user,
    lastActivityAt: new Date(),
  });
  new SocketService().emitUserConnected(user);
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

  users.map(user => {
    if (user.username === message.username) {
      user.lastActivityAt = new Date();
    }
  })

  console.log(users);

  new SocketService().emitNewMessage(message);
  return;
}


export function getUsers(): User[] {
  return users;
}


export function disconnectDueToInactivity(user: User): void {
  const socketService = new SocketService();
  socketService.emitUserDisconnected(user, true);
  socketService.disconnectUser(user);

  users = users.filter(u => u.username !== user.username);
  return;
}


export function addSocketIdToUser(user: User, socketId: string): void {
  const storedUser = users.find(u => user.username === u.username);

  if (storedUser) {
    storedUser.socketId = socketId;
  }

  return;
}
