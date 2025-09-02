const db = require('../db/queries.js');

async function displayProducts(req, res) {
	const data = await db.display('products');
	res.render('category', { title: 'Products', type: 'products', data });
}

async function addProduct(req, res) {
	const { name, sku, price, quantity, supplier_id } = req.body;
	await db.insertProduct(name, sku, price, quantity, supplier_id);
	res.redirect('/products');
}

async function editProduct(req, res) {
	const { id, name, sku, price, quantity, supplier_id } = req.body;
	await db.updateProduct(id, name, sku, price, quantity, supplier_id);
	res.redirect(`/item?type=products&id=${id}&title=Products`);
}

module.exports = {
	displayProducts,
	addProduct,
	editProduct,
};
