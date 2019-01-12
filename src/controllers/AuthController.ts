import { Request, Response } from 'express';

import { ActiveUsersHelper } from "src/helpers/ActiveUsersHelper";
import { User } from '@t/User';

export async function login(req: Request, res: Response): Promise<any> {
  try {
    let users = await ActiveUsersHelper.getActiveUsers() as User[];

    if (!req.body.username) {
      throw new Error("No username given");
    }

    if (users[req.body.username]) {
      throw new Error("Username already taken");
    }

    users.push({
      username: req.body.username,
      connectedAt: new Date()
    });

    // TODO: Send socket message about new user joinig;

    await ActiveUsersHelper.setActiveUsers(users);
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json(error.message);
  }
}
