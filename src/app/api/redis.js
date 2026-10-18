import { createClient } from 'redis';

let client;
let connectPromise;
let lastErrorLog = 0;

function createRedis() {
    const { REDIS_URL, REDIS_PORT } = process.env;
    if (!REDIS_URL || !REDIS_PORT) {
        throw new Error('Redis connection settings are not configured');
    }

    const c = createClient({
        url: `redis://${REDIS_URL}:${REDIS_PORT}`,
        socket: {
            connectTimeout: 3000,
            reconnectStrategy: (retries) =>
                retries >= 3 ? new Error('Redis недоступен') : Math.min(retries * 200, 1000),
        },
    });

    c.on('error', (err) => {
        const now = Date.now();
        if (now - lastErrorLog > 30000) {
            lastErrorLog = now;
            console.error('Ошибка Redis:', err.code || err.message);
        }
    });

    return c;
}

export async function getRedisClient() {
    if (!client) client = createRedis();

    if (!client.isOpen) {
        if (!connectPromise) {
            connectPromise = client
                .connect()
                .catch((err) => {
                    client = null;
                    throw err;
                })
                .finally(() => {
                    connectPromise = null;
                });
        }
        await connectPromise;
    }

    return client;
}