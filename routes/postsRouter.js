const express = require('express');
const postsRouter = express.Router();
const postsController = require('../controllers/postsController');
const { requireAuth } = require('../config/passport');

postsRouter.get('/', postsController.showAllPosts);
postsRouter.get('/:id', postsController.showPostDetails);

postsRouter.post('/', requireAuth, postsController.createPost);
postsRouter.put('/:id', requireAuth, postsController.editPost);
postsRouter.delete('/:id', requireAuth, postsController.deletePost);

module.exports = postsRouter;
