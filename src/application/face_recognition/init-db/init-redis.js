const redis = require("redis");

let redisClient;

(async () => {
  redisClient = redis.createClient({
    socket: {
      host: "localhost",
      port: 6379,
    },
  });

  await redisClient.connect();
})();

module.exports = {
  redisClient,
};
