const db = require('../db/queries.js');

function formatDate(date) {
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

async function displayRestocks(req, res) {
	const data = await db.display('restocks');
	res.render('category', { title: 'Restocks', type: 'restocks', data });
}

async function addRestock(req, res) {
	const { product_id, quantity } = req.body;
	await db.insertRestock(product_id, quantity);
	res.redirect('/restocks');
}

async function editRestock(req, res) {
	const { id, product_id, quantity } = req.body;
	await db.updateRestock(id, product_id, quantity);
	res.redirect(`/item?type=restocks&id=${id}&title=Restocks`);
}

module.exports = {
	displayRestocks,
	addRestock,
	editRestock,
};
