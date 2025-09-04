const express = require('express');
const commentsRouter = express.Router({ mergeParams: true });
const commentsController = require('../controllers/commentsController');
const { requireAuth } = require('../config/passport');

commentsRouter.get('/', commentsController.showComments);
commentsRouter.post('/', requireAuth, commentsController.createComment);
commentsRouter.put('/:id', requireAuth, commentsController.editComment);
commentsRouter.delete('/:id', requireAuth, commentsController.deleteComment);

module.exports = commentsRouter;
