import { createClient } from 'redis'
import { getRedisClient } from './redis';

const redisState = globalThis.__taxicapRateLimitRedis || {
  client: null,
  connectPromise: null,
}

globalThis.__taxicapRateLimitRedis = redisState

async function ensureRedisConnected() {
  if (!redisState.client) {
    const { REDIS_URL, REDIS_PORT } = process.env
    if (!REDIS_URL || !REDIS_PORT) {
      throw new Error('Redis connection settings are not configured')
    }

    redisState.client = getRedisClient({ url: `redis://${REDIS_URL}:${REDIS_PORT}` })
    redisState.client.on('error', (error) => console.error('Rate limit Redis error:', error))
  }

  if (redisState.client.isOpen) return
  if (!redisState.connectPromise) {
    redisState.connectPromise = redisState.client.connect().finally(() => {
      redisState.connectPromise = null
    })
  }
  await redisState.connectPromise
}

export async function checkRateLimit(prefix, key, limit, windowSec) {
    const client = await getRedisClient();
    const redisKey = `rl:${prefix}:${key}`;

    const count = await client.incr(redisKey);
    if (count === 1) {
        await client.expire(redisKey, windowSec);
    }

    let ttl = await client.ttl(redisKey);
    if (ttl < 0) {
        // на случай, если ключ остался без TTL
        await client.expire(redisKey, windowSec);
        ttl = windowSec;
    }

    return {
        allowed: count <= limit,
        retryAfter: ttl,
        remaining: Math.max(0, limit - count),
    };
}
