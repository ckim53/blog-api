const request = require('supertest');
const app = require('../app');

describe('Health check', () => {
	it('returns 200', async () => {
		const res = await request(app).get('/health');
		expect(res.status).toBe(200);
	});
});
