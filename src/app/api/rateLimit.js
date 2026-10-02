import { createClient } from 'redis'

const redisState = globalThis.__taxicapRateLimitRedis || {
  client: null,
  connectPromise: null,
}

if (!redisState.client) {
  const { REDIS_URL, REDIS_PORT } = process.env
  redisState.client = createClient({ url: `redis://${REDIS_URL}:${REDIS_PORT}` })
  redisState.client.on('error', (error) => console.error('Rate limit Redis error:', error))
}

globalThis.__taxicapRateLimitRedis = redisState

async function ensureRedisConnected() {
  if (redisState.client.isOpen) return
  if (!redisState.connectPromise) {
    redisState.connectPromise = redisState.client.connect().finally(() => {
      redisState.connectPromise = null
    })
  }
  await redisState.connectPromise
}

export async function checkRateLimit(scope, subject, maxRequests, windowSeconds) {
  await ensureRedisConnected()

  const window = Math.floor(Date.now() / (windowSeconds * 1000))
  const key = `rate-limit:${scope}:${subject}:${window}`
  const count = await redisState.client.incr(key)
  if (count === 1) await redisState.client.expire(key, windowSeconds)

  const ttl = await redisState.client.ttl(key)
  return {
    allowed: count <= maxRequests,
    retryAfter: Math.max(ttl, 1),
  }
}
