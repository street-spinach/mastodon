const redis = require('redis');
const mastodonRedisClient = redis.createClient({
    url: process.env.REDIS_URL
});

const spinachUserQueue = 'spinach-users';

async function publishMessage(spinachUserId, email) {

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