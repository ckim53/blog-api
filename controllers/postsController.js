const prisma = require('../config/prisma');

const createPost = async (req, res) => {
	try {
		const { title, content, published } = req.body;
		if (!title || !content) {
			return res
				.status(400)
				.json({ ok: false, error: 'Title and content are required' });
		}
		const newPost = await prisma.post.create({
			data: { title, content, published, authorId: req.body.authorId },
		});
		res.status(201).json({ ok: true, data: newPost });
	} catch (err) {
		res.status(500).json({ ok: false, error: 'Failed to create post' });
	}
};

const deletePost = async (req, res) => {
	try {
		const { id } = req.params;
		const postId = Number(id);

		await prisma.post.delete({ where: { id: postId } });
		res.sendStatus(204);
	} catch (err) {
		res.status(404).json({ ok: false, error: 'Post not found' });
	}
};

const editPost = async (req, res) => {
	try {
		const { id } = req.params;
		const postId = Number(id);

		const updatedPost = await prisma.post.update({
			where: {
				id: postId,
			},
			data: req.body,
		});

		res.json({ ok: true, data: updatedPost });
	} catch (err) {
		res.status(404).json({ ok: false, error: 'Post not found' });
	}
};

const showAllPosts = async (req, res) => {
	try {
		const posts = await prisma.post.findMany({
			where: { published: true },
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
	showPostDetails,
};
