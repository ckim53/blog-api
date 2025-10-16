const express = require('express');
const publicPostsRouter = express.Router();
const adminPostsRouter = express.Router({ mergeParams: true });
const postsController = require('../controllers/postsController');
const { requireAuth } = require('../config/passport');
const commentsRouter = require('./commentsRouter');

publicPostsRouter.use('/:postId/comments', commentsRouter);
publicPostsRouter.get('/', postsController.showAllPosts);
publicPostsRouter.get('/:id', postsController.showPostDetails);

adminPostsRouter.use(requireAuth);
adminPostsRouter.use('/:postId/comments', commentsRouter);
adminPostsRouter.get('/', postsController.showAllPostsFromAuthor);
adminPostsRouter.post('/', postsController.createPost);
adminPostsRouter.put('/:id', postsController.editPost);
adminPostsRouter.delete('/:id', postsController.deletePost);

module.exports = { adminPostsRouter, publicPostsRouter };
