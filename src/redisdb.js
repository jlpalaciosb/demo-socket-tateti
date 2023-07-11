const { createClient } = require('redis');

const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));

async function getRedisClient() {
    if (!client.isOpen) {
        await client.connect();
        console.log('redis client conectado');
    }
    return client;
}

module.exports = { getRedisClient };
