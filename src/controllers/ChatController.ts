import { Message } from '@t/Message';
import { Request, Response } from 'express';
import * as ChatService from '@services/Chat.service';

export async function getStatus(req: Request, res: Response): Promise<any> {
  try {
    const status = ChatService.getStatus();
    return res.json(status);
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
      id: Math.random().toString(36).substring(3)
    }

    ChatService.addMessage(message);

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json(error.message);
  }
}
