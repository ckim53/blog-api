const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
	console.log('seeding database...');

	await prisma.post.deleteMany({});

	const user = await prisma.user.upsert({
		where: { username: 'cwistina' },
		update: {},
		create: {
			username: 'cwistina',
			password: 'donut',
			displayName: 'Christina K.',
		},
	});

	const guest = await prisma.user.upsert({
		where: { username: 'guest' },
		update: {},
		create: {
			username: 'guest',
			password: 'password562d3mo',
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
			title: 'A Quiet Morning Routine',
			content:
				'I’ve been keeping mornings simple—coffee, a short walk, and a few minutes to think before opening my laptop. I didn’t realize how much of a difference a slow start makes until I tried it consistently.',
			published: true,
		},
		{
			title: 'Notes From an Afternoon at a Coffee Shop',
			content:
				'I spent a couple hours working from a small café today. There’s something about the mix of background noise and the smell of coffee that makes it easier to focus. It felt good to step away from the house for a bit.',
			published: true,
		},
		{
			title: 'Trying to Build Better Habits',
			content:
				'Lately I’ve been thinking about habits I want to improve—less phone time in the morning, more reading at night, and cooking at home more often. Small changes feel less overwhelming when I focus on one at a time.',
			published: true,
		},
		{
			title: 'What I Learned by Taking a Day Off',
			content:
				'I took a day completely off last week. I didn’t do anything remarkable—I ran a few errands, cleaned, grabbed lunch, and rested. But resetting like that made the next few days feel noticeably easier.',
			published: true,
		},
		{
			title: 'Thoughts on Consistency',
			content:
				'Consistency isn’t exciting, but it’s the thing that actually produces results. I’m trying to rely less on motivation and more on routine—even a simple checklist has helped me stay on track.',
			published: true,
		},
		{
			title: 'The Comfort of Familiar Places',
			content:
				'There’s a small coffee shop I keep going back to. Not because it’s the best, but because it’s familiar—same lighting, same quiet corner, same rhythm. It’s become a dependable part of my week.',
			published: true,
		},
		{
			title: 'Resetting My Space',
			content:
				'I cleaned my desk today and reorganized a few things. It only took ten minutes, but it immediately made my workspace feel lighter. Physical clutter really does translate into mental clutter.',
			published: true,
		},
		{
			title: 'Midweek Reflections',
			content:
				'This week hasn’t been perfect, but it’s been okay—and sometimes that’s enough. I’m learning to celebrate the days that are simply steady, not extraordinary.',
			published: true,
		},
		{
			title: 'Small Wins That Made My Week',
			content:
				'Cooked at home twice, finally finished a book I started months ago, and caught up with an old friend over coffee. Nothing major, but a bunch of small wins add up.',
			published: true,
		},
	];

	for (const post of posts) {
		await prisma.post.upsert({
			where: {
				seedId: post.title,
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
