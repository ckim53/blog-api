const { prisma } = require('../config/prisma');

const createComment = async (req, res) => {
	try {
		const { content, postId, authorId } = req.body;
		if (!content || !postId || !authorId) {
			return res.status(400).json({
				ok: false,
				error: 'content, postId, and authorId are required',
			});
		}

		const newComment = await prisma.comment.create({
			data: { content, postId, authorId },
			include: { author: true, post: true },
		});

		res.status(201).json({ ok: true, data: newComment });
	} catch (err) {
		res.status(500).json({ ok: false, error: 'Failed to create comment' });
	}
};

const deleteComment = async (req, res) => {
	try {
		const { id } = req.params;
		const commentId = Number(id);

		const comment = await prisma.comment.findUnique({
			where: { id: commentId },
			include: { post: true },
		});

		if (!comment) {
			return res.status(404).json({ ok: false, error: 'Comment not found' });
		}

		if (
			comment.authorId !== req.user.id &&
			comment.post.authorId !== req.user.id
		) {
			return res.status(403).json({ ok: false, error: 'Not authorized' });
		}

		await prisma.comment.delete({ where: { id: commentId } });
		res.sendStatus(204);
	} catch (err) {
		res.status(500).json({ ok: false, error: 'Failed to delete comment' });
	}
};

const editComment = async (req, res) => {
	try {
		const { id } = req.params;
		const commentId = Number(id);

		const comment = await prisma.comment.findUnique({
			where: { id: commentId },
		});

		if (!comment) {
			return res.status(404).json({ ok: false, error: 'Comment not found' });
		}

		if (comment.authorId !== req.user.id) {
			return res.status(403).json({ ok: false, error: 'Not authorized' });
		}

		const updatedComment = await prisma.comment.update({
			where: { id: commentId },
			data: req.body,
		});

		res.json({ ok: true, data: updatedComment });
	} catch (err) {
		res.status(500).json({ ok: false, error: 'Failed to update comment' });
	}
};

const showComments = async (req, res) => {
	try {
		const { id } = req.params;
		const postId = Number(id);

		const comments = await prisma.comment.findMany({
			where: { postId },
			include: { author: true },
		});
		res.json({ ok: true, data: comments });
	} catch (err) {
		res.status(500).json({ ok: false, error: 'Failed to fetch comments' });
	}
};

module.exports = {
	createComment,
	deleteComment,
	editComment,
	showComments,
};
