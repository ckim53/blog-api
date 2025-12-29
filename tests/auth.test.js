const request = require('supertest');
const app = require('../app');

describe('Auth middleware', () => {
	it('returns 401 if no token provided', async () => {
		const res = await request(app).get('/admin/1/posts');
		expect(res.status).toBe(401);
	});
});
