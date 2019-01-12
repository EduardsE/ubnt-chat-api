import { getConnection as getRedisConnection, ACTIVE_USERS_KEY } from '@config/redis';
import { User } from '@t/User';

export class ActiveUsersHelper {
  public static async setActiveUsers(activeUsers: object): Promise<any> {
    return new Promise((resolve, reject) => {
      const RedisClient = getRedisConnection();
      RedisClient.set(`${ACTIVE_USERS_KEY}`, JSON.stringify(activeUsers), (error, result) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      });
    });
  }


  public static async getActiveUsers(): Promise<any> {
    return new Promise((resolve, reject) => {
      const RedisClient = getRedisConnection();
      RedisClient.get(`${ACTIVE_USERS_KEY}`, (error, result) => {
        if (error) {
          reject(error);
        }

        if (result) {
          resolve(JSON.parse(result));
        } else {
          resolve([]);
        }
      });
    });
  }
}


