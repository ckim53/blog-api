const { createClient } = require('redis');

if (process.env.NODE_ENV === 'test') {
	module.exports = {
		get: async () => null,
		set: async () => null,
		del: async () => null,
	};
} else {
	const redisClient = createClient({
		url: process.env.REDIS_URL || 'redis://localhost:6379',
	});

	redisClient.on('error', (err) => {
		console.error('Redis error', err);
	});

	(async () => {
		try {
			await redisClient.connect();
			console.log('Redis connected');
		} catch (err) {
			console.warn('Redis unavailable, continuing without cache');
		}
	})();

	module.exports = redisClient;
}
