const express = require('express');
const postsRouter = express.Router();
const postsController = require('../controllers/postsController')
postsRouter.get('/', postsController.showAllPosts);
postsRouter.get('/:id', postsController.showPostDetails);
postsRouter.get('/new', (req, res) => {
    res.render('posts/new');
});
postsRouter.post('/', postsController.createPost);
postsRouter.put('/:id', postsController.editPost);
postsRouter.delete('/:id', postsController.deletePost);

module.exports = postsRouter;