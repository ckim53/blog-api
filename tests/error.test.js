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
		findMany: jest.fn().mockRejectedValue(new Error('DB failed')),
	},
}));

const request = require('supertest');
const app = require('../app');

describe('Error handling', () => {
	it('returns 500 when database throws', async () => {
		const res = await request(app)
			.get('/admin/1/posts')
			.set('Authorization', 'Bearer valid-token');

		expect(res.status).toBe(500);
	});
});
