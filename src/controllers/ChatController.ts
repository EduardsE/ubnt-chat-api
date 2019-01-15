import { Request, Response } from 'express';

import { Message } from '@t/Message';
import * as ChatService from '@services/Chat.service';


export async function getStatus(req: Request, res: Response): Promise<any> {
  try {
    // Removing sensitive data before returning.
    const users = ChatService.getUsers().map(user => {
      const { socketId, ...fitleredUser } = user;
      return fitleredUser;
    })

    return res.json({
      users,
      self: res.locals.user
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
}


export async function postMessage(req: Request, res: Response): Promise<any> {
  try {
    if (!req.body.message) {
      throw new Error('No message given');
    }

    const message: Message = {
      username: res.locals.user.username,
      message: req.body.message,
      id: Math.random().toString(36).substring(3),
      color: res.locals.user.color
    }

    ChatService.addMessage(message);
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json(error.message);
  }
}
