// redisClient.js
const Redis = require('ioredis');
const redis = new Redis(); // Connects to localhost:6379
module.exports = redis;
