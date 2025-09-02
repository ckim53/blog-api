const { Router } = require('express');
const controller = require('../controllers/itemController');
const itemRouter = Router();

itemRouter.get('/', controller.getItem);
module.exports = itemRouter;
