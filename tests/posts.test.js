const request = require('supertest');
const app = require('../app');

jest.mock('../config/prisma', () => ({
	post: {
		findMany: jest.fn().mockResolvedValue([]),
	},
}));

describe('GET /posts check', () => {
	it('returns 200 and ok in body', async () => {
		const res = await request(app).get('/posts');
		expect(res.status).toBe(200);
		expect(res.body.ok).toBe(true);
	});
});
