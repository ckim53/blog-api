const db = require('../db/queries.js');

async function displaySuppliers(req, res) {
	const data = await db.display('suppliers');
	res.render('category', { title: 'Suppliers', type: 'suppliers', data });
}

async function addSupplier(req, res) {
	const { name, contact } = req.body;
	await db.insertSupplier(name, contact);
	res.redirect('/suppliers');
}

async function editSupplier(req, res) {
	const { id, title, type, name, contact } = req.body;
	const data = await db.updateSupplier(id, name, contact);
	res.render('item', { title, type, data });
}

module.exports = {
	displaySuppliers,
	addSupplier,
	editSupplier,
};
