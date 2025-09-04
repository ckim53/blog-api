const express = require('express');
const commentsRouter = express.Router({ mergeParams: true });
const commentsController = require('../controllers/commentsController');

commentsRouter.get('/', commentsController.showComments);
commentsRouter.post('/', commentsController.createComment);
commentsRouter.put('/:id', commentsController.editComment);
commentsRouter.delete('/:id', commentsController.deleteComment);

module.exports = commentsRouter;
