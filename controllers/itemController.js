const db = require('../db/queries.js');

async function deleteItem(req, res) {
	const { title, type, id } = req.query;
	await db.deleteItemFromTable(type, id);
	const data = await db.display(type);
	res.render('category', { title, type, data });
}

async function getItem(req, res) {
	const { title, type, id } = req.query;
	const data = await db.getItemDetails(type, id);
	let supplier_name;
	if (type == 'products') {supplier_name = data.name;}
	const singular = title?.endsWith('s') ? title.slice(0, -1) : title;
	res.render('item', { title: singular, type, data, supplier_name});
}

async function showAddForm(req, res) {
	const products = await db.display('products');
	const suppliers = await db.display('suppliers');
	res.render('add', { products, suppliers });
}

async function showEditForm(req, res) {
	const products = await db.display('products');
	const suppliers = await db.display('suppliers');
	const { title, type, id } = req.query;
	const data = await db.getItemDetails(type, id);
	res.render('edit', { id, title, type, data, products, suppliers });
}

module.exports = {
	deleteItem,
	getItem,
	showAddForm,
	showEditForm,
};
