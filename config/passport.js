const passport = require('passport');
const prisma = require('./prisma');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcryptjs');

const requireAuth = passport.authenticate('jwt', { session: false });

passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await prisma.user.findUnique({ where: { username } });
			if (!user) return done(null, false, { message: 'User not found' });

			const match = await bcrypt.compare(password, user.password);
			if (!match) return done(null, false, { message: 'Incorrect password' });

			return done(null, user);
		} catch (err) {
			return done(err);
		}
	}),
);
passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET,
		},
		async (jwtPayload, done) => {
			try {
				const user = await prisma.user.findUnique({
					where: { id: jwtPayload.id },
				});
				return user ? done(null, user) : done(null, false);
			} catch (err) {
				return done(err, false);
			}
		},
	),
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
	try {
		const user = await prisma.user.findUnique({ where: { id } });
		if (!user) return done(null, false);
		return done(null, user);
	} catch (err) {
		return done(err);
	}
});

module.exports = { passport, requireAuth };
