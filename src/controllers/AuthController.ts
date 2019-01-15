import { Request, Response } from 'express';

import * as ChatService from '@services/Chat.service';

export async function login(req: Request, res: Response): Promise<any> {
  try {
    if (!req.body.username) {
      throw new Error("No Nickname given");
    }

    let users = ChatService.getUsers();
    const existingUser = users.find(user => user.username === req.body.username);
    if (existingUser) {
      throw new Error("Failed to connect. Nickname already taken.");
    }

    if (req.body.username.length > 100) {
      throw new Error(
        `Please, choose a username that's shorter than 100 characters`
      );
    }

    const user = ChatService.addUser({
      username: req.body.username.trim(),
      connectedAt: new Date(),
      color: "#"+((1<<24)*Math.random()|0).toString(16)
    });

    req.session.user = user;
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
