const { createClient } = require('redis');

const client = createClient({
    url: process.env.REDIS_URL,
});

client.on('error', err => console.log('Redis Client Error', err));

async function getRedisClient() {
    if (!client.isOpen) {
        await client.connect();
        console.log('redis client conectado');
    }
    return client;
}

module.exports = { getRedisClient };
