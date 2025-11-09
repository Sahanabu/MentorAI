const { Redis } = require('@upstash/redis');

let redisClient;
let redisWarningShown = false;

const connectRedis = async () => {
  try {
    redisClient = Redis.fromEnv();

    // Test connection
    await redisClient.set('test-connection', 'ok');
    await redisClient.del('test-connection');

    console.log('🔴 Upstash Redis Connected');
  } catch (error) {
    if (!redisWarningShown) {
      console.warn('⚠️  Upstash Redis not available, running without cache');
      console.warn('Error details:', error.message);
      redisWarningShown = true;
    }
    redisClient = null;
  }
};

const getRedisClient = () => {
  return redisClient;
};

const isRedisAvailable = () => {
  return redisClient !== null && redisClient !== undefined;
};

module.exports = {
  connectRedis,
  getRedisClient,
  isRedisAvailable
};
