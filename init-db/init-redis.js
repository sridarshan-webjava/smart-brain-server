const redis = require("redis");

let redisClient;

(async () => {
  redisClient = redis.createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  });

  await redisClient.connect();
})();

module.exports = {
  redisClient,
};
