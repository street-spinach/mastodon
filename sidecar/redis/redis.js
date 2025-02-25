const redis = require('redis');



if (!process.env.REDIS_URL) {
    console.error('REDIS_URL environment variable is not set. Exiting...');
    process.exit(1);
}

const mastodonRedisClient = redis.createClient({
    url: process.env.REDIS_URL
});

mastodonRedisClient.on('error', (err) => {
    console.error('Redis client error:', err);
});

mastodonRedisClient.connect().catch(console.error);

const spinachUserQueue = 'spinach-users';

async function publishMessage(spinachUserId, email) {
    console.log("Publishing message to Redis");

    const spinachUserCreationMessageMessage = JSON.stringify({
        class: 'AddSpinachUserWorker',
        args: [spinachUserId, email]
    });

    try {
        const reply = await mastodonRedisClient.lPush(spinachUserQueue, spinachUserCreationMessageMessage);
        console.log("Message pushed to Redis:", reply);
        return reply;
    } catch (err) {
        console.error("Error publishing message to Redis:", err);
        throw err;
    }
}


module.exports = {
    publishMessage
};