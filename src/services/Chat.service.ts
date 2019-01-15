import { Message } from "@t/Message";
import { User } from "@t/User";
import SocketService from "./Socket.service";
import moment from 'moment';
import environment from "@config/environment";

let disconnectAfterSeconds = environment.disconnectAfterSeconds;
let users: User[] = [];

// Disconnects users after 'disconnectAfterSeconds' seconds
// + what's left on the 10 second interval.
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


/**
 * Adds user to stack and emits event to all sockets.
 * @param user
 * @returns User
 */
export function addUser(user: User): User {
  users.push({
    ...user,
    lastActivityAt: new Date(),
  });
  new SocketService().emitUserConnected(user);
  return user;
}


/**
 * Removes user from stack and emits event to all sockets.
 * @param user
 * @returns void
 */
export function removeUser(user): void {
  users = users.filter(u => u.username !== user.username);
  new SocketService().emitUserDisconnected(user);
  return;
}


/**
 * Updates senders last activities time and send message to all sockets.
 * @returns Message[]
 */
export function addMessage(message: Message): void {
  users.map(user => {
    if (user.username === message.username) {
      user.lastActivityAt = new Date();
    }
  })

  new SocketService().emitNewMessage(message);
  return;
}


/**
 * Returns currently connected users
 * @returns User[]
 */
export function getUsers(): User[] {
  return users;
}


/**
 * Disconnects user and sends notif to other users.
 * @returns void
 */
export function disconnectDueToInactivity(user: User): void {
  const socketService = new SocketService();
  socketService.sendInactivityDisconnectNotif(user);
  socketService.emitUserDisconnected(user, true);

  socketService.disconnectUser(user);
  users = users.filter(u => u.username !== user.username);
  return;
}


/**
 * Adds socket to authenticated user or rejects, if chat accessed
 * without auth process
 * @returns void
 */
export function addSocketIdToUser(user: User, socketId: string): void {
  const storedUser = users.find(u => user.username === u.username);

  if (storedUser) {
    storedUser.socketId = socketId;
  } else {
    throw new Error(`Access denied without authenticating`);
  }

  return;
}


/**
 * Removes user when tabs/window gets closed.
 * @returns void
 */
export function removeUserOnSocketDisconnect(socketId: string): void {
  const storedUser = users.find(u => u.socketId === socketId);

  if (storedUser) {
    users = users.filter(u => u.username !== storedUser.username);
  }

  return;
}



