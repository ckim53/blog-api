const prisma = require('../config/prisma');

const createComment = async (req, res) => {
	try {
		const { content } = req.body;
		const postId = req.params.postId;

		if (!content || !postId) {
			return res.status(400).json({
				ok: false,
				error: 'content and postId are required',
			});
		}

		const newComment = await prisma.comment.create({
			data: { content, postId: Number(postId), authorId: req.user.id },
			include: { author: true, post: true },
		});

		res.status(201).json({ ok: true, data: newComment });
	} catch (err) {
		console.error('Error creating comment:', err);
		res
			.status(500)
			.json({ ok: false, error: err.message || 'Failed to create comment' });
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
			data: req.body,
		});

		res.json({ ok: true, data: updatedComment });
	} catch (err) {
		res.status(500).json({ ok: false, error: 'Failed to update comment' });
	}
};

const showComments = async (req, res) => {
	try {
		const { postId } = req.params;
		const id = Number(postId);

		const comments = await prisma.comment.findMany({
			where: { postId: id },
			include: { author: true },
		});
		res.json({ ok: true, data: comments });
	} catch (err) {
		res.status(500).json({ ok: false, error: err.message });
	}
};

module.exports = {
	createComment,
	deleteComment,
	editComment,
	showComments,
};
