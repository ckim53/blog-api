const prisma = require('../config/prisma');
const redis = require('../config/redis');

const CACHE_KEY = 'public_posts';

const createPost = async (req, res) => {
	try {
		await redis.del('public_posts');
		const { title, content, published } = req.body;
		if (!title || !content) {
			return res
				.status(400)
				.json({ ok: false, error: 'Title and content are required' });
		}
		const newPost = await prisma.post.create({
			data: {
				title,
				content,
				published,
				authorId: Number(req.params.authorId),
			},
		});
		res.status(201).json({ ok: true, data: newPost });
	} catch (err) {
		res.status(500).json({ ok: false, error: 'Failed to create post' });
	}
};

const deletePost = async (req, res) => {
	try {
		await redis.del('public_posts');
		const { id } = req.params;
		const postId = Number(id);

		if (post.isProtected) {
			return res.status(403).json({ message: 'This post cannot be deleted.' });
		}

		await prisma.post.delete({ where: { id: postId } });
		res.sendStatus(204);
	} catch (err) {
		res.status(404).json({ ok: false, error: 'Post not found' });
	}
};

const editPost = async (req, res) => {
	try {
		await redis.del('public_posts');
		const { id, authorId } = req.params;
		const postId = Number(id);
		const post = await prisma.post.findFirst({
			where: { id: postId, authorId: Number(authorId) },
		});

		if (!post) {
			return res.status(404).json({ ok: false, error: 'Post not found' });
		}
		const updatedPost = await prisma.post.update({
			where: {
				id: postId,
			},
			data: req.body,
		});
		res.json({ ok: true, data: updatedPost });
	} catch (err) {
		console.log(err);
		res.status(500).json({ ok: false, error: 'Server Error' });
	}
};

const showAllPosts = async (req, res) => {
	try {
		const cached = await redis.get(CACHE_KEY);
		if (cached) {
			return res.json({
				ok: true,
				data: JSON.parse(cached),
				cached: true,
			});
		}

		const posts = await prisma.post.findMany({
			where: { published: true },
			include: { author: true, comments: true },
		});

		await redis.set(CACHE_KEY, JSON.stringify(posts), {
			EX: 60,
		});

		res.json({ ok: true, data: posts, cached: false });
	} catch (err) {
		console.error(err);
		res.status(500).json({ ok: false, error: 'Failed to fetch posts' });
	}
};

const showAllPostsFromAuthor = async (req, res) => {
	try {
		const authorId = Number(req.params.authorId);
		if (req.user.id !== authorId) {
			return res.status(403).json({ ok: false, error: 'Forbidden' });
		}
		const posts = await prisma.post.findMany({
			where: { authorId },
			include: { author: true, comments: true },
		});
		res.json({ ok: true, data: posts });
	} catch (err) {
		console.error(err);
		res.status(500).json({ ok: false, error: 'Failed to fetch posts' });
	}
};

const showPostDetails = async (req, res) => {
	try {
		const { id } = req.params;
		const postId = Number(id);

		const post = await prisma.post.findUnique({
			where: { id: postId },
			include: { author: true, comments: true },
		});

		if (!post) {
			return res.status(404).json({ ok: false, error: 'Post not found' });
		}
		res.json({ ok: true, data: post });
	} catch (err) {
		res.status(500).json({ ok: false, error: 'Failed to fetch post' });
	}
};

module.exports = {
	createPost,
	deletePost,
	editPost,
	showAllPosts,
	showAllPostsFromAuthor,
	showPostDetails,
};
