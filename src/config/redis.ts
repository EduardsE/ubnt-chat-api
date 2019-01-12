import redis from 'redis';

import Environment from '@env';

export function getConnection(): redis.RedisClient {
  return redis.createClient({
    host: Environment.redis.host,
    port: Environment.redis.port,
  });
}

export const ACTIVE_USERS_KEY = 'activeUsers';
export const MESSAGES_KEY = 'messages';
