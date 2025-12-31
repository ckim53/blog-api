require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const methodOverride = require('method-override');
const passport = require('passport');
const prisma = require('./config/prisma');
const cors = require('cors');
const path = require('path');

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { adminPostsRouter, publicPostsRouter } = require('./routes/postsRouter');

const app = express();

app.use(
	cors({
		origin: [process.env.CLIENT_ORIGIN, process.env.ADMIN_ORIGIN],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	}),
);

app.use(express.json());

app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});
app.get('/health', (_req, res) => {
	res.status(200).send('ok');
});
app.get('/', async (req, res) => {
	res.json({ ok: true, message: 'Welcome to the API' });
});

app.get('/sign-up', (req, res) => {
	res.json({
		ok: true,
		message: 'Sign-up endpoint',
	});
});

app.post(
	'/sign-up',
	[
		body('username')
			.trim()
			.escape()
			.isLength({ min: 3 })
			.withMessage('Username must be at least 3 characters')
			.custom(async (value) => {
				const user = await prisma.user.findUnique({
					where: {
						username: value,
					},
				});
				if (user) {
					throw new Error('Username is already taken');
				}
				return true;
			}),
		body('password')
			.trim()
			.isLength({ min: 4 })
			.withMessage('Password must be at least 4 characters'),
		body('passwordConfirmation')
			.custom((value, { req }) => value === req.body.password)
			.withMessage('Passwords must match.'),
	],
	async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ ok: false, errors: errors.mapped() });
		}
		try {
			const { username, displayName } = req.body;
			const hashedPassword = await bcrypt.hash(req.body.password, 10);
			const user = await prisma.user.create({
				data: {
					username,
					password: hashedPassword,
					displayName: displayName?.trim() || username,
				},
			});
			res.status(201).json({
				ok: true,
				data: {
					id: user.id,
					username: user.username,
					displayName: user.displayName,
				},
			});
		} catch (err) {
			return next(err);
		}
	},
);

app.get('/log-in', (req, res) => {
	res.json({
		ok: true,
		message: 'Log-in endpoint',
	});
});

app.get('/demo', (req, res) => {
	res.json({
		ok: true,
	});
});

app.post('/demo', async (req, res, next) => {
	const { guest } = req.body;

	if (guest) {
		const user = await prisma.user.findUnique({
			where: { username: 'guest' },
		});

		if (!user) {
			return res.status(401).json({ ok: false, error: 'Guest user not found' });
		}

		const token = jwt.sign(
			{ id: user.id, username: user.username },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' },
		);

		return res.json({
			ok: true,
			user: { id: user.id, username: user.username },
			token,
		});
	}

	passport.authenticate('local', { session: false }, (err, user, info) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ ok: false, error: 'Server error' });
		}

		if (!user) {
			return res
				.status(401)
				.json({ ok: false, error: info?.message || 'Invalid credentials' });
		}

		const token = jwt.sign(
			{ id: user.id, username: user.username },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' },
		);

		return res.json({
			ok: true,
			user: { id: user.id, username: user.username },
			token,
		});
	})(req, res, next);
});

app.post('/log-in', (req, res, next) => {
	passport.authenticate('local', { session: false }, (err, user, info) => {
		if (err) {
			console.error(err);
			return res
				.status(500)
				.json({ ok: false, error: 'Server error. Please try again.' });
		}

		if (!user) {
			return res
				.status(401)
				.json({ ok: false, error: info?.message || 'Invalid credentials' });
		}

		const token = jwt.sign(
			{ id: user.id, username: user.username },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' },
		);

		res.json({
			ok: true,
			user: { id: user.id, username: user.username },
			token,
		});
	})(req, res, next);
});

app.use('/admin/:authorId/posts', adminPostsRouter);
app.use('/posts', publicPostsRouter);

app.post('/logout', (req, res) => {
	res.json({ ok: true, message: 'Client should delete token to log out' });
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res
		.status(500)
		.json({ ok: false, error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
	app.listen(PORT, '0.0.0.0', () => {
		console.log(`Server running on port ${PORT}`);
	});
}

module.exports = app;
