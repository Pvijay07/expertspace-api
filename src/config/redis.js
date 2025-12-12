const redis = require('redis');
const logger = require('../lib/logger');

class RedisClient {
  constructor() {
    this.client = null;
    this.connect();
  }

  async connect() {
    try {
      this.client = redis.createClient({
        url: process.env.REDIS_URL,
        password: process.env.REDIS_PASSWORD || undefined,
      });

      this.client.on('error', (err) => {
        logger.error(`Redis Client Error: ${err}`);
      });

      this.client.on('connect', () => {
        logger.info('Redis connected successfully');
      });

      await this.client.connect();
    } catch (error) {
      logger.error(`Redis connection failed: ${error.message}`);
      setTimeout(() => this.connect(), 5000); // Retry after 5 seconds
    }
  }

  async get(key) {
    try {
      return await this.client.get(key);
    } catch (error) {
      logger.error(`Redis GET error: ${error.message}`);
      return null;
    }
  }

  async set(key, value, expiry = 3600) {
    try {
      await this.client.set(key, value, { EX: expiry });
    } catch (error) {
      logger.error(`Redis SET error: ${error.message}`);
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error(`Redis DEL error: ${error.message}`);
    }
  }

  async quit() {
    try {
      await this.client.quit();
    } catch (error) {
      logger.error(`Redis quit error: ${error.message}`);
    }
  }
}

module.exports = new RedisClient();