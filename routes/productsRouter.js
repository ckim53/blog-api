const { Router } = require('express');
const controller = require('../controllers/productsController');
const productsRouter = Router();

productsRouter.get('/', controller.displayProducts);
productsRouter.post('/add', controller.addProduct);
productsRouter.post('/edit', controller.editProduct);

module.exports = productsRouter;
