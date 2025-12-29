jest.mock('../config/passport', () => ({
	passport: {
		initialize: () => (req, _res, next) => next(),
	},
	requireAuth: (req, _res, next) => {
		req.user = { id: 1 };
		next();
	},
}));

jest.mock('../config/prisma', () => ({
	post: {
		findMany: jest.fn().mockResolvedValue([]),
	},
}));

const request = require('supertest');
const app = require('../app');

describe('Auth middleware (mocked)', () => {
	it('returns 200 when token is valid', async () => {
		const res = await request(app)
			.get('/admin/1/posts')
			.set('Authorization', 'Bearer valid-token');

		expect(res.status).toBe(200);
	});
});
