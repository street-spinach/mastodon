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

    console.log("publishing message to redis");

    spinachUserCreationMessageMessage = JSON.stringify({
        class: 'AddSpinachUserWorker',
        args: [spinachUserId, email],
        queue: spinachUserQueue,

    });
    return new Promise((resolve, reject) => {
        mastodonRedisClient.rpush(spinachUserQueue, spinachUserCreationMessageMessage, (err, reply) => {
            if (err) {
                console.error('Error publishing message to Redis: ', err);
                return reject(err);
            }
            resolve(reply);
        });
    });
}

module.exports = {
    publishMessage
};