const express = require('express');
const app = express();
const productsRouter = require('./routes/productsRouter');
const suppliersRouter = require('./routes/suppliersRouter');
const restocksRouter = require('./routes/restocksRouter');
const salesRouter = require('./routes/salesRouter');
const itemRouter = require('./routes/itemRouter');
const controller = require('./controllers/itemController');
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.static(path.join(process.cwd(), "public")));
app.get('/', (req, res) => {
	res.render('index');
});

app.use(express.urlencoded({ extended: true }));
app.use('/products', productsRouter);
app.use('/suppliers', suppliersRouter);
app.use('/restocks', restocksRouter);
app.use('/sales', salesRouter);
app.use('/item', itemRouter);
app.get('/add', controller.showAddForm);
app.get('/edit', controller.showEditForm);
app.get('/delete', controller.deleteItem);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
