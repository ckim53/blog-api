const { Router } = require('express');
const controller = require('../controllers/salesController');
const salesRouter = Router();

salesRouter.get('/', controller.displaySales);
salesRouter.post('/add', controller.addSales);
salesRouter.post('/edit', controller.editSales);
module.exports = salesRouter;
