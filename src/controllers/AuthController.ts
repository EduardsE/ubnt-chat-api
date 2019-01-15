import { Request, Response } from 'express';

import * as ChatService from '@services/Chat.service';

export async function login(req: Request, res: Response): Promise<any> {
  try {
    if (!req.body.username) {
      throw new Error("No username given");
    }

    let users = ChatService.getConnectedUsers();
    const existingUser = users.find(user => user.username === req.body.username);
    if (existingUser) {
      throw new Error("Failed to connect. Nickname already taken.',");
    }

    const user = ChatService.addUser({
      username: req.body.username.trim(),
      connectedAt: new Date(),
      id: Math.random().toString(36).substring(3),
      color: "#"+((1<<24)*Math.random()|0).toString(16)
    });

    req.session.user = user;

    // await ActiveUsersHelper.setActiveUsers(users);
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json(error.message);
  }
}


export async function logout(req: Request, res: Response): Promise<any> {
  try {
    const user = {
      ...res.locals.user,
      id: Math.random().toString(36).substring(3)
    }
    ChatService.removeUser(user);
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json(error.message);
  }
}
