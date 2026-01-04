const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
	console.log('seeding database...');

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
				'I’ve been intentionally slowing down my mornings lately. Instead of reaching for my phone the moment I wake up, I try to give myself a little space to ease into the day. Most mornings start with coffee, a short walk, and a few quiet minutes to think before opening my laptop.\n\nThat pause has been surprisingly very helpful. It gives me time to check in with myself before the noise of the day begins—emails, tasks, expectations. Even on days when I don’t feel particularly motivated, having a simple routine helps ground me. It reminds me that productivity doesn’t always have to start at full speed.\n\nI don’t follow this routine perfectly, but I feel like it’s less about discipline and more about intention. Giving myself a calm start has made the rest of the day feel a lot more manageable, even when things don’t go exactly as planned.',
			published: true,
		},
		{
			seedId: 'coffee-shop-notes',
			title: 'Notes From an Afternoon at a Coffee Shop',
			content:
				'I spent a few hours working from a small coffee shop this afternoon, and it reminded me why I love working outside of the house from time to time. There’s something about the low hum of conversation and the smell of coffee that makes it easier to focus.\n\nI like spaces that feel welcoming without asking too much from you. Some people were clearly deep into their work, others were catching up with friends, and no one seemed rushed. It felt comfortable to exist somewhere without needing to explain why I was there.\n\nI didn’t get an overwhelming amount done, but I left feeling refreshed. Sometimes a change in environment is needed to break my routine and find small moments of joy in the middle of an ordinary day.',
			published: true,
		},
		{
			seedId: 'better-habits',
			title: 'Trying to Build Better Habits',
			content:
				'Lately, I’ve been thinking a lot about habits—what’s working, what isn’t, and what I want to improve. I used to think building better habits meant making big, dramatic changes, but I’m learning that consistency matters more than intensity.\n\nSome days I do great. Other days I fall back into old patterns. Instead of treating that as failure, I’m trying to see it as information, like what made today harder? What helped yesterday feel easier?\n\nProgress feels slower this way, but it’s also more sustainable. I’m learning to focus less on perfection and more on showing up, even imperfectly. That shift alone has made habit-building feel far less intimidating for me.',
			published: true,
		},
		{
			seedId: 'day-off',
			title: 'What I Learned by Taking a Day Off',
			content:
				'I took a full day off last week—no work, no errands, no catching up. At first, it felt uncomfortable. I kept thinking about everything I "should" be doing instead.\n\nBut as the day went on, that discomfort faded. I realized how rarely I let myself rest without justification. By the end of the day, I felt clearer, calmer, and surprisingly motivated again.\n\nTaking time off didn’t set me back. If anything, it reminded me that rest is part of progress, not a reward you earn after burnout.',
			published: true,
		},
		{
			seedId: 'consistency',
			title: 'Thoughts on Consistency',
			content:
				'Consistency isn’t exciting. It doesn’t come with big milestones or instant gratification, but it’s the thing that quietly compounds over time.\n\nI’ve noticed that most of the progress I’m proud of didn’t come from moments of motivation—it came from showing up on average days. The days when nothing felt particularly inspired, but I did the work anyway.\n\nI’m trying to stop chasing motivation and start trusting routine. It’s less flashy, but it’s far more reliable.',
			published: true,
		},
		{
			seedId: 'familiar-places',
			title: 'The Comfort of Familiar Places',
			content:
				'There’s a small coffee shop I keep going back to, and I think part of the reason is how familiar it’s become. I know where to sit, what to order, and what the space will feel like when I walk in.\n\nThere’s something comforting about repetition. Familiar places give me a sense of stability, especially when other areas of life feel uncertain.\n\nSometimes comfort isn’t about staying stuck—it’s about giving yourself a safe base to return to.',
			published: true,
		},
		{
			seedId: 'resetting-space',
			title: 'Resetting My Space',
			content:
				'I cleaned my desk today and reorganized a few things, and it made a bigger difference than I expected. Clearing physical clutter always seems to quiet mental clutter too.\n\nI didn’t do anything dramatic—just put things back where they belong and got rid of what I wasn’t using. But when I sat down afterward, it felt way easier to focus.\n\nIt’s a small reminder that environment matters and a reset doesn’t require a big life change—just a cleaner surface to work from.',
			published: true,
		},
		{
			seedId: 'midweek-reflections',
			title: 'Midweek Reflections',
			content:
				'This week hasn’t been perfect, but it’s been okay. And I’m learning that "okay" is enough more often than I give it credit for.\n\nThere were moments of stress, moments of doubt, and moments where I felt behind. But there were also small wins, quiet mornings, and conversations that grounded me.\n\nMidweek feels like a good time to check in—not to judge, but to recalibrate. There’s still time to finish the week with intention.',
			published: true,
		},
		{
			seedId: 'small-wins',
			title: 'Small Wins That Made My Week',
			content:
				'I cooked at home a couple of times, finally finished a book I started months ago, and went on a walk even when I didn’t feel like it.\n\nThese small wins didn’t change everything, but they added up. They reminded me that progress is often just showing up for yourself in quiet ways.\n\nI’m trying to notice those moments more.',
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
