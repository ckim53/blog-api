const { Router } = require('express');
const controller = require('../controllers/suppliersController');
const suppliersRouter = Router();

suppliersRouter.get('/', controller.displaySuppliers);
suppliersRouter.post('/add', controller.addSupplier);
suppliersRouter.post('/edit', controller.editSupplier);
module.exports = suppliersRouter;
