require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const methodOverride = require('method-override');
const passport = require('passport');
const prisma = require('./config/prisma');
const cors = require('cors');

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const postsRouter = require('./routes/postsRouter');
const commentsRouter = require('./routes/commentsRouter');

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
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
			const hashedPassword = await bcrypt.hash(req.body.password, 10);
			const user = await prisma.user.create({
				data: {
					username: req.body.username,
					password: hashedPassword,
				},
			});
			res
				.status(201)
				.json({ ok: true, data: { id: user.id, username: user.username } });
		} catch (err) {
			return next(err);
		}
	},
);

app.use(passport.initialize());

app.get('/log-in', (req, res) => {
	res.json({
		ok: true,
		message: 'Log-in endpoint',
	});
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

app.use('/posts', postsRouter);
app.use('/posts/:postId/comments', commentsRouter);

app.post('/logout', (req, res) => {
	res.json({ ok: true, message: 'Client should delete token to log out' });
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res
		.status(500)
		.json({ ok: false, error: err.message || 'Internal Server Error' });
});
app.listen(3000, () => console.log('app listening on port 3000!'));
