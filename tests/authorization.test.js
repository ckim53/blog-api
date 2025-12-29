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
		findMany: jest.fn().mockResolvedValue([{ id: 1, authorId: 2 }]),
	},
}));
const request = require('supertest');
const app = require('../app');
describe('Authorization', () => {
	it('return 403 when user accesses another author’s posts', async () => {
		const res = await request(app)
			.get('/admin/2/posts')
			.set('Authorization', 'Bearer valid-token');

		expect(res.status).toBe(403);
	});
});
