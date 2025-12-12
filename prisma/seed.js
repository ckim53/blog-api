const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
	console.log('seeding database...');

	await prisma.post.deleteMany({});

	const hashedAdminPassword = await bcrypt.hash('donut', 10);
	const hashedGuestPassword = await bcrypt.hash('password562d3mo', 10);

	const user = await prisma.user.upsert({
		where: { username: 'cwistina' },
		update: {},
		create: {
			username: 'cwistina',
			password: hashedAdminPassword,
			displayName: 'Christina K.',
		},
	});

	const guest = await prisma.user.upsert({
		where: { username: 'guest' },
		update: {},
		create: {
			username: 'guest',
			password: hashedGuestPassword,
			displayName: 'Guest User',
		},
	});

	await prisma.post.upsert({
		where: { seedId: 'welcome' },
		update: {
			content:
				'Hi! Welcome to my blog. I built this application to practice full-stack development and strengthen the backend skills I’ve been working on. It uses Node.js, Express, PostgreSQL, Prisma ORM, and React on the front end. This project helped me get more comfortable designing RESTful APIs, building secure JWT-based authentication, and structuring relational databases for a real backend system. I also created this demo dashboard so visitors can explore the features without needing their own account. You can create posts, edit them, and leave comments on the public blog feed. Thanks for checking it out!',
			published: false,
			isProtected: true,
			authorId: guest.id,
		},
		create: {
			seedId: 'welcome',
			title: 'Welcome to My Blog',
			content:
				'Hi! Welcome to my blog. I built this application to practice full-stack development and strengthen the backend skills I’ve been working on. It uses Node.js, Express, PostgreSQL, Prisma ORM, and React on the front end. This project helped me get more comfortable designing RESTful APIs, building secure JWT-based authentication, and structuring relational databases for a real backend system. I also created this demo dashboard so visitors can explore the features without needing their own account. You can create posts, edit them, and leave comments on the public blog feed. Thanks for checking it out!',
			published: false,
			isProtected: true,
			authorId: guest.id,
		},
	});

	const posts = [
		{
			seedId: 'morning-routine',
			title: 'A Quiet Morning Routine',
			content:
				'I’ve been keeping mornings simple—coffee, a short walk, and a few minutes to think before opening my laptop...',
			published: true,
		},
		{
			seedId: 'coffee-shop-notes',
			title: 'Notes From an Afternoon at a Coffee Shop',
			content: 'I spent a couple hours working from a small café today...',
			published: true,
		},
		{
			seedId: 'better-habits',
			title: 'Trying to Build Better Habits',
			content: 'Lately I’ve been thinking about habits I want to improve...',
			published: true,
		},
		{
			seedId: 'day-off',
			title: 'What I Learned by Taking a Day Off',
			content: 'I took a day completely off last week...',
			published: true,
		},
		{
			seedId: 'consistency',
			title: 'Thoughts on Consistency',
			content:
				'Consistency isn’t exciting, but it’s the thing that actually produces results...',
			published: true,
		},
		{
			seedId: 'familiar-places',
			title: 'The Comfort of Familiar Places',
			content: 'There’s a small coffee shop I keep going back to...',
			published: true,
		},
		{
			seedId: 'resetting-space',
			title: 'Resetting My Space',
			content: 'I cleaned my desk today and reorganized a few things...',
			published: true,
		},
		{
			seedId: 'midweek-reflections',
			title: 'Midweek Reflections',
			content: 'This week hasn’t been perfect, but it’s been okay...',
			published: true,
		},
		{
			seedId: 'small-wins',
			title: 'Small Wins That Made My Week',
			content:
				'Cooked at home twice, finally finished a book I started months ago...',
			published: true,
		},
	];

	for (const post of posts) {
		await prisma.post.upsert({
			where: {
				seedId: post.seedId,
			},
			update: {
				content: post.content,
				published: post.published,
				authorId: user.id,
				isProtected: post.isProtected ?? false,
			},
			create: {
				seedId: post.seedId,
				title: post.title,
				content: post.content,
				published: post.published,
				authorId: user.id,
				isProtected: post.isProtected ?? false,
			},
		});
	}

	console.log('seeding complete!');
}

main()
	.catch((err) => {
		console.error('seed error:', err);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
